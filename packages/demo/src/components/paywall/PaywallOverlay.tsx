'use client';

import React, { useState, useEffect } from 'react';
import { PaymentModal } from './PaymentModal';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface PaywallOverlayProps {
    isLocked: boolean;
    articleId: string;
    articleTitle: string;
    priceInLamports: bigint;
    recipientWallet: string;
    onUnlock: (signature: string) => void;
    children: React.ReactNode;
}

export function PaywallOverlay({
    isLocked,
    articleId,
    articleTitle,
    priceInLamports,
    recipientWallet,
    onUnlock,
    children,
}: PaywallOverlayProps) {
    const [showModal, setShowModal] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);

    const priceInSol = Number(priceInLamports) / LAMPORTS_PER_SOL;

    const handlePaymentSuccess = async (signature: string) => {
        setIsUnlocking(true);

        // Call the unlock handler
        try {
            await onUnlock(signature);
        } finally {
            setIsUnlocking(false);
            setShowModal(false);
        }
    };

    if (!isLocked) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred content preview */}
            <div className="relative overflow-hidden">
                {/* The actual content, blurred */}
                <div className="blur-md select-none pointer-events-none opacity-40 max-h-[600px] overflow-hidden bg-white">
                    {children}
                </div>

                {/* Gradient fade overlay - Fade to White */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
            </div>

            {/* Paywall CTA Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pt-20">
                <div className="relative max-w-md mx-auto p-8 text-center z-10 p-8">
                    {/* Clean Minimal Card */}
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8">
                        {/* Lock icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6 text-gray-900">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">
                            Read the full story
                        </h3>

                        {/* Description */}
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Unlock this article with a one-time micropayment.
                            <br /><span className="text-gray-900 font-medium">No subscription required.</span>
                        </p>

                        {/* Price tag */}
                        <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 mb-8">
                            <span className="text-xl font-bold text-gray-900">{priceInSol.toFixed(4)} SOL</span>
                            <span className="text-gray-400 text-sm">≈ ${(priceInSol * 150).toFixed(2)}</span>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={isUnlocking}
                            className="w-full py-3.5 px-6 bg-black hover:bg-gray-900 text-white font-medium rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUnlocking ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Unlocking...
                                </>
                            ) : (
                                "Unlock now"
                            )}
                        </button>

                        {/* Features */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Instance access
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    24h session
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onPaymentSuccess={handlePaymentSuccess}
                articleTitle={articleTitle}
                priceInLamports={priceInLamports}
                recipientWallet={recipientWallet}
            />
        </div>
    );
}
