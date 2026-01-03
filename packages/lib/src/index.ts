// Main entry point for @alleyboss/micropay-solana-x402-paywall

// Types
export type {
    PaymentRequirement,
    PaymentPayload,
    VerificationRequest,
    VerificationResponse,
    PaymentStatus,
    ArticlePaymentConfig,
    X402Network,
    SolanaNetwork,
    PaymentAsset,
    SPLTokenAsset,
    SessionData,
    SessionConfig,
    SessionValidation,
    SessionJWTPayload,
} from './types';

// Constants
export { TOKEN_MINTS } from './types';

// Solana client and verification (includes SPL)
export * from './solana';

// Session management
export * from './session';

// x402 protocol helpers
export * from './x402';

// Signature store interface
export type { SignatureStore, SignatureUsage, StoreConfig } from './store';
export { createMemoryStore, createRedisStore } from './store';

// Middleware
export type { PaywallMiddlewareConfig, MiddlewareResult } from './middleware';
export { createPaywallMiddleware, withPaywall, checkPaywallAccess } from './middleware';

// Utilities
export { withRetry, isRetryableRPCError, type RetryOptions } from './utils';

// Client-side helpers (browser-safe)
export {
    createPaymentFlow,
    buildSolanaPayUrl,
    createPaymentReference,
    type PaymentFlowConfig,
    type SolanaPayUrlParams,
} from './client';

// Pricing helpers
export {
    getSolPrice,
    lamportsToUsd,
    usdToLamports,
    formatPriceDisplay,
    formatPriceSync,
    clearPriceCache,
    configurePricing,
    getProviders,
    type PriceData,
    type PriceConfig,
    type CustomPriceProvider,
} from './pricing';


