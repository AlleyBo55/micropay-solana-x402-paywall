import { withX402 as originalWithX402 } from '@x402/next';
import { x402ResourceServer } from '@x402/core/server';
import { HTTPFacilitatorClient } from '@x402/core/http';
import { registerExactSvmScheme } from '@x402/svm/exact/server';

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
}

/**
 * Create a specialized Next.js middleware with Solana support pre-configured
 */
export function createX402Middleware(config: X402Config) {
    const facilitatorUrl = config.facilitatorUrl || 'https://x402.org/facilitator';
    const client = new HTTPFacilitatorClient({ url: facilitatorUrl });
    const server = new x402ResourceServer(client);

    // Auto-register Solana scheme
    registerExactSvmScheme(server, {});

    // Return a wrapped withX402 that injects the server instance
    return function withMicropay(handler: any, routeConfig?: any) {
        // Construct standard accepts config if simple config provided
        const finalConfig = routeConfig || {
            accepts: {
                scheme: 'exact',
                payTo: config.walletAddress,
                maxAmountRequired: config.price?.toString() || '0',
                network: config.network === 'mainnet-beta'
                    ? 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
                    : 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
                asset: 'native',
            }
        };

        return originalWithX402(handler, finalConfig, server);
    };
}

// Re-export original for power users
export const withX402 = originalWithX402;
