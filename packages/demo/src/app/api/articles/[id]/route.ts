import { NextRequest, NextResponse } from 'next/server';
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';
import { validateSession, createSession } from '@alleyboss/micropay-solana-x402-paywall/session';
import { getArticleById } from '@/config/articles';
import { getCreatorWallet, getSolanaConfig, getDefaultPrice } from '@/lib/config';

// Initialize middleware
const solanaConfig = getSolanaConfig();
const withMicropay = createX402Middleware({
    walletAddress: getCreatorWallet(),
    network: solanaConfig.network,
    price: getDefaultPrice().toString()
});

const SESSION_SECRET = process.env.SESSION_SECRET || 'demo-session-secret-change-me';

// Internal handler for successful payment
async function paidHandler(
    req: NextRequest,
    params: { id: string }
) {
    console.log('[API] Entered paidHandler for article:', params.id);
    const article = getArticleById(params.id);
    if (!article) {
        return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    // Payment is valid! Create a session for 24 hours
    // We attempt to extract wallet from headers or assume anonymous for demo (less secure but functional)
    // To be secure, we'd recover signer from Authorization header signature
    // For this demo, we can just create a session for the article

    // In a real app, you'd extract wallet from the signature verification result
    // Here we'll use a placeholder or extract from header if available
    // Use a placeholder valid address if header is missing (e.g. System Program)
    const walletAddress = req.headers.get('x-wallet-address') || '11111111111111111111111111111111';

    const { token } = await createSession(walletAddress, article.id, {
        secret: SESSION_SECRET,
        durationHours: 24,
    });

    const response = NextResponse.json({
        article: {
            ...article,
            content: article.content
        }
    });

    // Set cookie
    response.cookies.set('x402_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
}

// 1. Wrap the handler with x402 middleware
// Note: We need to adapt the signature for the wrapper if needed, 
// but Next.js usually passes (req, ctx)
const protectedHandler = withMicropay(
    async (req: any, ctx: any) => paidHandler(req, ctx.params || ctx)
);

// 2. Export GET with Hybrid Logic
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    // A. Check Session
    const sessionToken = req.cookies.get('x402_session')?.value;
    console.log('[API] GET request. Session present:', !!sessionToken);

    if (sessionToken) {
        const validation = await validateSession(sessionToken, SESSION_SECRET);
        console.log('[API] Session validation:', validation.valid);
        if (validation.valid && validation.session?.unlockedArticles.includes(params.id)) {
            // Valid session -> Serve Content Directly
            return paidHandler(req, params); // Re-use handler logic (without setting new cookie necessarily, or refresh it)
        }
    }

    // B. Fallback to Payment
    // Delegate to x402 middleware
    return (protectedHandler as any)(req, { params });
}
