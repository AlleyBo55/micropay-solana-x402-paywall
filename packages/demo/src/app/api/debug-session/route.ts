import { NextResponse } from 'next/server';
import { createSession } from '@alleyboss/micropay-solana-x402-paywall/session';

export async function GET() {
    try {
        console.log('[Debug Route] Starting simulation...');

        const dummyWallet = '11111111111111111111111111111111';
        const dummyArticleId = 'article-debug-1';
        const dummySecret = 'demo-session-secret-change-me-longer-than-32-chars';

        console.log('[Debug Route] Creating session with:', { dummyWallet, dummyArticleId });

        const { token, session } = await createSession(dummyWallet, dummyArticleId, {
            secret: dummySecret,
            durationHours: 24
        });

        console.log('[Debug Route] Session created. Token:', token.substring(0, 10) + '...');

        const dummyArticle = {
            id: dummyArticleId,
            title: 'Debug Article',
            priceInLamports: BigInt(15000000), // 0.015 SOL
            content: '# Debug Content'
        };

        console.log('[Debug Route] Serializing BigInt...');
        const responseData = {
            message: 'Simulation Success',
            article: {
                ...dummyArticle,
                priceInLamports: dummyArticle.priceInLamports.toString()
            },
            session
        };

        console.log('[Debug Route] Returning JSON...');
        const response = NextResponse.json(responseData);

        response.cookies.set('x402_Debug_Session', token);
        console.log('[Debug Route] Cookie set.');

        return response;

    } catch (error) {
        console.error('[Debug Route] CRASHED:', error);
        return NextResponse.json({
            error: 'Simulation Failed',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
