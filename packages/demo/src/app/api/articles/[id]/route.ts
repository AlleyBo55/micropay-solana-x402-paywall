import { NextRequest, NextResponse } from 'next/server';
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';
import { validateSession, createSession } from '@alleyboss/micropay-solana-x402-paywall/session';
import { LocalSvmFacilitator, RemoteSvmFacilitator } from '@alleyboss/micropay-solana-x402-paywall';
import { getArticleById } from '@/config/articles';
import { getCreatorWallet, getSolanaConfig, getDefaultPrice } from '@/lib/config';

console.log('[API Debug] Module Loading: /api/articles/[id]/route.ts');

const SESSION_SECRET = process.env.SESSION_SECRET || 'demo-session-secret-change-me-longer-than-32-chars';

// Internal handler for successful payment - called by middleware after verification
async function paidHandler(
    req: NextRequest,
    params: { id: string }
) {
    console.log('[API] Entered paidHandler for article:', params.id);
    const article = getArticleById(params.id);
    if (!article) {
        return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    // Extract wallet from x-payment-payer header (set by middleware after verification)
    // Or from x-wallet-address if client sends it
    // Fallback to placeholder for demo purposes
    const walletAddress = req.headers.get('x-payment-payer')
        || req.headers.get('x-wallet-address')
        || '11111111111111111111111111111111';
    console.log('[API Debug] Wallet:', walletAddress);

    try {
        const sessionResult = await createSession(walletAddress, article.id, {
            secret: SESSION_SECRET,
            durationHours: 24,
        });

        const responseData = {
            article: {
                ...article,
                priceInLamports: article.priceInLamports.toString(),
                content: article.content
            }
        };

        const response = NextResponse.json(responseData);

        // Set cookie for future requests
        response.cookies.set('x402_session', sessionResult.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (innerError) {
        console.error('[API Debug] Critical error in paidHandler:', innerError);
        throw innerError;
    }
}

// Export GET with proper middleware-first architecture
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    console.log('[API Debug] GET request for ID:', params.id);

    // Get article to determine pricing and facilitator mode
    const article = getArticleById(params.id);
    if (!article) {
        return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    const solanaConfig = getSolanaConfig();
    const networkId = solanaConfig.network === 'mainnet-beta'
        ? 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
        : 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

    // --------------------------
    // 1. SESSION CHECK (Fast path for returning users)
    // --------------------------
    const sessionToken = req.cookies.get('x402_session')?.value;
    if (sessionToken) {
        const validation = await validateSession(sessionToken, SESSION_SECRET);
        if (validation.valid && validation.session?.unlockedArticles.includes(params.id)) {
            console.log('[API] Session valid - serving content directly');
            return await paidHandler(req, params);
        }
    }

    // --------------------------
    // 2. MIDDLEWARE VERIFICATION (Primary x402 flow)
    // --------------------------
    // Select facilitator based on article mode
    let facilitatorUrl: string | undefined;
    let rpcUrl: string | undefined;

    if (article.id === 'article-5') {
        // Public Facilitator Mode - use remote
        facilitatorUrl = process.env.NEXT_PUBLIC_FACILITATOR_URL || 'https://x402.org/facilitator';
        console.log('[API] Using Public Facilitator:', facilitatorUrl);
    } else {
        // Sovereign Mode - use local RPC
        rpcUrl = solanaConfig.rpcUrl || 'https://api.devnet.solana.com';
        console.log('[API] Using Local Verification via RPC');
    }

    // Create middleware with appropriate facilitator
    const withMicropay = createX402Middleware({
        walletAddress: getCreatorWallet(),
        network: solanaConfig.network,
        price: (Number(article.priceInLamports) / 1_000_000).toString(), // Convert lamports to the expected unit
        rpcUrl: rpcUrl,
        facilitatorUrl: facilitatorUrl,
    });

    // Wrap handler with middleware
    const protectedHandler = withMicropay(
        async (req: any, ctx: any) => paidHandler(req, params),
        {
            accepts: {
                scheme: 'exact',
                payTo: getCreatorWallet(),
                price: (Number(article.priceInLamports) / 1_000_000).toString(),
                network: networkId,
            }
        }
    );

    // Delegate to middleware - it will either:
    // - Return 402 if no payment/invalid payment
    // - Call paidHandler if payment verified
    return (protectedHandler as any)(req, { params });
}
