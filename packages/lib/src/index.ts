// Main entry point for @alleyboss/micropay-solana-x402-paywall
// Wraps official x402 SDK with Solana optimizations and Agent capabilities

// Re-export Official x402 Core Types & Utils
export * from '@x402/core';
export * from '@x402/core/types';
export * from '@x402/core/client';

// Re-export Solana (SVM) Module
export * from '@x402/svm';

// Client-side helpers (browser-safe, no Node.js deps)
export * from './client';

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
} from './pricing';


