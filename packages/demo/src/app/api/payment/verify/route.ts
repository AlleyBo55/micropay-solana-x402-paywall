// Payment verification API endpoint
import { NextRequest, NextResponse } from 'next/server';
import {
    LocalSvmFacilitator,
    type PaymentPayload,
} from '@alleyboss/micropay-solana-x402-paywall';
import { createSession, getSolanaConfig, getCreatorWallet } from '@/lib';
import { getArticleById } from '@/config';
import { decodePaymentRequiredHeader } from '@x402/core/http'; // Fixed import name

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { signature, articleId, paymentRequiredHeader } = body;

        if (!signature || !articleId) {
            return NextResponse.json(
                { error: 'Missing required fields: signature, articleId' },
                { status: 400 }
            );
        }

        const article = getArticleById(articleId);
        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        const config = getSolanaConfig();
        const x402Network = config.network === 'mainnet-beta' ? 'solana-mainnet' : 'solana-devnet';

        // Decode requirements if provided, else construct default
        const requirement = paymentRequiredHeader
            ? decodePaymentRequiredHeader(paymentRequiredHeader) // Fixed function call
            : {
                scheme: 'exact' as const,
                network: x402Network as 'solana-devnet' | 'solana-mainnet',
                amount: article.priceInLamports.toString(),
                resource: `/article/${article.slug}`,
                description: `Unlock: ${article.title}`,
                payTo: getCreatorWallet(),
                expiration: new Date(Date.now() + 300000).toISOString(),
                assets: [{ type: 'native' }]
            };

        // Construct standard payload for facilitator
        // Cast to any because SDK types may not match our extended structure
        const paymentPayload = {
            scheme: 'exact',
            network: x402Network,
            payload: { signature },
        } as any;

        const facilitator = new LocalSvmFacilitator(config.rpcUrl || 'https://api.devnet.solana.com');

        // Reconstruct auth header manually (optional, but good for conformity)
        const token = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
        const auth = `x402 ${token}`;

        // Verify using the facilitator
        // We cast to 'any' because strict type checking between local/core types might mismatch in this wrapped context
        // but the runtime logic is sound. We pass paymentPayload which matches structure.
        const verification = await facilitator.verify(paymentPayload, requirement as any);

        if (!verification.isValid) {
            return NextResponse.json(
                { error: 'Payment verification failed', reason: verification.invalidReason },
                { status: 402 }
            );
        }

        const senderAddress = verification.payer;
        if (!senderAddress) {
            return NextResponse.json(
                { error: 'Could not determine sender wallet' },
                { status: 500 }
            );
        }

        const { session } = await createSession(senderAddress, articleId);

        return NextResponse.json({
            success: true,
            session: {
                id: session.id,
                expiresAt: session.expiresAt,
                unlockedArticles: session.unlockedArticles,
            },
            // transaction: verification.transaction 
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
