// Client-Side Payment Flow Helper
// Headless payment flow for frontend integration (no Node.js dependencies)

import { TOKEN_MINTS, type PaymentAsset, type SolanaNetwork } from './types';

/**
 * Payment flow configuration
 */
export interface PaymentFlowConfig {
    /** Solana network */
    network: SolanaNetwork;
    /** Recipient wallet address */
    recipientWallet: string;
    /** Amount in smallest unit (lamports or token base units) */
    amount: bigint;
    /** Asset to pay with */
    asset?: PaymentAsset;
    /** Optional memo for the transaction */
    memo?: string;
}

/**
 * Solana Pay URL parameters
 */
export interface SolanaPayUrlParams {
    /** Recipient address */
    recipient: string;
    /** Amount in token's natural units (e.g., SOL, not lamports) */
    amount?: number;
    /** SPL token mint address */
    splToken?: string;
    /** Transaction reference */
    reference?: string;
    /** Label for the recipient */
    label?: string;
    /** Memo/message */
    message?: string;
}

/**
 * Build a Solana Pay URL for QR codes and deep linking
 * Compatible with Phantom, Solflare, and other Solana Pay wallets
 * 
 * @example
 * ```typescript
 * const url = buildSolanaPayUrl({
 *   recipient: 'CreatorWalletAddress',
 *   amount: 0.01,
 *   label: 'Article Unlock',
 *   message: 'Premium Content Access',
 * });
 * // Returns: solana:CreatorWalletAddress?amount=0.01&label=Article%20Unlock&message=Premium%20Content%20Access
 * ```
 */
export function buildSolanaPayUrl(params: SolanaPayUrlParams): string {
    const { recipient, amount, splToken, reference, label, message } = params;

    const url = new URL(`solana:${recipient}`);

    if (amount !== undefined) {
        url.searchParams.set('amount', amount.toString());
    }

    if (splToken) {
        url.searchParams.set('spl-token', splToken);
    }

    if (reference) {
        url.searchParams.set('reference', reference);
    }

    if (label) {
        url.searchParams.set('label', label);
    }

    if (message) {
        url.searchParams.set('message', message);
    }

    return url.toString();
}

/**
 * Create a payment flow helper for frontend use
 * Provides utilities for building transactions and generating QR codes
 * 
 * @example
 * ```typescript
 * const flow = createPaymentFlow({
 *   network: 'devnet',
 *   recipientWallet: 'CreatorAddress',
 *   amount: 10000000n, // 0.01 SOL
 * });
 * 
 * // Generate QR code URL
 * const qrUrl = flow.getSolanaPayUrl({ label: 'Unlock Article' });
 * 
 * // Get transaction amount in natural units
 * const amountInSol = flow.getDisplayAmount();
 * ```
 */
export function createPaymentFlow(config: PaymentFlowConfig) {
    const { network, recipientWallet, amount, asset = 'native', memo } = config;

    // Determine decimals and mint
    let decimals = 9; // SOL default
    let mintAddress: string | undefined;

    if (asset === 'usdc') {
        decimals = 6;
        mintAddress = network === 'mainnet-beta' ? TOKEN_MINTS.USDC_MAINNET : TOKEN_MINTS.USDC_DEVNET;
    } else if (asset === 'usdt') {
        decimals = 6;
        mintAddress = TOKEN_MINTS.USDT_MAINNET;
    } else if (typeof asset === 'object' && 'mint' in asset) {
        decimals = asset.decimals ?? 6;
        mintAddress = asset.mint;
    }

    // Convert to natural units (from lamports/base units)
    const naturalAmount = Number(amount) / Math.pow(10, decimals);

    return {
        /** Get the payment configuration */
        getConfig: () => ({ ...config }),

        /** Get amount in natural display units (e.g., 0.01 SOL) */
        getDisplayAmount: () => naturalAmount,

        /** Get amount formatted with symbol */
        getFormattedAmount: () => {
            const symbol = asset === 'native' ? 'SOL'
                : asset === 'usdc' ? 'USDC'
                    : asset === 'usdt' ? 'USDT'
                        : 'tokens';
            return `${naturalAmount.toFixed(decimals > 6 ? 4 : 2)} ${symbol}`;
        },

        /** Generate Solana Pay URL for QR codes */
        getSolanaPayUrl: (options: { label?: string; reference?: string } = {}) => {
            return buildSolanaPayUrl({
                recipient: recipientWallet,
                amount: naturalAmount,
                splToken: mintAddress,
                label: options.label,
                reference: options.reference,
                message: memo,
            });
        },

        /** Get the token mint address (undefined for native SOL) */
        getMintAddress: () => mintAddress,

        /** Check if this is a native SOL payment */
        isNativePayment: () => asset === 'native',

        /** Get network information */
        getNetworkInfo: () => ({
            network,
            isMainnet: network === 'mainnet-beta',
            explorerUrl: network === 'mainnet-beta'
                ? 'https://explorer.solana.com'
                : 'https://explorer.solana.com?cluster=devnet',
        }),

        /** Build explorer URL for a transaction */
        getExplorerUrl: (signature: string) => {
            const baseUrl = 'https://explorer.solana.com/tx';
            const cluster = network === 'mainnet-beta' ? '' : '?cluster=devnet';
            return `${baseUrl}/${signature}${cluster}`;
        },
    };
}

/**
 * Create a unique reference for payment tracking
 * Uses crypto.randomUUID when available
 */
export function createPaymentReference(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for environments without crypto.randomUUID
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
