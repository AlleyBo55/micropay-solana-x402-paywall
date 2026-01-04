
import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';
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
    async getSupported(extensionKeys: string[] = []): Promise<SupportedResponse> {
        return {
            kinds: [
                {
                    x402Version: 1,
                    scheme: 'exact',
                    network: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1', // Devnet
                    extra: {}
                },
                {
                    x402Version: 1,
                    scheme: 'exact',
                    network: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp', // Mainnet
                    extra: {}
                }
            ],
            extensions: [],
            signers: {
                'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': [],
                'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': []
            }
        };
    }

    /**
     * Get mechanism-specific extra data
     */
    getExtra(network: Network): Record<string, unknown> | undefined {
        // No extra data needed for simple transfers
        return undefined;
    }

    /**
     * Get default signers (not used for local verification usually, but required by interface)
     */
    getSigners(network: string): string[] {
        return [];
    }

    /**
     * Verify a payment on-chain
     */
    async verify(payload: PaymentPayload, requirements: PaymentRequirements): Promise<VerifyResponse> {
        try {
            const signature = payload.payload.signature as string;
            if (!signature) {
                return { isValid: false, invalidReason: 'Missing signature in payment payload' };
            }

            // 2. Verify Recipient and Amount
            // We look for a transfer instruction to the payTo address
            const payTo = requirements.payTo;
            // Handle both precise amount and maxAmountRequired (from x402 config)
            const amountVal = requirements.amount || (requirements as any).maxAmountRequired || '0';
            const requiredAmount = BigInt(amountVal);

            console.log(`[LocalSvmFacilitator] Verifying signature: ${signature}`);
            console.log(`[LocalSvmFacilitator] Requirements - Amount: ${requiredAmount}, PayTo: ${payTo}`);
            console.log(`[LocalSvmFacilitator] Full Requirements:`, JSON.stringify(requirements));

            // 1. Fetch transaction
            const tx = await this.connection.getParsedTransaction(signature, {
                maxSupportedTransactionVersion: 0,
                commitment: 'confirmed'
            });

            if (!tx) {
                console.error('[LocalSvmFacilitator] Transaction not found or not confirmed');
                return { isValid: false, invalidReason: 'Transaction not found or not confirmed' };
            }

            console.log('[LocalSvmFacilitator] Transaction found. Parsing instructions...');

            // Allow for a small margin of error if needed, but 'exact' scheme usually means exact or more
            // Parse instructions
            const instructions = tx.transaction.message.instructions;
            let paidAmount = 0n;
            let payer: string | undefined = undefined;

            // Simple parser for SystemProgram.transfer
            // In a robust impl, we'd check inner instructions too
            for (const ix of instructions) {
                // Check if it's a parsed system instruction
                if ('program' in ix && ix.program === 'system') {
                    const parsed = (ix as any).parsed;
                    console.log(`[LocalSvmFacilitator] Inspecting IX:`, JSON.stringify(parsed));

                    if (parsed.type === 'transfer') {
                        const info = parsed.info;
                        console.log(`[LocalSvmFacilitator] Found transfer: ${info.lamports} lamports to ${info.destination}`);
                        if (info.destination === payTo) {
                            paidAmount += BigInt(info.lamports);
                            if (!payer) payer = info.source;
                        }
                    }
                }
            }

            console.log(`[LocalSvmFacilitator] Total Paid Correctly: ${paidAmount}`);

            // Check correctness
            if (paidAmount >= requiredAmount) {
                console.log('[LocalSvmFacilitator] Verification SUCCESS');
                return {
                    isValid: true,
                    payer: payer || tx.transaction.message.accountKeys[0].pubkey.toBase58()
                };
            }

            console.error(`[LocalSvmFacilitator] Verification FAILED. Paid: ${paidAmount}, Required: ${requiredAmount}`);
            return {
                isValid: false,
                invalidReason: `Insufficient payment. Required: ${requiredAmount}, Found: ${paidAmount}`,
                payer: payer
            };

        } catch (error: any) {
            console.error('[LocalSvmFacilitator] Verify error:', error);
            // Return VerifyError for protocol compliance
            // We mock a 500 status code since this is a local internal error
            throw new VerifyError(500, {
                isValid: false,
                invalidReason: error.message
            });
        }
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
