
import { useState, useCallback, useEffect } from 'react';
import { createX402AuthorizationHeader } from './headers';
import { sendSolanaPayment, type WalletAdapterInterface } from './transaction';
import { Connection } from '@solana/web3.js';

export interface PaywallConfig {
    /** URL to fetch protected content from */
    url: string;
    /** Solana Connection */
    connection: Connection;
    /** Wallet Adapter */
    wallet: WalletAdapterInterface;
}

export interface PaywallState<T> {
    /** Content data if unlocked */
    data: T | null;
    /** Whether content is currently locked by 402 */
    isLocked: boolean;
    /** Whether an operation is in progress (initial load or unlocking) */
    isLoading: boolean;
    /** Payment amount required (in lamports) */
    price?: bigint;
    /** Recipient address */
    recipient?: string;
    /** Error message */
    error: string | null;
    /** Function to trigger unlock flow */
    unlock: () => Promise<void>;
}

/**
 * React Hook to manage x402 Payment Loop
 * 
 * Handles:
 * 1. Initial fetch
 * 2. 402 Payment Required detection
 * 3. Payment execution (via wallet)
 * 4. Auth header creation
 * 5. Re-fetch with proof
 * 
 * @example
 * ```tsx
 * const { data, isLocked, unlock, price } = usePaywallResource<Article>({
 *   url: `/api/articles/${slug}`,
 *   connection,
 *   wallet
 * });
 * 
 * if (isLocked) return <Button onClick={unlock}>Pay {price} Lamports</Button>;
 * return <Article data={data} />;
 * ```
 */
export function usePaywallResource<T = any>({
    url,
    connection,
    wallet
}: PaywallConfig): PaywallState<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLocked, setIsLocked] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Requirements from 402 response
    const [paymentHeader, setPaymentHeader] = useState<string | null>(null);
    const [price, setPrice] = useState<bigint | undefined>();
    const [recipient, setRecipient] = useState<string | undefined>();

    const fetchData = useCallback(async (authHeader?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };
            if (authHeader) {
                headers['Authorization'] = authHeader;
            }

            const res = await fetch(url, {
                headers,
                credentials: 'include' // Ensure cookies are sent/received
            });

            if (res.status === 402) {
                // Check standard WWW-Authenticate header first, then fallback to Payment-Required (used by some implementations)
                const wwwAuth = res.headers.get('WWW-Authenticate') || res.headers.get('Payment-Required');
                // Check for specific error reason from server
                const errorReason = res.headers.get('X-Payment-Error');
                console.log('[usePaywallResource] 402 Response. Header:', wwwAuth, 'Error:', errorReason);

                if (authHeader && errorReason) {
                    console.error('[usePaywallResource] Verification Failed:', errorReason);
                    setError(`Verification Failed: ${errorReason}`);
                }


                if (wwwAuth) {
                    setPaymentHeader(wwwAuth);
                    // Parse requirements from x402 header using proper decoder
                    try {
                        // Import the decoder
                        const { decodePaymentRequiredHeader } = await import('@x402/core/http');
                        // Strip 'x402 ' or 'X402 ' prefix if present
                        const cleanHeader = wwwAuth.replace(/^[Xx]402\s+/, '');
                        const decoded = decodePaymentRequiredHeader(cleanHeader);
                        console.log('[usePaywallResource] Decoded header:', decoded);

                        // Handle array or single object requirement
                        const accepts = Array.isArray(decoded.accepts)
                            ? decoded.accepts[0]
                            : decoded.accepts;

                        console.log('[usePaywallResource] Accepts:', accepts);

                        if (accepts) {
                            // Get amount - supports 'amount', 'price' (used in middleware), or 'maxAmountRequired'
                            const amountStr = accepts.amount || (accepts as any).price || (accepts as any).maxAmountRequired || '0';
                            setPrice(BigInt(amountStr));
                            setRecipient(accepts.payTo);
                            console.log('[usePaywallResource] Set price:', amountStr, 'recipient:', accepts.payTo);
                        } else {
                            console.warn('[usePaywallResource] No accepts found in header');
                        }
                    } catch (e) {
                        console.warn('[usePaywallResource] Failed to parse x402 header:', e);
                    }
                } else {
                    console.warn('[usePaywallResource] 402 response missing WWW-Authenticate header');
                }
                setIsLocked(true);
                setData(null);
            } else if (res.ok) {
                const json = await res.json();
                setData(json);
                setIsLocked(false);
            } else {
                throw new Error(`Request failed with status ${res.status}`);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch resource');
        } finally {
            setIsLoading(false);
        }
    }, [url]);

    // Initial Load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const unlock = useCallback(async () => {
        if (!paymentHeader || !price || !recipient) {
            setError('Missing payment requirements');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Pay
            const { signature } = await sendSolanaPayment({
                connection,
                wallet,
                recipientAddress: recipient,
                amount: price
            });

            // 2. Generate Header
            const authHeader = createX402AuthorizationHeader(signature, paymentHeader);

            // 3. Retry Fetch
            await fetchData(authHeader);
        } catch (err: any) {
            console.error('Unlock failed', err);
            setError(err.message || 'Payment/Unlock failed');
            setIsLoading(false); // Only set loading false on error, success handled by fetchData
        }
    }, [connection, wallet, paymentHeader, price, recipient, fetchData]);

    return {
        data,
        isLocked,
        isLoading,
        price,
        recipient,
        error,
        unlock
    };
}
