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

    return function withMicropay(handler: any, routeConfig?: any) {
        // Build the payment spec for 402 responses
        const priceValue = config.price?.toString() || '0';
        // x402 SDK uses price * 1M for amount in 402 response
        const amountValue = (BigInt(priceValue) * BigInt(1_000_000)).toString();

        const paymentSpec = {
            scheme: 'exact',
            payTo: config.walletAddress,
            amount: amountValue,
            network: networkId,
            asset: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Native SOL asset
        };

        const finalConfig = routeConfig || {
            accepts: {
                ...paymentSpec,
                price: priceValue, // Include for x402 SDK 402 generation
            }
        };

        // Create the x402 wrapped handler for 402 response generation
        const wrappedHandler = originalWithX402(handler, finalConfig, server);

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
                            amount: amountValue,
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

            // Fall through to x402 SDK for 402 generation
            const compatibleReq = new Proxy(req, {
                get(target, prop) {
                    if (prop === 'url') {
                        return target.nextUrl?.pathname || target.url;
                    }
                    if (prop === 'headers') {
                        const headers = target.headers;
                        return new Proxy(headers, {
                            get(hTarget, hProp) {
                                if (hProp === 'authorization' || hProp === 'Authorization') {
                                    const val = hTarget.get('authorization');
                                    return val;
                                }
                                if (typeof hProp === 'string' &&
                                    !['get', 'set', 'has', 'delete', 'entries', 'keys', 'values', 'forEach', 'append'].includes(hProp) &&
                                    typeof hTarget[hProp as keyof Headers] === 'undefined') {
                                    return hTarget.get(hProp) || undefined;
                                }
                                const val = (hTarget as any)[hProp];
                                return typeof val === 'function' ? val.bind(hTarget) : val;
                            }
                        });
                    }
                    const val = (target as any)[prop];
                    return typeof val === 'function' ? val.bind(target) : val;
                }
            });

            // Delegate to x402 SDK for remote verification or 402 generation
            return await (wrappedHandler as any)(compatibleReq, ctx);
        };
    };
}

// Re-export original for power users
export const withX402 = originalWithX402;
