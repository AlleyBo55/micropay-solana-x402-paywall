'use client';

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

import { usePaywallResource } from '@alleyboss/micropay-solana-x402-paywall/client';
import { useConnection } from '@solana/wallet-adapter-react';
import { ClientWalletMultiButton } from '@/components/ClientWalletMultiButton';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const initialArticle = getArticleBySlug(slug);

    // Wallet Context
    const { connection } = useConnection();
    const wallet = useSolanaWallet(); // Returns wallet adapter interface-like object

    const creatorWallet = process.env.NEXT_PUBLIC_CREATOR_WALLET || '';

    // Use the Library Hook!
    const {
        data: fetchedData,
        isLocked,
        isLoading,
        unlock,
        price,
        recipient,
        error
    } = usePaywallResource({
        url: `/api/articles/${initialArticle?.id}`,
        connection,
        wallet: wallet as any // Cast to satisfy strict interface if needed
    });

    const article = fetchedData?.article || initialArticle;

    // ... rest of UI ...

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
                                <button
                                    onClick={unlock}
                                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                                >
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
                        <ClientWalletMultiButton style={{ height: '32px', borderRadius: '9999px', fontSize: '12px', padding: '0 12px', backgroundColor: '#000' }} />
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
                        <>
                            {error && (
                                <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-center">
                                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-red-100">
                                        {error}
                                    </div>
                                </div>
                            )}
                            <PaywallOverlay
                                isLocked={isLocked && !!article.isPremium}
                                articleId={article.id}
                                articleTitle={article.title}
                                priceInLamports={price || BigInt(article.priceInLamports || 0)}
                                recipientWallet={recipient || creatorWallet}
                                onUnlock={async () => {
                                    if (!wallet.connected) {
                                        alert('Please connect your wallet first (top right)');
                                        return;
                                    }
                                    await unlock();
                                }}
                            >
                                {(() => {
                                    return <ArticleContent article={article} />;
                                })()}
                            </PaywallOverlay>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
