import { NextRequest, NextResponse } from 'next/server';
import { withX402 } from '@x402/next';
import { getArticleById } from '@/config/articles';
import {
    x402Server,
    SOLANA_NETWORK,
    CREATOR_WALLET
} from '@/lib/x402-config';

// Wrapped handler for x402 protection
const getArticle = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const article = getArticleById(id);

    if (!article) {
        return NextResponse.json(
            { error: 'Article not found' },
            { status: 404 }
        );
    }

    // Return full article content only if payment is satisfied
    // The withX402 middleware handles the 402 checks and payment verification
    return NextResponse.json({
        article: {
            ...article,
            content: article.content // This is the premium content
        },
        unlocked: true
    });
};

// Export the GET handler wrapped with x402 protection
export const GET = (req: NextRequest, props: any) => {
    // We need to dynamically construct the route config based on the requested article
    // But withX402 expects a static config or we need a way to look it up.
    // Limitation: withX402 wraps the handler with ONE config.
    // To handle dynamic prices per article, we need to implement a dynamic handler.

    // For now, let's look up the article ID from the URL manually to set price
    const id = req.nextUrl.pathname.split('/').pop() || '';
    const article = getArticleById(id);

    const price = article?.priceInLamports?.toString() || '10000000';
    const title = article?.title || 'Premium Article';

    return withX402(
        getArticle,
        {
            accepts: {
                scheme: 'exact',
                payTo: CREATOR_WALLET,
                maxAmountRequired: price,
                network: SOLANA_NETWORK,
                asset: 'native',
            },
            description: `Unlock article: ${title}`,
        },
        x402Server
    )(req, props);
};
