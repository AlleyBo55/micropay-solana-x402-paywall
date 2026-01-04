import { NextRequest, NextResponse } from 'next/server';
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';
import { validateSession, createSession } from '@alleyboss/micropay-solana-x402-paywall/session';
import { LocalSvmFacilitator } from '@alleyboss/micropay-solana-x402-paywall';
import { getArticleById } from '@/config/articles';
import { getCreatorWallet, getSolanaConfig, getDefaultPrice } from '@/lib/config';

console.log('[API Debug] Module Loading: /api/articles/[id]/route.ts');
// Initialize middleware logic moved inside handler to prevent boot crashes
// const solanaConfig = getSolanaConfig();
// const withMicropay = ...

const SESSION_SECRET = process.env.SESSION_SECRET || 'demo-session-secret-change-me-longer-than-32-chars';

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
    // We'll use a placeholder or extract from header if available
    const walletAddress = req.headers.get('x-wallet-address') || '11111111111111111111111111111111';
    console.log('[API Debug] Wallet:', walletAddress);

    try {
        console.log('[API Debug] Creating session...');
        const sessionResult = await createSession(walletAddress, article.id, {
            secret: SESSION_SECRET,
            durationHours: 24,
        });
        console.log('[API Debug] Session created. Token length:', sessionResult.token.length);

        console.log('[API Debug] Serializing article...');
        const responseData = {
            article: {
                ...article,
                priceInLamports: article.priceInLamports.toString(),
                content: article.content
            }
        };
        console.log('[API Debug] Article serialized.');

        const response = NextResponse.json(responseData);
        console.log('[API Debug] Response object created.');

        // Set cookie
        response.cookies.set('x402_session', sessionResult.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });
        console.log('[API Debug] Cookie set.');

        return response;
    } catch (innerError) {
        console.error('[API Debug] Critical error in paidHandler:', innerError);
        throw innerError;
    }
}

// 1. Wrap the handler with x402 middleware
// Note: We need to adapt the signature for the wrapper if needed, 
// but Next.js usually passes (req, ctx)
// const protectedHandler = withMicropay(
//    async (req: any, ctx: any) => paidHandler(req, ctx.params || ctx)
// );

// 2. Export GET with Hybrid Logic
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    console.error('[API Debug] GET request matched for ID:', params.id);
    console.error('[API Debug] Method:', req.method);
    console.error('[API Debug] Authorization Header:', req.headers.get('authorization'));
    // console.error('[API Debug] All Headers:', Object.fromEntries(req.headers.entries()));

    // Initialize config early
    const solanaConfig = getSolanaConfig();
    const withMicropay = createX402Middleware({
        walletAddress: getCreatorWallet(),
        network: solanaConfig.network,
        price: (Number(getDefaultPrice()) / 1000000).toString(),
        rpcUrl: solanaConfig.rpcUrl
    });

    // A. Check Session
    const sessionToken = req.cookies.get('x402_session')?.value;
    console.log('[API] GET request. Session present:', !!sessionToken);

    if (sessionToken) {
        const validation = await validateSession(sessionToken, SESSION_SECRET);
        console.log('[API] Session validation:', validation.valid);
        if (validation.valid && validation.session?.unlockedArticles.includes(params.id)) {
            // Valid session -> Serve Content Directly
            console.log('[API] Invoking paidHandler for session-authorized request');
            try {
                return await paidHandler(req, params);
            } catch (err) {
                console.error('[API] paidHandler failed:', err);
                return Response.json({ error: 'Internal Server Error' }, { status: 500 });
            }
        }
    }
    // B. Check for Payment Header (Manual Verification Fallback)
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('x402 ')) {
        // console.log('[API Debug] Manual Verify: x402 header found.');
        try {
            const token = authHeader.replace('x402 ', '');
            const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
            const payload = JSON.parse(jsonStr);
            // console.log('[API Debug] Manual Verify: Payload parsed.');

            const article = getArticleById(params.id);
            if (article) {
                const facilitator = new LocalSvmFacilitator(solanaConfig.rpcUrl || 'https://api.devnet.solana.com');
                const requirements = {
                    amount: article.priceInLamports.toString(),
                    payTo: getCreatorWallet(),
                    network: solanaConfig.network === 'mainnet-beta' ? 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' : 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1'
                };

                // Construct payload expected by verify. In x402 payload structure:
                // { payment: { signature: ... }, client: ... }
                // verify() expects { payload: ... } where payload is the payment object usually?
                // Looking at LocalSvmFacilitator source in my previous cat...
                // verify(payload: PaymentPayload, ...)
                // PaymentPayload interface: { payload: any; scheme: string; }
                const paymentPayload = {
                    payload: payload.payment || payload, // Handle both wrapped and unwrapped just in case
                    scheme: 'exact'
                };

                const result = await facilitator.verify(paymentPayload as any, requirements as any);
                if (result.isValid) {
                    console.log('[API] Manual Verification SUCCESS. Unlocking content.');
                    return await paidHandler(req, params);
                } else {
                    console.error('[API] Manual Verification FAILED:', result);
                }
            }
        } catch (e) {
            console.error('[API] Manual Verification ERROR:', e);
        }
    }

    // C. Fallback to Payment Request (return 402)
    const article = getArticleById(params.id);
    if (!article) {
        return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    const network = solanaConfig.network;
    const networkId = network === 'mainnet-beta'
        ? 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'
        : 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

    // Create a dynamic handler for THIS article's price
    // Config initialized at top of function

    const dynamicHandler = withMicropay(
        async (req: any, ctx: any) => paidHandler(req, params), // reuse resolved params
        {
            accepts: {
                scheme: 'exact',
                payTo: getCreatorWallet(),
                price: (Number(article.priceInLamports) / 1000000).toString(),
                network: networkId,
            }
        }
    );

    // Delegate to x402 middleware
    return (dynamicHandler as any)(req, { params });
}
