
import { NextRequest } from 'next/server';
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

// 1. Configure the 402 Middleware
const withPayment = createX402Middleware({
    walletAddress: process.env.CREATOR_WALLET_ADDRESS || 'Eb4x402...', // Fallback just in case
    price: '1000000', // 0.001 SOL
    network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});

// 2. Define the Handler
async function handler(req: NextRequest) {
    // If we get here, payment is valid!
    return new Response(JSON.stringify({
        success: true,
        data: {
            usage: "Oracle Computation",
            result: "The answer is 42. Market sentiment is BULLISH.",
            timestamp: new Date().toISOString()
        }
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

// 3. Export wrapped handler
export const GET = withPayment(handler);
export const POST = withPayment(handler);
