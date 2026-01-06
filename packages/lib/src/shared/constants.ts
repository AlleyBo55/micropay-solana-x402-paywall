/**
 * @fileoverview Shared constants and types across all modules
 * @module @alleyboss/micropay-solana-x402-paywall
 */

// ============================================================================
// Solana Network Configuration
// ============================================================================

/**
 * Default RPC endpoints for Solana networks
 * Use custom RPC for production (higher rate limits, better reliability)
 */
export const RPC_ENDPOINTS = {
    'mainnet-beta': 'https://api.mainnet-beta.solana.com',
    'devnet': 'https://api.devnet.solana.com',
    'testnet': 'https://api.testnet.solana.com',
} as const;

/**
 * Supported Solana networks
 */
export const SOLANA_NETWORKS = ['mainnet-beta', 'devnet', 'testnet'] as const;
export type SolanaNetwork = (typeof SOLANA_NETWORKS)[number];

/**
 * Check if a string is a valid Solana network
 */
export function isValidNetwork(network: string): network is SolanaNetwork {
    return SOLANA_NETWORKS.includes(network as SolanaNetwork);
}

// ============================================================================
// Transaction Defaults
// ============================================================================

/** Default transaction confirmation timeout (30 seconds) */
export const DEFAULT_CONFIRMATION_TIMEOUT = 30_000;

/** Default max retries for transaction sending */
export const DEFAULT_MAX_RETRIES = 3;

/** Default priority fee in micro-lamports per compute unit */
export const DEFAULT_PRIORITY_FEE_MICRO_LAMPORTS = 5_000;

/** Default compute units for simple transfer */
export const DEFAULT_COMPUTE_UNITS = 200_000;

// ============================================================================
// Rate Limiting Defaults
// ============================================================================

/** Default rate limit window (1 minute) */
export const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;

/** Default max payments per window */
export const DEFAULT_RATE_LIMIT_MAX_PAYMENTS = 10;

// ============================================================================
// Wallet Address Validation
// ============================================================================

/** Base58 wallet address regex pattern */
export const WALLET_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Validate a Solana wallet address format
 */
export function isValidWalletAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    return WALLET_ADDRESS_REGEX.test(address);
}
