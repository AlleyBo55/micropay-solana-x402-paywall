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

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const article = getArticleBySlug(slug);

    const [isLocked, setIsLocked] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // Get creator wallet from environment
    const creatorWallet = process.env.NEXT_PUBLIC_CREATOR_WALLET || '';

    // Check if article is already unlocked (from session)
    useEffect(() => {
        async function checkSession() {
            if (!article) return;

            try {
                const response = await fetch('/api/session/validate');
                if (response.ok) {
                    const data = await response.json();
                    if (data.valid) {
                        const isUnlocked =
                            data.session.siteWideUnlock ||
                            data.session.unlockedArticles.includes(article.id);
                        setIsLocked(!isUnlocked);
                    }
                }
            } catch (error) {
                console.error('Session check failed:', error);
            } finally {
                setIsLoading(false);
            }
        }

        checkSession();
    }, [article]);

    const handleUnlock = useCallback(async (signature: string) => {
        if (!article) return;

        try {
            const response = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    signature,
                    articleId: article.id,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Payment verification failed');
            }

            const data = await response.json();
            if (data.success) {
                setIsLocked(false);
            }
        } catch (error) {
            console.error('Unlock failed:', error);
            throw error;
        }
    }, [article]);

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
        <div className="min-h-screen bg-[#FAFAFA] text-[#1D1D1F] font-sans selection:bg-black selection:text-white antialiased">
            {/* Minimal Header */}
            <nav className="border-b border-black/5 sticky top-0 bg-[#FAFAFA]/80 backdrop-blur-md z-40 transition-all">
                <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="group flex items-center gap-2 font-bold text-lg hover:opacity-70 transition-opacity">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
                                <LightningIcon className="w-5 h-5 text-white fill-current" />
                            </div>
                            <span className="tracking-tight hidden sm:block">Micropay</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isLoading && (
                            isLocked ? (
                                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-black/5 text-[#1D1D1F] border border-black/5 flex items-center gap-1.5">
                                    <LockPasswordIcon size={12} />
                                    Premium
                                </span>
                            ) : (
                                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200 flex items-center gap-1.5">
                                    <Tick01Icon size={12} />
                                    Unlocked
                                </span>
                            )
                        )}
                        {/* Avatar/Profile placeholder */}
                        <div className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm" />
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1D1D1F] transition-colors text-sm font-medium group">
                        <ArrowLeft01Icon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>
                </div>

                {/* Article Content */}
                <main className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-black/5">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full" />
                            <p className="text-gray-400 text-sm font-medium animate-pulse">Loading story...</p>
                        </div>
                    ) : (
                        <PaywallOverlay
                            isLocked={isLocked && article.isPremium}
                            articleId={article.id}
                            articleTitle={article.title}
                            priceInLamports={article.priceInLamports}
                            recipientWallet={creatorWallet}
                            onUnlock={handleUnlock}
                        >
                            <ArticleContent article={article} />
                        </PaywallOverlay>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-12 text-center">
                    <p className="text-gray-400 text-sm font-medium">
                        Powered by <span className="text-[#1D1D1F]">x402 Protocol</span> on Solana
                    </p>
                </footer>
            </div>
        </div>
    );
}
