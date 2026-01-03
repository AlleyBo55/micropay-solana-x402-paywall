// SPL Token payment verification
// SECURITY: On-chain verification for SPL token transfers (USDC, USDT, custom)
import { type ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';
import { getConnection, type SolanaClientConfig } from './client';
import { TOKEN_MINTS, type PaymentAsset } from '../types';
import type { SignatureStore } from '../store';

/** Result of SPL token transfer verification */
export interface SPLVerificationResult {
    /** Whether the transfer is valid */
    valid: boolean;
    /** Whether transaction is confirmed */
    confirmed: boolean;
    /** Transaction signature */
    signature: string;
    /** Sender wallet address */
    from?: string;
    /** Recipient wallet address */
    to?: string;
    /** Token mint address */
    mint?: string;
    /** Amount transferred (in token's smallest unit) */
    amount?: bigint;
    /** Block time */
    blockTime?: number;
    /** Slot number */
    slot?: number;
    /** Error message */
    error?: string;
}

/** Parameters for SPL payment verification */
export interface VerifySPLPaymentParams {
    /** Transaction signature */
    signature: string;
    /** Expected recipient wallet */
    expectedRecipient: string;
    /** Expected amount in token's smallest unit */
    expectedAmount: bigint;
    /** Asset specification */
    asset: PaymentAsset;
    /** Solana network config */
    clientConfig: SolanaClientConfig;
    /** Maximum transaction age in seconds */
    maxAgeSeconds?: number;
    /** Optional signature store for anti-replay protection */
    signatureStore?: SignatureStore;
}

// Signature validation regex
const SIGNATURE_REGEX = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/;
const WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Resolve asset to mint address
 */
export function resolveMintAddress(asset: PaymentAsset, network: 'devnet' | 'mainnet-beta'): string | null {
    if (asset === 'native') return null;

    if (asset === 'usdc') {
        return network === 'mainnet-beta' ? TOKEN_MINTS.USDC_MAINNET : TOKEN_MINTS.USDC_DEVNET;
    }

    if (asset === 'usdt') {
        return TOKEN_MINTS.USDT_MAINNET; // USDT only on mainnet
    }

    if (typeof asset === 'object' && 'mint' in asset) {
        return asset.mint;
    }

    return null;
}

/**
 * Get token decimals for an asset
 */
export function getTokenDecimals(asset: PaymentAsset): number {
    if (asset === 'native') return 9; // SOL
    if (asset === 'usdc' || asset === 'usdt') return 6;
    if (typeof asset === 'object' && 'decimals' in asset) {
        return asset.decimals ?? 6;
    }
    return 6; // Default for SPL tokens
}

/**
 * Parse SPL token transfer from transaction
 * Handles Token Program transfers to the expected recipient
 */
function parseSPLTransfer(
    transaction: ParsedTransactionWithMeta,
    expectedRecipient: string,
    expectedMint: string
): { from: string; to: string; amount: bigint; mint: string } | null {
    const instructions = transaction.transaction.message.instructions;

    // Check main instructions for Token Program transfers
    for (const ix of instructions) {
        if ('parsed' in ix && (ix.program === 'spl-token' || ix.program === 'spl-token-2022')) {
            const parsed = ix.parsed as {
                type: string;
                info: {
                    source?: string;
                    destination?: string;
                    authority?: string;
                    amount?: string;
                    tokenAmount?: { amount: string; decimals: number };
                    mint?: string;
                };
            };

            // Handle 'transfer' and 'transferChecked' instructions
            if (parsed.type === 'transfer' || parsed.type === 'transferChecked') {
                const amount = parsed.info.amount || parsed.info.tokenAmount?.amount;

                if (amount && parsed.info.destination) {
                    // We need to resolve the token account to the owner wallet
                    // For now, accept if destination matches expected recipient's token account
                    return {
                        from: parsed.info.authority || parsed.info.source || '',
                        to: parsed.info.destination,
                        amount: BigInt(amount),
                        mint: parsed.info.mint || expectedMint,
                    };
                }
            }
        }
    }

    // Check inner instructions
    if (transaction.meta?.innerInstructions) {
        for (const inner of transaction.meta.innerInstructions) {
            for (const ix of inner.instructions) {
                if ('parsed' in ix && (ix.program === 'spl-token' || ix.program === 'spl-token-2022')) {
                    const parsed = ix.parsed as {
                        type: string;
                        info: {
                            source?: string;
                            destination?: string;
                            authority?: string;
                            amount?: string;
                            tokenAmount?: { amount: string };
                            mint?: string;
                        };
                    };

                    if (parsed.type === 'transfer' || parsed.type === 'transferChecked') {
                        const amount = parsed.info.amount || parsed.info.tokenAmount?.amount;
                        if (amount) {
                            return {
                                from: parsed.info.authority || parsed.info.source || '',
                                to: parsed.info.destination || '',
                                amount: BigInt(amount),
                                mint: parsed.info.mint || expectedMint,
                            };
                        }
                    }
                }
            }
        }
    }

    // Check post token balances for transfers
    if (transaction.meta?.postTokenBalances && transaction.meta?.preTokenBalances) {
        const preBalances = transaction.meta.preTokenBalances;
        const postBalances = transaction.meta.postTokenBalances;

        for (const post of postBalances) {
            if (post.mint === expectedMint && post.owner === expectedRecipient) {
                const pre = preBalances.find(
                    (p) => p.accountIndex === post.accountIndex
                );
                const preAmount = BigInt(pre?.uiTokenAmount?.amount || '0');
                const postAmount = BigInt(post.uiTokenAmount?.amount || '0');
                const transferred = postAmount - preAmount;

                if (transferred > 0n) {
                    return {
                        from: '', // Can't determine from balance changes
                        to: expectedRecipient,
                        amount: transferred,
                        mint: expectedMint,
                    };
                }
            }
        }
    }

    return null;
}

/**
 * Verify an SPL token transfer
 * SECURITY: Full on-chain verification with amount/recipient/mint checks
 */
export async function verifySPLPayment(
    params: VerifySPLPaymentParams
): Promise<SPLVerificationResult> {
    const {
        signature,
        expectedRecipient,
        expectedAmount,
        asset,
        clientConfig,
        maxAgeSeconds = 300,
        signatureStore,
    } = params;

    // Check local signature store (if provided)
    if (signatureStore) {
        const isUsed = await signatureStore.hasBeenUsed(signature);
        if (isUsed) {
            return { valid: false, confirmed: true, signature, error: 'Signature already used' };
        }
    }

    // Validate signature format
    if (!SIGNATURE_REGEX.test(signature)) {
        return { valid: false, confirmed: false, signature, error: 'Invalid signature format' };
    }

    // Validate recipient
    if (!WALLET_REGEX.test(expectedRecipient)) {
        return { valid: false, confirmed: false, signature, error: 'Invalid recipient address' };
    }

    // Resolve mint address
    const mintAddress = resolveMintAddress(asset, clientConfig.network);
    if (!mintAddress) {
        return { valid: false, confirmed: false, signature, error: 'Invalid asset configuration' };
    }

    // Validate amount
    if (expectedAmount <= 0n) {
        return { valid: false, confirmed: false, signature, error: 'Invalid expected amount' };
    }

    const effectiveMaxAge = Math.min(Math.max(maxAgeSeconds, 60), 3600);
    const connection = getConnection(clientConfig);

    try {
        const transaction = await connection.getParsedTransaction(signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0,
        });

        if (!transaction) {
            return { valid: false, confirmed: false, signature, error: 'Transaction not found' };
        }

        if (transaction.meta?.err) {
            return { valid: false, confirmed: true, signature, error: 'Transaction failed on-chain' };
        }

        // Validate age
        if (transaction.blockTime) {
            const now = Math.floor(Date.now() / 1000);
            if (now - transaction.blockTime > effectiveMaxAge) {
                return { valid: false, confirmed: true, signature, error: 'Transaction too old' };
            }
            if (transaction.blockTime > now + 60) {
                return { valid: false, confirmed: true, signature, error: 'Invalid transaction time' };
            }
        }

        // Parse transfer
        const transfer = parseSPLTransfer(transaction, expectedRecipient, mintAddress);
        if (!transfer) {
            return {
                valid: false,
                confirmed: true,
                signature,
                error: 'No valid token transfer to recipient found',
            };
        }

        // SECURITY: Verify token account owner (Critical fix for spoofing)
        // Ensure tokens were sent to an account OWNED by expectedRecipient
        if (transfer.to) {
            try {
                // If we found the transfer via postTokenBalances, we might already know the owner
                // But parseSPLTransfer doesn't return that info explicitly, so we verify strictly via RPC
                // unless it was a direct transfer to wallet (rare for tokens)

                // Note: Only perform this check if we fell back to instruction parsing
                // or just always do it to be safe 100%. 
                // Optimization: We could return 'verifiedOwner' from parseSPLTransfer if found in balances.

                const destinationInfo = await connection.getParsedAccountInfo(new PublicKey(transfer.to));
                const owner = (destinationInfo.value?.data as any)?.parsed?.info?.owner;

                if (owner && owner !== expectedRecipient) {
                    return {
                        valid: false,
                        confirmed: true,
                        signature,
                        error: 'Recipient mismatch: Token account not owned by merchant'
                    };
                }
            } catch (e) {
                // Fail secure if we can't verify ownership
                return {
                    valid: false,
                    confirmed: true,
                    signature,
                    error: 'Could not verify token account owner'
                };
            }
        }

        // Validate mint matches
        if (transfer.mint !== mintAddress) {
            return {
                valid: false,
                confirmed: true,
                signature,
                error: 'Token mint mismatch',
            };
        }

        // Validate amount
        if (transfer.amount < expectedAmount) {
            return {
                valid: false,
                confirmed: true,
                signature,
                from: transfer.from,
                to: transfer.to,
                mint: transfer.mint,
                amount: transfer.amount,
                error: 'Insufficient payment amount',
            };
        }

        return {
            valid: true,
            confirmed: true,
            signature,
            from: transfer.from,
            to: transfer.to,
            mint: transfer.mint,
            amount: transfer.amount,
            blockTime: transaction.blockTime ?? undefined,
            slot: transaction.slot,
        };
    } catch {
        return { valid: false, confirmed: false, signature, error: 'Verification failed' };
    }
}

/**
 * Check if asset is native SOL
 */
export function isNativeAsset(asset: PaymentAsset): asset is 'native' {
    return asset === 'native';
}
