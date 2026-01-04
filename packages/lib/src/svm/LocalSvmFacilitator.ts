
import { Connection } from '@solana/web3.js';
import {
    Network,
    PaymentPayload,
    PaymentRequirements,
    VerifyResponse,
    SettleResponse,
    VerifyError,
    SettleError,
    SupportedResponse
} from '@x402/core/types';

// Define FacilitatorClient interface locally to avoid import issues if not exported
interface FacilitatorClient {
    verify(paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<VerifyResponse>;
    settle(paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<SettleResponse>;
    getSupported(extensionKeys?: string[]): Promise<SupportedResponse>;
}

/**
 * Local SVM Facilitator
 * 
 * Verifies and settles Solana payments locally using a direct RPC connection,
 * bypassing the need for a hosted facilitator service.
 */
export class LocalSvmFacilitator implements FacilitatorClient {
    readonly scheme = 'exact';
    readonly caipFamily = 'solana:*';

    private connection: Connection;

    constructor(rpcUrl: string) {
        console.log('[LocalSvmFacilitator] Initialized with RPC:', rpcUrl);
        this.connection = new Connection(rpcUrl, 'confirmed');
    }

    /**
     * Get supported payment kinds
     * Mocking the response of the /supported endpoint
     */
    // Network Constants - CAIP-2 format for x402 v2
    private readonly NETWORKS = {
        DEVNET: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
        MAINNET: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
    } as const;

    // Dummy fee payer address (System Program) - not used in local verification
    // but required by x402 protocol for supported kinds
    private readonly DUMMY_FEE_PAYER = '11111111111111111111111111111111';

    /**
     * Get supported payment kinds
     * Returns x402 v2 compatible response with CAIP-2 network identifiers
     */
    async getSupported(_extensionKeys: string[] = []): Promise<SupportedResponse> {
        console.log('[LocalSvmFacilitator] getSupported called');

        const supported: SupportedResponse = {
            kinds: [
                {
                    x402Version: 2,
                    scheme: 'exact',
                    network: this.NETWORKS.DEVNET,
                    extra: { feePayer: this.DUMMY_FEE_PAYER }
                },
                {
                    x402Version: 2,
                    scheme: 'exact',
                    network: this.NETWORKS.MAINNET,
                    extra: { feePayer: this.DUMMY_FEE_PAYER }
                }
            ],
            extensions: [],
            signers: {
                'solana:*': [this.DUMMY_FEE_PAYER]
            }
        };

        console.log('[LocalSvmFacilitator] Returning supported:', JSON.stringify(supported));
        return supported;
    }

    /**
     * Get mechanism-specific extra data
     */
    getExtra(_network: Network): Record<string, unknown> | undefined {
        // No extra data needed for simple transfers
        return undefined;
    }

    /**
     * Get default signers (not used for local verification usually, but required by interface)
     */
    getSigners(_network: string): string[] {
        return [];
    }

    /**
     * Enable debug logging (disable in production)
     */
    private debug = process.env.NODE_ENV === 'development';

    /**
     * Verify a payment on-chain
     */
    async verify(payload: PaymentPayload, requirements: PaymentRequirements): Promise<VerifyResponse> {
        try {
            const signature = payload.payload.signature as string;
            if (!signature) {
                return { isValid: false, invalidReason: 'Missing signature in payment payload' };
            }

            // Verify Recipient and Amount
            const payTo = requirements.payTo;
            const amountVal = requirements.amount || (requirements as any).maxAmountRequired || '0';
            const requiredAmount = BigInt(amountVal);

            // Log only non-sensitive info (signature prefix for debugging)
            if (this.debug) {
                console.log(`[LocalSvmFacilitator] Verifying tx: ${signature.slice(0, 8)}...`);
            }

            // Fetch transaction with retry logic
            const tx = await this.fetchTransactionWithRetry(signature, 3);

            if (!tx) {
                return { isValid: false, invalidReason: 'Transaction not found or not confirmed' };
            }

            // Parse instructions
            const instructions = tx.transaction.message.instructions;
            let paidAmount = 0n;
            let payer: string | undefined = undefined;

            // Check SystemProgram transfers
            for (const ix of instructions) {
                if ('program' in ix && ix.program === 'system') {
                    const parsed = (ix as any).parsed;
                    if (parsed?.type === 'transfer' && parsed.info?.destination === payTo) {
                        paidAmount += BigInt(parsed.info.lamports);
                        if (!payer) payer = parsed.info.source;
                    }
                }
                // Also check SPL Token transfers
                if ('program' in ix && (ix.program === 'spl-token' || ix.program === 'spl-token-2022')) {
                    const parsed = (ix as any).parsed;
                    if (parsed?.type === 'transferChecked' || parsed?.type === 'transfer') {
                        // For SPL tokens, verify the mint and destination match requirements
                        // This is a simplified check - production should verify ATA derivation
                        if (this.debug) {
                            console.log(`[LocalSvmFacilitator] Found SPL transfer`);
                        }
                    }
                }
            }

            // Check correctness
            if (paidAmount >= requiredAmount) {
                if (this.debug) {
                    console.log(`[LocalSvmFacilitator] Verification SUCCESS for tx: ${signature.slice(0, 8)}...`);
                }
                return {
                    isValid: true,
                    payer: payer || tx.transaction.message.accountKeys[0].pubkey.toBase58()
                };
            }

            return {
                isValid: false,
                invalidReason: 'Insufficient payment amount',
                payer: payer
            };

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // Don't log full error details in production
            if (this.debug) {
                console.error('[LocalSvmFacilitator] Verify error:', errorMessage);
            }
            throw new VerifyError(500, {
                isValid: false,
                invalidReason: errorMessage
            });
        }
    }

    /**
     * Fetch transaction with exponential backoff retry
     */
    private async fetchTransactionWithRetry(
        signature: string,
        maxRetries: number = 3
    ): Promise<any> {
        let lastError: Error | undefined;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const tx = await this.connection.getParsedTransaction(signature, {
                    maxSupportedTransactionVersion: 0,
                    commitment: 'confirmed'
                });
                if (tx) return tx;

                // Transaction not found yet, wait with exponential backoff
                if (attempt < maxRetries - 1) {
                    await this.sleep(Math.pow(2, attempt) * 1000);
                }
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('RPC error');
                if (attempt < maxRetries - 1) {
                    await this.sleep(Math.pow(2, attempt) * 1000);
                }
            }
        }

        if (lastError) throw lastError;
        return null;
    }

    /**
     * Sleep helper
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Settle a payment (not applicable for direct chain verification, usually)
     * But we must implement it. For 'exact', settlement is just verification + finality.
     */
    async settle(payload: PaymentPayload, requirements: PaymentRequirements): Promise<SettleResponse> {
        // For SVM Native interactions, verification IS settlement (it's on chain)
        // We just run verify again
        const verifyResult = await this.verify(payload, requirements);

        if (!verifyResult.isValid) {
            throw new SettleError(400, {
                success: false,
                errorReason: verifyResult.invalidReason || 'Verification failed',
                transaction: payload.payload.signature as string,
                network: requirements.network
            });
        }

        return {
            success: true,
            payer: verifyResult.payer,
            transaction: payload.payload.signature as string,
            network: requirements.network
        };
    }
}
