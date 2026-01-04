import { withX402 as originalWithX402 } from '@x402/next';
import { x402ResourceServer } from '@x402/core/server';
import { HTTPFacilitatorClient } from '@x402/core/http';
import { registerExactSvmScheme } from '@x402/svm/exact/server';
import { LocalSvmFacilitator } from '../svm/LocalSvmFacilitator';

export { x402ResourceServer };

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
    let facilitatorClient;

    if (config.rpcUrl) {
        // Use local verification if RPC is provided
        facilitatorClient = new LocalSvmFacilitator(config.rpcUrl);
    } else {
        // Fallback to hosted facilitator
        const facilitatorUrl = config.facilitatorUrl || 'https://x402.org/facilitator';
        facilitatorClient = new HTTPFacilitatorClient({
            url: facilitatorUrl,
        });
    }

    const server = new x402ResourceServer(facilitatorClient);

    // Auto-register Solana scheme with default configuration
    registerExactSvmScheme(server);

    // Return a wrapped withX402 that injects the server instance
    return function withMicropay(handler: any, routeConfig?: any) {
        // Construct standard accepts config if simple config provided
        const finalConfig = routeConfig || {
            accepts: {
                scheme: 'exact',
                payTo: config.walletAddress,
                price: config.price?.toString() || '0',
                network: config.network === 'mainnet-beta'
                    ? 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
                    : 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
            }
        };

        const wrappedHandler = originalWithX402(handler, finalConfig, server);

        return async (req: any, ctx: any) => {
            // Compatibility layer: Ensure req.headers supports dictionary access (req.headers['key'])
            // which some libraries expect, even though NextRequest uses standard Headers API
            const compatibleReq = new Proxy(req, {
                get(target, prop) {
                    // console.error(`[ProxyDebug] Access req.${String(prop)}`);
                    if (prop === 'url') {
                        // Compatibility: Libraries often expect relative URL for routing/matching
                        // NextRequest.url is absolute (full href), so return pathname
                        return target.nextUrl?.pathname || target.url;
                    }
                    if (prop === 'headers') {
                        const headers = target.headers;
                        // Start with standard behavior but fallback to .get() for string property access
                        return new Proxy(headers, {
                            get(hTarget, hProp) {
                                // console.error(`[ProxyDebug] Access req.headers.${String(hProp)}`);
                                // If accessing a specific header by name (and it's not a method/internal prop)
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

            return (wrappedHandler as any)(compatibleReq, ctx);
        };
    };
}

// Re-export original for power users
export const withX402 = originalWithX402;
