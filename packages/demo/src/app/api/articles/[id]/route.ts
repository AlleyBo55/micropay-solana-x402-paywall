import { NextRequest, NextResponse } from 'next/server';
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';
import { validateSession, createSession } from '@alleyboss/micropay-solana-x402-paywall/session';
import { getArticleById } from '@/config/articles';
import { getCreatorWallet, getSolanaConfig } from '@/lib/config';

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
    console.log('[API Debug] Session token present:', !!sessionToken);

    if (sessionToken) {
        const validation = await validateSession(sessionToken, SESSION_SECRET);
        if (validation.valid && validation.session?.unlockedArticles.includes(params.id)) {
            console.log('[API] Session valid - serving content directly');
            return await paidHandler(req, params);
        }
    }

    // Check for payment signature header
    const paymentSig = req.headers.get('x-payment-signature');
    const authHeader = req.headers.get('authorization');
    console.log('[API Debug] Payment headers:', {
        'x-payment-signature': paymentSig ? 'present' : 'missing',
        'authorization': authHeader ? 'present' : 'missing',
        allHeaders: Array.from(req.headers.keys())
    });

    // --------------------------
    // 2. MIDDLEWARE VERIFICATION (Primary x402 flow)
    // --------------------------

    // Select facilitator based on article mode
    let facilitatorUrl: string | undefined;
    let rpcUrl: string | undefined;
    let payTo: string = getCreatorWallet();

    switch (article.mode) {
        case 'platform':
            facilitatorUrl = process.env.PLATFORM_FACILITATOR_URL || process.env.NEXT_PUBLIC_PLATFORM_FACILITATOR_URL;
            // Fallback to local RPC if no facilitator URL
            if (!facilitatorUrl) {
                rpcUrl = solanaConfig.rpcUrl || 'https://api.devnet.solana.com';
                console.log('[API] Mode: Platform - No facilitator URL, using local RPC');
            } else {
                console.log('[API] Mode: Platform Facilitated -', facilitatorUrl);
            }
            payTo = getCreatorWallet();
            break;

        case 'payai':
            facilitatorUrl = process.env.PAYAI_FACILITATOR_URL || process.env.NEXT_PUBLIC_PAYAI_FACILITATOR_URL || 'https://facilitator.payai.network';
            payTo = getCreatorWallet();
            console.log('[API] Mode: PayAI Network -', facilitatorUrl);
            break;

        case 'hybrid':
            rpcUrl = solanaConfig.rpcUrl || 'https://api.devnet.solana.com';
            payTo = getCreatorWallet();
            console.log('[API] Mode: Hybrid (Local verification)');
            break;

        case 'sovereign':
        default:
            rpcUrl = solanaConfig.rpcUrl || 'https://api.devnet.solana.com';
            payTo = getCreatorWallet();
            console.log('[API] Mode: Sovereign - RPC:', rpcUrl);
            break;
    }

    console.log('[API] Verification:', facilitatorUrl ? `Remote (${facilitatorUrl})` : `Local (${rpcUrl})`);

    // Debug Configuration
    console.log('[API Debug] Middleware Config:', {
        mode: article.mode,
        facilitatorUrl,
        rpcUrl,
        payTo,
        priceLamports: article.priceInLamports.toString(),
        network: solanaConfig.network
    });

    // Create middleware
    // NOTE: x402 SDK internally multiplies 'price' by 1,000,000 to get 'amount' in lamports
    // So we divide by 1M here to compensate and get the correct final amount
    const priceForMiddleware = (Number(article.priceInLamports) / 1_000_000).toString();

    const withMicropay = createX402Middleware({
        walletAddress: payTo,
        network: solanaConfig.network,
        price: priceForMiddleware,
        rpcUrl: rpcUrl || solanaConfig.rpcUrl || 'https://api.devnet.solana.com', // Always provide RPC for fallback
        facilitatorUrl: facilitatorUrl,
    });

    // Wrap handler
    const protectedHandler = withMicropay(
        async (req: any) => {
            console.log('[API Debug] Verification SUCCESS. Executing paidHandler...');
            return paidHandler(req, params);
        }
    );

    // Delegate to middleware
    return (protectedHandler as any)(req, { params }).catch(async (err: any) => {
        console.error('[API Debug] Verification FAILED:', err);
        return NextResponse.json({
            error: 'Payment Verification Failed',
            details: err.message || 'Unknown error'
        }, { status: 402 });
    });
}
