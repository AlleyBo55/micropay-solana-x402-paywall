import { withX402 as originalWithX402 } from '@x402/next';
import { x402ResourceServer } from '@x402/core/server';
import { HTTPFacilitatorClient } from '@x402/core/http';
import { registerExactSvmScheme } from '@x402/svm/exact/server';
import { LocalSvmFacilitator } from '../svm/LocalSvmFacilitator';
import type { PayAIPayload } from '../types/payai';

export { x402ResourceServer };

/**
 * Transform PayAI format to x402 format
 */
function transformPayAIToX402(payaiPayload: PayAIPayload, defaultNetwork: string): any {
    const { scheme, networkId, authorization } = payaiPayload;

    const x402Scheme = scheme === 'exact-svm' || scheme === 'exact-evm' ? 'exact' : scheme;

    let network = defaultNetwork;
    if (networkId === 'solana') {
        network = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
    } else if (networkId === 'solana-devnet') {
        network = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
    }

    let signature: string | undefined;
    if (scheme === 'exact-svm' && 'signatures' in authorization) {
        signature = authorization.signatures?.[0];
    }

    return {
        scheme: x402Scheme,
        network,
        payload: {
            signature,
            ...authorization
        },
        paymentDetails: payaiPayload.paymentDetails
    };
}

/**
 * Configuration for the x402 middleware
 */
export interface X402Config {
    /** x402 Facilitator URL (default: x402.org) */
    facilitatorUrl?: string;
    /** Wallet address to receive payments */
    walletAddress: string;
    /** Price in lamports (string or number) */
    price?: string | number;
    /** Network (mainnet-beta or devnet) */
    network?: 'mainnet-beta' | 'devnet';
    /** RPC URL for local verification (optional, enables self-contained validation) */
    rpcUrl?: string;
}

/**
 * Create a specialized Next.js middleware with Solana support pre-configured
 */
export function createX402Middleware(config: X402Config) {
    const isLocalVerification = !!config.rpcUrl;
    let facilitatorClient: LocalSvmFacilitator | HTTPFacilitatorClient;

    if (isLocalVerification) {
        facilitatorClient = new LocalSvmFacilitator(config.rpcUrl!);
    } else {
        const facilitatorUrl = config.facilitatorUrl || 'https://x402.org/facilitator';
        facilitatorClient = new HTTPFacilitatorClient({ url: facilitatorUrl });
    }

    const server = new x402ResourceServer(facilitatorClient);
    registerExactSvmScheme(server);

    const networkId = config.network === 'mainnet-beta'
        ? 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
        : 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

    return function withMicropay(handler: any, _routeConfig?: any) {
        // Build the payment spec for 402 responses
        const priceValue = config.price?.toString() || '0';


        return async (req: any, ctx: any) => {
            const authHeader = req.headers?.get?.('authorization') || req.headers?.authorization;

            // VERIFICATION: Handle both local and remote
            if (authHeader && authHeader.toLowerCase().startsWith('x402 ')) {
                try {
                    const base64Payload = authHeader.slice(5);
                    const payloadJson = Buffer.from(base64Payload, 'base64').toString('utf8');
                    let payload = JSON.parse(payloadJson);

                    // Transform PayAI format to x402 format if needed
                    if (payload.scheme === 'exact-svm' || payload.scheme === 'exact-evm') {
                        payload = transformPayAIToX402(payload, networkId);
                    }

                    const signature = payload.payload?.signature;

                    if (signature) {
                        const verifyPaymentSpec = {
                            scheme: payload.scheme || 'exact',
                            network: payload.network || networkId,
                            amount: priceValue,
                            payTo: config.walletAddress,
                        };

                        let verifyResult;
                        try {
                            verifyResult = await facilitatorClient.verify(payload, verifyPaymentSpec as any);
                        } catch (facilitatorError: any) {
                            // If remote facilitator fails and we have RPC, fallback to local
                            if (!isLocalVerification && config.rpcUrl) {
                                const localFacilitator = new LocalSvmFacilitator(config.rpcUrl);
                                verifyResult = await localFacilitator.verify(payload, verifyPaymentSpec as any);
                            } else {
                                throw facilitatorError;
                            }
                        }

                        if (verifyResult.isValid) {
                            const payerAddress = verifyResult.payer || 'verified';
                            req.headers.set?.('x-payment-payer', payerAddress);
                            return await handler(req, ctx);
                        }
                    }
                } catch (parseError: any) {
                    // Verification failed, fall through to 402 response
                }
            }

            // Generate 402 response directly (bypass upstream 1M multiplier bug)
            const paymentPayload = {
                x402Version: 2,
                error: 'Payment required',
                resource: {
                    url: req.nextUrl?.pathname || req.url,
                    description: '',
                    mimeType: ''
                },
                accepts: [{
                    scheme: 'exact',
                    network: networkId,
                    amount: priceValue, // Use raw lamports, no multiplier
                    asset: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
                    payTo: config.walletAddress,
                    maxTimeoutSeconds: 300,
                    extra: { feePayer: '11111111111111111111111111111111' }
                }]
            };

            const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');

            return new Response(JSON.stringify({}), {
                status: 402,
                headers: {
                    'Content-Type': 'application/json',
                    'payment-required': base64Payload
                }
            });
        };
    };
}

// Re-export original for power users
export const withX402 = originalWithX402;
