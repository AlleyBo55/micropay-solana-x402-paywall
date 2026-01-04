/** SPL Token asset specification */
export interface SPLTokenAsset {
    /** Token mint address */
    mint: string;
    /** Token decimals (default: 6 for USDC/USDT) */
    decimals?: number;
}

/** Asset types for payments */
export type PaymentAsset = 'native' | 'usdc' | 'usdt' | SPLTokenAsset;

export type SolanaNetwork = 'devnet' | 'mainnet-beta';

/** Known SPL token mint addresses */
export const TOKEN_MINTS = {
    /** USDC on mainnet */
    USDC_MAINNET: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    /** USDC on devnet */
    USDC_DEVNET: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    /** USDT on mainnet */
    USDT_MAINNET: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
} as const;
