// Payment verification API endpoint
import { NextRequest, NextResponse } from 'next/server';
import {
    verifyX402Payment,
    decodePaymentRequired,
    type PaymentPayload,
} from '@alleyboss/micropay-solana-x402-paywall';
import { createSession, getSolanaConfig, getCreatorWallet } from '@/lib';
import { getArticleById } from '@/config';

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

        const requirement = paymentRequiredHeader
            ? decodePaymentRequired(paymentRequiredHeader)
            : {
                scheme: 'exact' as const,
                network: x402Network as 'solana-devnet' | 'solana-mainnet',
                maxAmountRequired: article.priceInLamports.toString(),
                resource: `/article/${article.slug}`,
                description: `Unlock: ${article.title}`,
                payTo: getCreatorWallet(),
                maxTimeoutSeconds: 300,
                asset: 'native' as const,
            };

        const payload: PaymentPayload = {
            x402Version: 1,
            scheme: 'exact',
            network: requirement.network,
            payload: { signature },
        };

        const verification = await verifyX402Payment(payload, requirement, config);

        if (!verification.valid) {
            return NextResponse.json(
                { error: 'Payment verification failed', reason: verification.invalidReason },
                { status: 402 }
            );
        }

        // Use the actual sender address from the verified transaction
        const senderAddress = verification.from;
        if (!senderAddress) {
            return NextResponse.json(
                { error: 'Could not determine sender wallet from transaction' },
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
            transaction: verification.transaction,
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error', stack: error instanceof Error ? error.stack : undefined },
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
