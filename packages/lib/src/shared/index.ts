/**
 * @fileoverview Shared module exports
 * @module @alleyboss/micropay-solana-x402-paywall/shared
 */

export {
    RPC_ENDPOINTS,
    SOLANA_NETWORKS,
    isValidNetwork,
    DEFAULT_CONFIRMATION_TIMEOUT,
    DEFAULT_MAX_RETRIES,
    DEFAULT_PRIORITY_FEE_MICRO_LAMPORTS,
    DEFAULT_COMPUTE_UNITS,
    DEFAULT_RATE_LIMIT_WINDOW_MS,
    DEFAULT_RATE_LIMIT_MAX_PAYMENTS,
    WALLET_ADDRESS_REGEX,
    isValidWalletAddress,
    type SolanaNetwork,
} from './constants';
