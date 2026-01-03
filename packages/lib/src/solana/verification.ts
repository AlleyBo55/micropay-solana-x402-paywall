// Transaction verification for SOL payments
// SECURITY: On-chain verification, signature validation, replay protection
import { PublicKey, LAMPORTS_PER_SOL, type ParsedTransactionWithMeta } from '@solana/web3.js';
import { getConnection, type SolanaClientConfig } from './client';

/** Result of transaction verification */
export interface TransactionVerificationResult {
    /** Whether the transaction is valid for the payment */
    valid: boolean;
    /** Whether the transaction is confirmed on-chain */
    confirmed: boolean;
    /** Transaction signature */
    signature: string;
    /** Sender wallet address */
    from?: string;
    /** Recipient wallet address */
    to?: string;
    /** Amount transferred in lamports */
    amount?: bigint;
    /** Block time (Unix timestamp) */
    blockTime?: number;
    /** Slot number */
    slot?: number;
    /** Error message if verification failed */
    error?: string;
}

/** Parameters for verifying a payment */
export interface VerifyPaymentParams {
    /** Transaction signature to verify */
    signature: string;
    /** Expected recipient wallet address */
    expectedRecipient: string;
    /** Expected amount in lamports */
    expectedAmount: bigint;
    /** Maximum age of transaction in seconds (default: 300) */
    maxAgeSeconds?: number;
    /** Solana client configuration */
    clientConfig: SolanaClientConfig;
}

// Signature validation regex (base58, 87-88 chars)
const SIGNATURE_REGEX = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/;

// Wallet address validation regex
const WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Validate transaction signature format
 * SECURITY: Prevents malformed signatures from reaching RPC
 */
function isValidSignature(signature: string): boolean {
    if (!signature || typeof signature !== 'string') return false;
    return SIGNATURE_REGEX.test(signature);
}

/**
 * Validate wallet address format
 * SECURITY: Ensures valid base58 address
 */
function isValidWalletAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    return WALLET_REGEX.test(address);
}

/**
 * Parse SOL transfer details from a transaction
 */
function parseSOLTransfer(
    transaction: ParsedTransactionWithMeta,
    expectedRecipient: string
): { from: string; to: string; amount: bigint } | null {
    const instructions = transaction.transaction.message.instructions;

    // Check main instructions
    for (const ix of instructions) {
        if ('parsed' in ix && ix.program === 'system') {
            const parsed = ix.parsed as {
                type: string;
                info: { source: string; destination: string; lamports: number }
            };

            if (parsed.type === 'transfer' && parsed.info.destination === expectedRecipient) {
                return {
                    from: parsed.info.source,
                    to: parsed.info.destination,
                    amount: BigInt(parsed.info.lamports),
                };
            }
        }
    }

    // Check inner instructions
    if (transaction.meta?.innerInstructions) {
        for (const inner of transaction.meta.innerInstructions) {
            for (const ix of inner.instructions) {
                if ('parsed' in ix && ix.program === 'system') {
                    const parsed = ix.parsed as {
                        type: string;
                        info: { source: string; destination: string; lamports: number }
                    };

                    if (parsed.type === 'transfer' && parsed.info.destination === expectedRecipient) {
                        return {
                            from: parsed.info.source,
                            to: parsed.info.destination,
                            amount: BigInt(parsed.info.lamports),
                        };
                    }
                }
            }
        }
    }

    return null;
}

/**
 * Verify a SOL transfer transaction
 * SECURITY: Full on-chain verification with amount/recipient/age checks
 */
export async function verifyPayment(
    params: VerifyPaymentParams
): Promise<TransactionVerificationResult> {
    const {
        signature,
        expectedRecipient,
        expectedAmount,
        maxAgeSeconds = 300,
        clientConfig
    } = params;

    // SECURITY: Validate signature format before RPC call
    if (!isValidSignature(signature)) {
        return { valid: false, confirmed: false, signature, error: 'Invalid signature format' };
    }

    // SECURITY: Validate recipient address format
    if (!isValidWalletAddress(expectedRecipient)) {
        return { valid: false, confirmed: false, signature, error: 'Invalid recipient address' };
    }

    // SECURITY: Validate expected amount is positive
    if (expectedAmount <= 0n) {
        return { valid: false, confirmed: false, signature, error: 'Invalid expected amount' };
    }

    // SECURITY: Enforce reasonable max age (prevent replay with very old transactions)
    const effectiveMaxAge = Math.min(Math.max(maxAgeSeconds, 60), 3600); // 1 min to 1 hour

    const connection = getConnection(clientConfig);

    try {
        const transaction = await connection.getParsedTransaction(signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0,
        });

        if (!transaction) {
            return { valid: false, confirmed: false, signature, error: 'Transaction not found' };
        }

        // Check for transaction errors
        if (transaction.meta?.err) {
            return {
                valid: false,
                confirmed: true,
                signature,
                error: 'Transaction failed on-chain',
            };
        }

        // SECURITY: Validate transaction age (replay protection)
        if (transaction.blockTime) {
            const now = Math.floor(Date.now() / 1000);
            if (now - transaction.blockTime > effectiveMaxAge) {
                return { valid: false, confirmed: true, signature, error: 'Transaction too old' };
            }
            // Also reject future-dated transactions (clock skew attack)
            if (transaction.blockTime > now + 60) {
                return { valid: false, confirmed: true, signature, error: 'Invalid transaction time' };
            }
        }

        // Parse transfer details
        const transferDetails = parseSOLTransfer(transaction, expectedRecipient);

        if (!transferDetails) {
            return {
                valid: false,
                confirmed: true,
                signature,
                error: 'No valid SOL transfer to recipient found',
            };
        }

        // SECURITY: Validate amount (must meet or exceed expected)
        if (transferDetails.amount < expectedAmount) {
            return {
                valid: false,
                confirmed: true,
                signature,
                from: transferDetails.from,
                to: transferDetails.to,
                amount: transferDetails.amount,
                error: 'Insufficient payment amount',
            };
        }

        return {
            valid: true,
            confirmed: true,
            signature,
            from: transferDetails.from,
            to: transferDetails.to,
            amount: transferDetails.amount,
            blockTime: transaction.blockTime ?? undefined,
            slot: transaction.slot,
        };
    } catch (error) {
        // SECURITY: Don't expose internal error details
        return {
            valid: false,
            confirmed: false,
            signature,
            error: 'Verification failed',
        };
    }
}

/**
 * Wait for transaction confirmation
 */
export async function waitForConfirmation(
    signature: string,
    clientConfig: SolanaClientConfig
): Promise<{ confirmed: boolean; slot?: number; error?: string }> {
    if (!isValidSignature(signature)) {
        return { confirmed: false, error: 'Invalid signature format' };
    }

    const connection = getConnection(clientConfig);

    try {
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');

        if (confirmation.value.err) {
            return { confirmed: false, error: 'Transaction failed' };
        }

        return { confirmed: true, slot: confirmation.context?.slot };
    } catch {
        return { confirmed: false, error: 'Confirmation timeout' };
    }
}

/**
 * Get recent transactions for a wallet
 */
export async function getWalletTransactions(
    walletAddress: string,
    clientConfig: SolanaClientConfig,
    limit: number = 20
): Promise<Array<{ signature: string; blockTime?: number; slot: number }>> {
    if (!isValidWalletAddress(walletAddress)) {
        return [];
    }

    // SECURITY: Cap limit to prevent abuse
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const connection = getConnection(clientConfig);

    try {
        const pubkey = new PublicKey(walletAddress);
        const signatures = await connection.getSignaturesForAddress(pubkey, { limit: safeLimit });
        return signatures.map((sig) => ({
            signature: sig.signature,
            blockTime: sig.blockTime ?? undefined,
            slot: sig.slot,
        }));
    } catch {
        return [];
    }
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: bigint | number): number {
    return Number(lamports) / LAMPORTS_PER_SOL;
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): bigint {
    if (!Number.isFinite(sol) || sol < 0) {
        throw new Error('Invalid SOL amount');
    }
    return BigInt(Math.floor(sol * LAMPORTS_PER_SOL));
}
