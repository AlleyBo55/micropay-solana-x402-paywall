'use client';

import React, { useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface PaywallOverlayProps {
    isLocked: boolean;
    articleId: string;
    articleTitle: string;
    priceInLamports: bigint;
    recipientWallet: string;
    /** 
     * Called when user clicks Pay button.
     * Can be async - used directly by the new hook pattern 
     */
    onUnlock: () => void | Promise<void>;
    children: React.ReactNode;
}

export function PaywallOverlay({
    isLocked,
    articleId: _articleId,
    articleTitle: _articleTitle,
    priceInLamports,
    recipientWallet: _recipientWallet,
    onUnlock,
    children,
}: PaywallOverlayProps) {
    const [isUnlocking, setIsUnlocking] = useState(false);

    const priceInSol = Number(priceInLamports) / LAMPORTS_PER_SOL;

    const handlePayClick = async () => {
        setIsUnlocking(true);
        try {
            await onUnlock();
        } catch (err) {
            console.error('Payment failed:', err);
        } finally {
            setIsUnlocking(false);
        }
    };

    if (!isLocked) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred content preview */}
            <div className="relative overflow-hidden cursor-not-allowed select-none">
                {/* The actual content, blurred */}
                <div className="blur-xl pointer-events-none opacity-40 max-h-[500px] overflow-hidden bg-white grayscale-[0.5] transition-all duration-700">
                    {children}
                </div>

                {/* Gradient fade overlay - Fade to White - Extended for smoothness */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Paywall CTA Overlay */}
            <div className="absolute inset-0 flex items-center justify-center top-12 md:top-24 z-10">
                <div className="w-full max-w-sm mx-auto px-4">
                    {/* Apple-style premium card */}
                    <div className="bg-white/80 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] border border-white/50 ring-1 ring-black/5 p-8 text-center transform transition-all hover:scale-[1.01] duration-500">
                        {/* Lock icon */}
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/10">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans tracking-tight">
                            Read the full story
                        </h3>

                        <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                            <span className="text-gray-900">One-time payment.</span> Instant access.<br />
                            No subscription or sign-up needed.
                        </p>

                        <button
                            onClick={handlePayClick}
                            disabled={isUnlocking}
                            className="w-full h-12 bg-[#000000] hover:bg-[#1a1a1a] text-white font-semibold rounded-full transition-all active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 group"
                        >
                            {isUnlocking ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin text-white/50" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span className="tracking-tight">Pay {priceInSol.toFixed(3)} SOL</span>
                                    <svg className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </>
                            )}
                        </button>

                        {/* Footer / Trust signal */}
                        <div className="mt-6 pt-6 border-t border-black/5">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold flex items-center justify-center gap-2">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" /></svg>
                                Secured by Solana
                            </p>
                        </div>

                        <div className="mt-4 flex justify-center">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-[10px] font-bold tracking-wide uppercase border border-yellow-100/50">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Self-Sovereign Mode
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

