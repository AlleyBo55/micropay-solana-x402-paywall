
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
        this.connection = new Connection(rpcUrl, 'confirmed');
    }

    /**
     * Get supported payment kinds
     * Mocking the response of the /supported endpoint
     */
    /**
     * Network Constants - CAIP-2 format for x402 v2
     * These match the official Solana chain IDs used by x402 protocol
     */
    private readonly NETWORKS = {
        DEVNET: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
        MAINNET: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
    } as const;

    /**
     * DUMMY_FEE_PAYER Explanation (for auditors):
     * 
     * In a HOSTED facilitator (like x402.org), the `feePayer` field in the 
     * SupportedResponse.extra specifies which address will pay transaction fees
     * when the facilitator submits transactions on behalf of users.
     * 
     * In LOCAL/SELF-SOVEREIGN mode (this implementation):
     * - The USER pays their own transaction fees directly
     * - The facilitator NEVER submits transactions - it only VERIFIES them
     * - Therefore, no fee payer address is actually used
     * 
     * However, the x402 protocol REQUIRES this field in the response schema.
     * We use the System Program address (all 1s) as a placeholder because:
     * 1. It's clearly not a real wallet (obvious placeholder)
     * 2. It cannot receive funds or sign transactions
     * 3. It signals to developers that fee paying is handled differently
     * 
     * SECURITY NOTE: This is NOT a security risk because:
     * - The fee payer is never used in verify() or settle() methods
     * - Users sign and pay for their own transactions
     * - The address is just a protocol-required placeholder
     * 
     * @see https://docs.x402.org for protocol specification
     */
    private readonly DUMMY_FEE_PAYER = '11111111111111111111111111111111';

    /**
     * Get supported payment kinds
     * Returns x402 v2 compatible response with CAIP-2 network identifiers
     * 
     * NOTE: The feePayer in extra.feePayer is a placeholder only.
     * In self-sovereign mode, users pay their own transaction fees.
     */
    async getSupported(_extensionKeys: string[] = []): Promise<SupportedResponse> {
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
                // Placeholder - in self-sovereign mode, users are their own signers
                'solana:*': [this.DUMMY_FEE_PAYER]
            }
        };

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
     * Verify a payment on-chain
     */
    async verify(payload: PaymentPayload, requirements: PaymentRequirements): Promise<VerifyResponse> {
        try {
            const signature = payload.payload?.signature as string;

            if (!signature) {
                return { isValid: false, invalidReason: 'Missing signature in payment payload' };
            }

            const payTo = requirements.payTo;
            const amountVal = requirements.amount || (requirements as any).maxAmountRequired || '0';
            const requiredAmount = BigInt(amountVal);

            const tx = await this.fetchTransactionWithRetry(signature, 3);

            if (!tx) {
                return { isValid: false, invalidReason: 'Transaction not found or not confirmed' };
            }

            const instructions = tx.transaction.message.instructions;
            let paidAmount = 0n;
            let payer: string | undefined = undefined;

            for (const ix of instructions) {
                if ('program' in ix && ix.program === 'system') {
                    const parsed = (ix as any).parsed;
                    if (parsed?.type === 'transfer' && parsed.info?.destination === payTo) {
                        paidAmount += BigInt(parsed.info.lamports);
                        if (!payer) payer = parsed.info.source;
                    }
                }
            }

            if (paidAmount >= requiredAmount) {
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
