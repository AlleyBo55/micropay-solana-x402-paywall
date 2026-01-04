// React Hooks for x402 Micropayments
// Client-side hooks for payment UI and pricing display

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSolPrice, type PriceData } from '../pricing';

/**
 * Hook to fetch and display SOL price with auto-refresh
 * 
 * @example
 * ```tsx
 * function PriceDisplay() {
 *   const { solPrice, source, isLoading, error, refresh } = usePricing();
 *   
 *   if (isLoading) return <span>Loading...</span>;
 *   if (error) return <span>Price unavailable</span>;
 *   
 *   return <span>SOL: ${solPrice?.toFixed(2)} (via {source})</span>;
 * }
 * ```
 */
export function usePricing(refreshIntervalMs: number = 60000) {
    const [priceData, setPriceData] = useState<PriceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchPrice = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getSolPrice();
            setPriceData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch price');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrice();

        if (refreshIntervalMs > 0) {
            intervalRef.current = setInterval(fetchPrice, refreshIntervalMs);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchPrice, refreshIntervalMs]);

    return {
        solPrice: priceData?.solPrice ?? null,
        source: priceData?.source ?? null,
        fetchedAt: priceData?.fetchedAt ?? null,
        isLoading,
        error,
        refresh: fetchPrice,
    };
}

/**
 * Format lamports to USD display with live price
 */
export function useLamportsToUsd(lamports: bigint | number | null) {
    const { solPrice, isLoading } = usePricing();

    if (isLoading || !solPrice || lamports === null) {
        return { usd: null, formatted: null, isLoading };
    }

    const lamportsBigInt = typeof lamports === 'number' ? BigInt(lamports) : lamports;
    const sol = Number(lamportsBigInt) / 1_000_000_000;
    const usd = sol * solPrice;

    return {
        usd,
        formatted: `$${usd.toFixed(2)}`,
        isLoading: false,
    };
}

/**
 * Payment status for useMicropay hook
 */
export type PaymentStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

/**
 * Hook for client-side micropayment flow state management
 * 
 * @example
 * ```tsx
 * function PayButton({ articleId, priceInLamports }) {
 *   const { status, error, pay, reset } = useMicropay();
 *   
 *   const handlePay = async () => {
 *     const result = await pay({
 *       priceInLamports,
 *       recipientAddress: 'CREATOR_WALLET',
 *       onSign: (tx) => wallet.signTransaction(tx),
 *       onSend: (signedTx) => connection.sendTransaction(signedTx),
 *     });
 *     
 *     if (result.success) {
 *       // Refresh page or unlock content
 *     }
 *   };
 *   
 *   return (
 *     <button onClick={handlePay} disabled={status === 'pending'}>
 *       {status === 'pending' ? 'Processing...' : 'Pay to Unlock'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useMicropay() {
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [signature, setSignature] = useState<string | null>(null);

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
        setSignature(null);
    }, []);

    const pay = useCallback(async (_options: {
        priceInLamports: bigint;
        recipientAddress: string;
        onSign: (tx: any) => Promise<any>;
        onSend: (signedTx: any) => Promise<string>;
        onConfirm?: (sig: string) => Promise<void>;
    }): Promise<{ success: boolean; signature?: string; error?: string }> => {
        setStatus('pending');
        setError(null);

        try {
            // This is a placeholder - actual implementation depends on wallet adapter
            // The hook provides state management, not the actual transaction logic
            throw new Error(
                'useMicropay requires implementation of onSign/onSend callbacks. ' +
                'See documentation for wallet adapter integration.'
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed';
            setError(errorMessage);
            setStatus('error');
            return { success: false, error: errorMessage };
        }
    }, []);

    return {
        status,
        error,
        signature,
        pay,
        reset,
    };
}

/**
 * Hook to format price display in both SOL and USD
 */
export function useFormatPrice(lamports: bigint | number | null) {
    const { solPrice, isLoading } = usePricing();

    if (isLoading || !solPrice || lamports === null) {
        return {
            sol: null,
            usd: null,
            formatted: 'Loading...',
            isLoading,
        };
    }

    const lamportsBigInt = typeof lamports === 'number' ? BigInt(lamports) : lamports;
    const sol = Number(lamportsBigInt) / 1_000_000_000;
    const usd = sol * solPrice;

    return {
        sol,
        usd,
        formatted: `${sol.toFixed(4)} SOL (~$${usd.toFixed(2)})`,
        isLoading: false,
    };
}
