
import { NextRequest } from 'next/server';
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

// 1. Configure Middleware for "Analysis Agent"
// This agent charges for its expertise.
const withPayment = createX402Middleware({
    walletAddress: process.env.CREATOR_WALLET_ADDRESS || 'Eb4x402...',
    price: '2000000', // 0.002 SOL (Fixed price for simplicity in this demo)
    network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet',
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});

async function handler(req: NextRequest) {
    // Payment Validated!
    const body = await req.json().catch(() => ({}));

    return new Response(JSON.stringify({
        success: true,
        agent: "Analysis Agent",
        insight: `Analysis Complete for context: ${body.context || 'General Market'}. SIGNAL: STRONG BUY.`,
        signature: "Valid x402 payment proof received"
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export const POST = withPayment(handler);
