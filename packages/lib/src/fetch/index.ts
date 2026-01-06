/**
 * @fileoverview x402Fetch Module Exports
 * @module @alleyboss/micropay-solana-x402-paywall/fetch
 * 
 * Drop-in fetch() replacement that automatically handles HTTP 402 payment flows.
 * 
 * @example
 * ```typescript
 * import { createX402Fetch, X402PaymentError } from '@alleyboss/micropay-solana-x402-paywall/fetch';
 * 
 * const x402Fetch = createX402Fetch({
 *   wallet: myWallet,
 *   network: 'mainnet-beta',
 * });
 * 
 * try {
 *   const response = await x402Fetch('/api/premium');
 * } catch (error) {
 *   if (error instanceof X402PaymentError) {
 *     console.log('Payment failed:', error.code);
 *   }
 * }
 * ```
 */

// Core factory function
export { createX402Fetch, parsePaymentRequirements, buildPaymentHeader } from './x402Fetch';

// Error classes and utilities
export {
    X402PaymentError,
    isX402PaymentError,
    isUserRejection,
    // Factory functions for custom error creation
    userRejectedError,
    insufficientBalanceError,
    transactionFailedError,
    verificationFailedError,
    networkError,
    invalid402ResponseError,
    timeoutError,
    walletNotConnectedError,
} from './errors';

// Type exports
export type {
    X402FetchConfig,
    X402RequestInit,
    X402FetchFunction,
    PaymentRequirements,
    PaymentResult,
    WalletLike,
    SolanaNetwork,
    PriorityFeeConfig,
    PaymentRequiredHook,
    PaymentSuccessHook,
    PaymentErrorHook,
} from './types';

export { X402ErrorCode } from './types';
