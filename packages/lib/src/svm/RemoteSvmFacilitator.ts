
import {
    PaymentPayload,
    PaymentRequirements,
    VerifyResponse,
    SettleResponse,
    VerifyError,
    SettleError,
    SupportedResponse
} from '@x402/core/types';

// Define FacilitatorClient interface locally if not exported
interface FacilitatorClient {
    verify(paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<VerifyResponse>;
    settle(paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<SettleResponse>;
    getSupported(extensionKeys?: string[]): Promise<SupportedResponse>;
}

/**
 * Remote SVM Facilitator
 * 
 * Verifies payments by delegating to a hosted facilitator service (e.g. PayAI or x402.org).
 * This allows using advanced features like cross-chain swaps or fiat abstraction handled by the facilitator.
 */
export class RemoteSvmFacilitator implements FacilitatorClient {
    readonly scheme = 'exact';

    private facilitatorUrl: string;

    constructor(facilitatorUrl: string = 'https://facilitator.payai.network') {
        this.facilitatorUrl = facilitatorUrl.replace(/\/$/, ''); // Remove trailing slash
    }

    /**
     * Get supported payment kinds
     */
    async getSupported(extensionKeys: string[] = []): Promise<SupportedResponse> {
        try {
            const response = await fetch(`${this.facilitatorUrl}/supported`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ extensionKeys })
            });

            if (!response.ok) {
                throw new Error(`Facilitator error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            // Fallback if endpoint fails? Or just re-throw
            // For now, re-throw as it's critical
            throw error;
        }
    }

    /**
     * Verify a payment remotely
     */
    async verify(payload: PaymentPayload, requirements: PaymentRequirements): Promise<VerifyResponse> {
        try {
            const response = await fetch(`${this.facilitatorUrl}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payload,
                    requirements
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                return {
                    isValid: false,
                    invalidReason: `Remote Verify Failed (${response.status}): ${errorBody}`
                };
            }

            const result = await response.json();
            return result as VerifyResponse;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new VerifyError(500, {
                isValid: false,
                invalidReason: `Network error: ${errorMessage}`
            });
        }
    }

    /**
     * Settle a payment remotely
     */
    async settle(payload: PaymentPayload, requirements: PaymentRequirements): Promise<SettleResponse> {
        try {
            const response = await fetch(`${this.facilitatorUrl}/settle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payload,
                    requirements
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new SettleError(response.status, {
                    success: false,
                    errorReason: errorBody,
                    transaction: payload.payload.signature as string,
                    network: requirements.network
                });
            }

            return await response.json() as SettleResponse;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new SettleError(500, {
                success: false,
                errorReason: errorMessage,
                transaction: payload.payload.signature as string,
                network: requirements.network
            });
        }
    }
}
