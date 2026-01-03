'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@/components/providers';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: (signature: string) => void;
    articleTitle: string;
    priceInLamports: bigint;
    recipientWallet: string;
}

type PaymentStatus = 'idle' | 'connecting' | 'paying' | 'confirming' | 'success' | 'error';

export function PaymentModal({
    isOpen,
    onClose,
    onPaymentSuccess,
    articleTitle,
    priceInLamports,
    recipientWallet,
}: PaymentModalProps) {
    const { connected, publicKey, balance, sendPayment, connecting, disconnect } = useWallet();
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [showQR, setShowQR] = useState(false);

    const priceInSol = Number(priceInLamports) / LAMPORTS_PER_SOL;
    const hasEnoughBalance = balance !== null && balance >= priceInSol;

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setError(null);
        }
    }, [isOpen]);

    const handlePayment = useCallback(async () => {
        if (!connected) {
            setStatus('connecting');
            return;
        }

        if (!hasEnoughBalance) {
            setError(`Insufficient balance. You need ${priceInSol.toFixed(4)} SOL.`);
            return;
        }

        setStatus('paying');
        setError(null);

        const result = await sendPayment(recipientWallet, priceInLamports);

        if ('error' in result) {
            setStatus('error');
            setError(result.error);
            return;
        }

        setStatus('success');

        // Small delay for UX, then trigger success callback
        setTimeout(() => {
            onPaymentSuccess(result.signature);
        }, 1500);
    }, [connected, hasEnoughBalance, priceInSol, sendPayment, recipientWallet, priceInLamports, onPaymentSuccess]);

    // Build Solana Pay URL for QR code
    const solanaPayUrl = `solana:${recipientWallet}?amount=${priceInSol}&label=Article%20Unlock&message=${encodeURIComponent(articleTitle)}`;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 text-gray-900">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Unlock Article</h2>
                        <p className="text-gray-500 text-sm line-clamp-2">{articleTitle}</p>
                    </div>

                    {/* Price Display */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 font-medium">Price</span>
                            <div className="flex items-center gap-2">
                                <img src="/solana-logo.svg" alt="SOL" className="w-5 h-5"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span className="text-2xl font-bold text-gray-900">{priceInSol.toFixed(4)} SOL</span>
                            </div>
                        </div>
                        {balance !== null && (
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                                <span className="text-gray-400 text-sm">Your balance</span>
                                <span className={`text-sm font-medium ${hasEnoughBalance ? 'text-green-600' : 'text-red-500'}`}>
                                    {balance.toFixed(4)} SOL
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Status Messages */}
                    {status === 'success' && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-green-800 font-medium">Payment Successful!</p>
                                    <p className="text-green-600 text-sm">Unlocking content...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-red-800 font-medium">Payment Failed</p>
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QR Code Section */}
                    {showQR && (
                        <div className="mb-6 p-6 bg-white border border-gray-100 rounded-xl flex flex-col items-center">
                            <QRCodeSVG
                                value={solanaPayUrl}
                                size={180}
                                level="M"
                                includeMargin={true}
                            />
                            <p className="text-gray-500 text-sm mt-3 text-center">
                                Scan with Solana Pay compatible wallet
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        {!connected ? (
                            <div className="flex justify-center">
                                <WalletMultiButton className="!w-full !justify-center !bg-black hover:!bg-gray-800 !rounded-xl !h-12 !text-base !font-medium !transition-all" />
                            </div>
                        ) : (
                            <button
                                onClick={handlePayment}
                                disabled={status === 'paying' || status === 'confirming' || status === 'success'}
                                className="w-full py-3.5 px-4 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                            >
                                {status === 'paying' || status === 'confirming' ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {status === 'paying' ? 'Sending Payment...' : 'Confirming...'}
                                    </>
                                ) : status === 'success' ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Payment Complete
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Pay {priceInSol.toFixed(4)} SOL
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            onClick={() => setShowQR(!showQR)}
                            className="w-full py-2 px-4 text-gray-500 hover:text-gray-900 text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            {showQR ? 'Hide QR Code' : 'Show QR Code for Mobile'}
                        </button>

                        {connected && (
                            <button
                                onClick={async () => {
                                    await disconnect();
                                }}
                                className="w-full py-2 px-4 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                            >
                                Change Wallet
                            </button>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 pt-4 border-t border-gray-100">
                        <p className="text-gray-400 text-xs text-center">
                            Powered by x402 Protocol on Solana • Fast & Low Cost
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}
