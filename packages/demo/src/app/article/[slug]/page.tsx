'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '@/config';
import { ArticleContent } from '@/components/article';
import { PaywallOverlay } from '@/components/paywall';
import {
    ZapIcon as LightningIcon,
    ArrowLeft01Icon,
    LockPasswordIcon,
    Tick01Icon
} from 'hugeicons-react';

import { createX402AuthorizationHeader } from '@alleyboss/micropay-solana-x402-paywall/client';

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const initialArticle = getArticleBySlug(slug);

    // State
    const [article, setArticle] = useState(initialArticle);
    const [isLocked, setIsLocked] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentHeader, setPaymentHeader] = useState<string | null>(null);

    // Get creator wallet from environment
    const creatorWallet = process.env.NEXT_PUBLIC_CREATOR_WALLET || '';

    // Fetch Article Logic
    useEffect(() => {
        if (!initialArticle) return;

        async function fetchArticle() {
            try {
                // Try to fetch (this handles session check automatically via route.ts)
                const res = await fetch(`/api/articles/${initialArticle?.id}`);

                if (res.status === 402) {
                    // Payment Required
                    const wwwAuth = res.headers.get('WWW-Authenticate');
                    if (wwwAuth) setPaymentHeader(wwwAuth);
                    setIsLocked(true);
                } else if (res.ok) {
                    // Unlocked (valid session)
                    const data = await res.json();
                    setArticle(data.article); // Update with full content from API if applicable
                    setIsLocked(false);
                }
            } catch (error) {
                console.error('Fetch failed:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchArticle();
    }, [initialArticle]);

    const handleUnlock = useCallback(async (signature: string) => {
        if (!article || !paymentHeader) return;

        setIsLoading(true);
        try {
            // Create x402 Authorization header
            const authHeader = createX402AuthorizationHeader(signature, paymentHeader);

            // Re-request article with proof
            // Note: The route.ts will set a session cookie upon success, so future refreshes work
            const response = await fetch(`/api/articles/${article.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': authHeader
                },
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                console.error('[Client] Unlock API failed:', response.status, error);
                throw new Error(error.error || 'Payment verification failed');
            }

            console.log('[Client] Unlock successful, refreshing content');

            const data = await response.json();
            setArticle(data.article);
            setIsLocked(false);
        } catch (error) {
            console.error('Unlock failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [article, paymentHeader]);

    if (!article) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#1D1D1F] mb-4">Article Not Found</h1>
                    <Link href="/" className="text-gray-500 hover:text-black transition-colors flex items-center justify-center gap-2">
                        <ArrowLeft01Icon size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-[#1D1D1F] font-sans selection:bg-black selection:text-white antialiased">
            {/* Apple-style Header */}
            <nav className="border-b border-black/5 sticky top-0 bg-white/80 backdrop-blur-xl z-50 transition-all">
                <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="group flex items-center gap-2 hover:opacity-70 transition-opacity">
                            <ArrowLeft01Icon size={20} className="text-black" />
                            <span className="font-semibold text-sm text-black hidden sm:block">All Articles</span>
                        </Link>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 opacity-100 transition-opacity">
                        <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center text-white shadow-sm">
                            <LightningIcon className="w-3.5 h-3.5 text-white fill-current" />
                        </div>
                        <span className="font-bold tracking-tight text-sm text-black">Micropay</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isLoading && (
                            isLocked ? (
                                <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-1.5">
                                    <LockPasswordIcon size={12} />
                                    Unlock
                                </button>
                            ) : (
                                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center gap-1.5">
                                    <Tick01Icon size={12} />
                                    Unlocked
                                </span>
                            )
                        )}
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
                    </div>
                </div>
            </nav>

            <div className="w-full max-w-3xl mx-auto px-6 pt-16 pb-24">
                {/* Hero Section */}
                <header className="mb-12 text-center md:text-left">
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                            {article.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase tracking-widest font-bold text-black/60">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-black mb-6 leading-[1.1] tracking-tight">
                        {article.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-xl md:text-2xl text-black/70 leading-relaxed font-light mb-8 max-w-2xl">
                        {article.excerpt}
                    </p>

                    {/* Author Meta */}
                    <div className="flex items-center justify-center md:justify-start gap-3 border-t border-b border-gray-100 py-6">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {article.author.avatar && (
                                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-sm text-black">{article.author.name}</div>
                            <div className="text-xs text-black/60 font-medium">
                                {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {article.readingTime}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <main className="relative">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <PaywallOverlay
                            isLocked={isLocked && !!article.isPremium} // Force boolean
                            articleId={article.id}
                            articleTitle={article.title}
                            priceInLamports={BigInt(article.priceInLamports)} // Ensure BigInt
                            recipientWallet={creatorWallet}
                            onUnlock={handleUnlock}
                        >
                            <ArticleContent article={article} />
                        </PaywallOverlay>
                    )}
                </main>
            </div>
        </div>
    );
}
