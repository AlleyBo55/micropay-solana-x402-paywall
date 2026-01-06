/**
 * @fileoverview Custom error classes for x402Fetch
 * @module @alleyboss/micropay-solana-x402-paywall/fetch
 */

import type { PaymentRequirements, X402ErrorCode } from './types';
import { X402ErrorCode as ErrorCodes } from './types';

// ============================================================================
// Base Error Class
// ============================================================================

/**
 * Base error for all x402 payment-related errors
 * 
 * @example
 * try {
 *   await x402Fetch('/api/premium');
 * } catch (error) {
 *   if (error instanceof X402PaymentError) {
 *     console.log(error.code);         // 'USER_REJECTED'
 *     console.log(error.requirements); // { payTo: '...', amount: '...' }
 *   }
 * }
 */
export class X402PaymentError extends Error {
    readonly name = 'X402PaymentError' as const;

    constructor(
        message: string,
        /** Error code for programmatic handling */
        readonly code: X402ErrorCode,
        /** Payment requirements that triggered the error */
        readonly requirements?: PaymentRequirements,
        /** Original error if this wraps another error */
        readonly cause?: Error
    ) {
        super(message);
        // Maintains proper stack trace in V8 engines
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, X402PaymentError);
        }
    }

    /**
     * Check if error is retryable
     */
    get isRetryable(): boolean {
        const retryableCodes: X402ErrorCode[] = [
            ErrorCodes.NETWORK_ERROR,
            ErrorCodes.TIMEOUT,
            ErrorCodes.TRANSACTION_FAILED,
        ];
        return retryableCodes.includes(this.code);
    }

    /**
     * Convert to JSON-serializable object
     */
    toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            requirements: this.requirements,
            isRetryable: this.isRetryable,
        };
    }
}

// ============================================================================
// Factory Functions (Cleaner Error Creation)
// ============================================================================

/**
 * Create error for user rejection
 */
export function userRejectedError(requirements: PaymentRequirements): X402PaymentError {
    return new X402PaymentError(
        'User rejected the payment request',
        ErrorCodes.USER_REJECTED,
        requirements
    );
}

/**
 * Create error for insufficient balance
 */
export function insufficientBalanceError(
    requirements: PaymentRequirements,
    balance: bigint
): X402PaymentError {
    return new X402PaymentError(
        `Insufficient balance: have ${balance} lamports, need ${requirements.amount}`,
        ErrorCodes.INSUFFICIENT_BALANCE,
        requirements
    );
}

/**
 * Create error for transaction failure
 */
export function transactionFailedError(
    requirements: PaymentRequirements,
    cause?: Error
): X402PaymentError {
    return new X402PaymentError(
        `Transaction failed: ${cause?.message ?? 'Unknown error'}`,
        ErrorCodes.TRANSACTION_FAILED,
        requirements,
        cause
    );
}

/**
 * Create error for verification failure
 */
export function verificationFailedError(
    requirements: PaymentRequirements,
    reason?: string
): X402PaymentError {
    return new X402PaymentError(
        `Payment verification failed: ${reason ?? 'Unknown reason'}`,
        ErrorCodes.VERIFICATION_FAILED,
        requirements
    );
}

/**
 * Create error for network issues
 */
export function networkError(cause?: Error): X402PaymentError {
    return new X402PaymentError(
        `Network error: ${cause?.message ?? 'Connection failed'}`,
        ErrorCodes.NETWORK_ERROR,
        undefined,
        cause
    );
}

/**
 * Create error for invalid 402 response
 */
export function invalid402ResponseError(details?: string): X402PaymentError {
    return new X402PaymentError(
        `Invalid 402 response: ${details ?? 'Missing or malformed payment requirements'}`,
        ErrorCodes.INVALID_402_RESPONSE
    );
}

/**
 * Create error for timeout
 */
export function timeoutError(requirements?: PaymentRequirements): X402PaymentError {
    return new X402PaymentError(
        'Payment flow timed out',
        ErrorCodes.TIMEOUT,
        requirements
    );
}

/**
 * Create error for wallet not connected
 */
export function walletNotConnectedError(): X402PaymentError {
    return new X402PaymentError(
        'Wallet is not connected',
        ErrorCodes.WALLET_NOT_CONNECTED
    );
}

/**
 * Create error when payment amount exceeds configured limit
 */
export function amountExceedsLimitError(
    requirements: PaymentRequirements,
    limit: bigint
): X402PaymentError {
    return new X402PaymentError(
        `Payment amount ${requirements.amount} exceeds limit of ${limit} lamports`,
        ErrorCodes.AMOUNT_EXCEEDS_LIMIT,
        requirements
    );
}

/**
 * Create error when recipient is not in whitelist
 */
export function recipientNotAllowedError(
    requirements: PaymentRequirements,
    recipient: string
): X402PaymentError {
    return new X402PaymentError(
        `Recipient ${recipient} is not in the allowed recipients list`,
        ErrorCodes.RECIPIENT_NOT_ALLOWED,
        requirements
    );
}

/**
 * Create error when rate limit is exceeded
 */
export function rateLimitExceededError(
    limit: number,
    windowMs: number
): X402PaymentError {
    return new X402PaymentError(
        `Rate limit exceeded: max ${limit} payments per ${windowMs / 1000}s`,
        ErrorCodes.RATE_LIMIT_EXCEEDED
    );
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if an error is an X402PaymentError
 */
export function isX402PaymentError(error: unknown): error is X402PaymentError {
    return error instanceof X402PaymentError;
}

/**
 * Check if error indicates user explicitly rejected
 */
export function isUserRejection(error: unknown): boolean {
    return isX402PaymentError(error) && error.code === ErrorCodes.USER_REJECTED;
}
