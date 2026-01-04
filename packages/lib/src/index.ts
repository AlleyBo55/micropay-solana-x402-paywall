// Main entry point for @alleyboss/micropay-solana-x402-paywall
// Wraps official x402 SDK with Solana optimizations and Agent capabilities

// Re-export Official x402 Core Types & Utils
export * from '@x402/core';
export * from '@x402/core/types';
export * from '@x402/core/client';

// Re-export Solana (SVM) Module
export * from '@x402/svm';

// Client-side helpers (browser-safe, no Node.js deps)
// Client-side helpers are not exported from root to prevent SSR issues
// Import from @alleyboss/micropay-solana-x402-paywall/client instead
// export * from './client';

// SVM Facilitator (Manual Verification Support)
export { LocalSvmFacilitator } from './svm/LocalSvmFacilitator';

// Agent payment utilities (Unique Feature)
export * from './agent';

// Pricing helpers (Utility)
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
    lamportsToSol,
} from './pricing';


