/**
 * @fileoverview Type definitions for x402Fetch
 * @module @alleyboss/micropay-solana-x402-paywall/fetch
 */

import type { WalletAdapter } from '@solana/wallet-adapter-base';
import type { Keypair, Connection } from '@solana/web3.js';

// ============================================================================
// Core Configuration Types
// ============================================================================

/**
 * Solana network identifier
 */
export type SolanaNetwork = 'devnet' | 'mainnet-beta' | 'testnet';

/**
 * Wallet type - supports both browser wallet adapters and server-side keypairs
 */
export type WalletLike = WalletAdapter | Keypair;

/**
 * Payment requirements extracted from 402 response
 */
export interface PaymentRequirements {
    /** Recipient wallet address */
    readonly payTo: string;
    /** Amount in smallest unit (lamports for SOL) */
    readonly amount: string;
    /** Asset identifier (e.g., 'SOL', 'USDC') */
    readonly asset: string;
    /** Network identifier */
    readonly network: string;
    /** Optional: Human-readable description */
    readonly description?: string;
    /** Optional: Resource identifier */
    readonly resource?: string;
    /** Optional: Maximum age of payment proof in seconds */
    readonly maxAge?: number;
}

/**
 * Configuration for createX402Fetch factory
 */
export interface X402FetchConfig {
    /**
     * Solana wallet - WalletAdapter for browser, Keypair for server/agents
     * @example
     * // Browser
     * { wallet: useWallet() }
     * // Server/Agent
     * { wallet: Keypair.fromSecretKey(...) }
     */
    readonly wallet: WalletLike;

    /**
     * Solana network to use
     * @default 'mainnet-beta'
     */
    readonly network?: SolanaNetwork;

    /**
     * Solana RPC connection (optional - will create one if not provided)
     */
    readonly connection?: Connection;

    /**
     * Custom facilitator URL for verification
     * If not provided, uses built-in verification
     */
    readonly facilitatorUrl?: string;

    /**
     * Callback when payment is required
     * Return `true` to proceed with payment, `false` to abort
     * If not provided, payment proceeds automatically
     * 
     * @example
     * onPaymentRequired: async (req) => {
     *   return confirm(`Pay ${req.amount} ${req.asset}?`);
     * }
     */
    readonly onPaymentRequired?: PaymentRequiredHook;

    /**
     * Callback after successful payment
     */
    readonly onPaymentSuccess?: PaymentSuccessHook;

    /**
     * Callback on payment failure
     */
    readonly onPaymentError?: PaymentErrorHook;

    /**
     * Priority fee configuration for Solana transactions
     */
    readonly priorityFee?: PriorityFeeConfig;

    /**
     * Maximum retries for transaction confirmation
     * @default 3
     */
    readonly maxRetries?: number;

    /**
     * Timeout for payment flow in milliseconds
     * @default 30000 (30 seconds)
     */
    readonly timeout?: number;
}

/**
 * Priority fee configuration
 */
export interface PriorityFeeConfig {
    /** Enable priority fees */
    readonly enabled: boolean;
    /** Micro-lamports per compute unit */
    readonly microLamports?: number;
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Hook called when payment is required
 * @returns Promise<boolean> - true to proceed, false to abort
 */
export type PaymentRequiredHook = (
    requirements: PaymentRequirements,
    url: string
) => Promise<boolean> | boolean;

/**
 * Hook called after successful payment
 */
export type PaymentSuccessHook = (
    signature: string,
    requirements: PaymentRequirements
) => void | Promise<void>;

/**
 * Hook called on payment error
 */
export type PaymentErrorHook = (
    error: Error,
    requirements?: PaymentRequirements
) => void | Promise<void>;

// ============================================================================
// Fetch Types
// ============================================================================

/**
 * Extended RequestInit with x402-specific options
 */
export interface X402RequestInit extends RequestInit {
    /**
     * Skip payment flow - useful for checking if resource requires payment
     */
    readonly skipPayment?: boolean;

    /**
     * Custom payment requirements override
     */
    readonly paymentOverride?: Partial<PaymentRequirements>;
}

/**
 * x402Fetch function signature
 */
export interface X402FetchFunction {
    /**
     * Fetch with automatic 402 handling
     * 
     * @param input - URL or Request object
     * @param init - Extended fetch options
     * @returns Promise<Response>
     * @throws {X402PaymentError} on payment failure
     * 
     * @example
     * const response = await x402Fetch('/api/premium');
     * const data = await response.json();
     */
    (input: RequestInfo | URL, init?: X402RequestInit): Promise<Response>;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Error codes for X402PaymentError
 */
export const X402ErrorCode = {
    /** User rejected the payment */
    USER_REJECTED: 'USER_REJECTED',
    /** Insufficient wallet balance */
    INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
    /** Transaction failed on-chain */
    TRANSACTION_FAILED: 'TRANSACTION_FAILED',
    /** Payment verification failed */
    VERIFICATION_FAILED: 'VERIFICATION_FAILED',
    /** Network/RPC error */
    NETWORK_ERROR: 'NETWORK_ERROR',
    /** Invalid 402 response format */
    INVALID_402_RESPONSE: 'INVALID_402_RESPONSE',
    /** Payment timeout */
    TIMEOUT: 'TIMEOUT',
    /** Wallet not connected */
    WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
} as const;

export type X402ErrorCode = (typeof X402ErrorCode)[keyof typeof X402ErrorCode];

/**
 * Payment result from successful transaction
 */
export interface PaymentResult {
    /** Transaction signature */
    readonly signature: string;
    /** Amount paid in lamports */
    readonly amountPaid: bigint;
    /** Recipient address */
    readonly recipient: string;
    /** Timestamp of payment */
    readonly timestamp: number;
}
