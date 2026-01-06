/**
 * Tests for x402Fetch module
 * @module @alleyboss/micropay-solana-x402-paywall/fetch
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Keypair } from '@solana/web3.js';
import {
    X402PaymentError,
    isX402PaymentError,
    isUserRejection,
    userRejectedError,
    insufficientBalanceError,
    amountExceedsLimitError,
    recipientNotAllowedError,
    rateLimitExceededError,
} from '../errors';
import type { PaymentRequirements } from '../types';
import { X402ErrorCode } from '../types';

// ============================================================================
// Mock Payment Requirements
// ============================================================================

const mockRequirements: PaymentRequirements = {
    payTo: '7fPjNJaEHtepp1ZRr6GsaW1k22U1FupQtwuHUkTb6Xg9',
    amount: '10000000', // 0.01 SOL
    asset: 'SOL',
    network: 'solana-mainnet',
    description: 'Test Payment',
};

// ============================================================================
// Error Tests
// ============================================================================

describe('fetch/errors', () => {
    describe('X402PaymentError', () => {
        it('creates error with correct properties', () => {
            const error = new X402PaymentError(
                'Test error',
                X402ErrorCode.USER_REJECTED,
                mockRequirements
            );

            expect(error.name).toBe('X402PaymentError');
            expect(error.message).toBe('Test error');
            expect(error.code).toBe('USER_REJECTED');
            expect(error.requirements).toEqual(mockRequirements);
        });

        it('supports cause chaining', () => {
            const cause = new Error('Original error');
            const error = new X402PaymentError(
                'Wrapped error',
                X402ErrorCode.TRANSACTION_FAILED,
                mockRequirements,
                cause
            );

            expect(error.cause).toBe(cause);
        });

        it('correctly identifies retryable errors', () => {
            const retryable = new X402PaymentError('Network issue', X402ErrorCode.NETWORK_ERROR);
            const timeout = new X402PaymentError('Timeout', X402ErrorCode.TIMEOUT);
            const txFailed = new X402PaymentError('Tx failed', X402ErrorCode.TRANSACTION_FAILED);
            const userRejected = new X402PaymentError('Rejected', X402ErrorCode.USER_REJECTED);

            expect(retryable.isRetryable).toBe(true);
            expect(timeout.isRetryable).toBe(true);
            expect(txFailed.isRetryable).toBe(true);
            expect(userRejected.isRetryable).toBe(false);
        });

        it('serializes to JSON correctly', () => {
            const error = new X402PaymentError(
                'Test error',
                X402ErrorCode.INSUFFICIENT_BALANCE,
                mockRequirements
            );

            const json = error.toJSON();

            expect(json).toEqual({
                name: 'X402PaymentError',
                message: 'Test error',
                code: 'INSUFFICIENT_BALANCE',
                requirements: mockRequirements,
                isRetryable: false,
            });
        });
    });

    describe('Error Factory Functions', () => {
        it('userRejectedError creates correct error', () => {
            const error = userRejectedError(mockRequirements);

            expect(error.code).toBe('USER_REJECTED');
            expect(error.requirements).toEqual(mockRequirements);
            expect(error.message).toContain('rejected');
        });

        it('insufficientBalanceError includes balance info', () => {
            const error = insufficientBalanceError(mockRequirements, 5_000_000n);

            expect(error.code).toBe('INSUFFICIENT_BALANCE');
            expect(error.message).toContain('5000000');
            expect(error.message).toContain('10000000');
        });

        it('amountExceedsLimitError includes limit info', () => {
            const error = amountExceedsLimitError(mockRequirements, 5_000_000n);

            expect(error.code).toBe('AMOUNT_EXCEEDS_LIMIT');
            expect(error.message).toContain('5000000');
        });

        it('recipientNotAllowedError includes recipient info', () => {
            const error = recipientNotAllowedError(
                mockRequirements,
                '7fPjNJaEHtepp1ZRr6GsaW1k22U1FupQtwuHUkTb6Xg9'
            );

            expect(error.code).toBe('RECIPIENT_NOT_ALLOWED');
            expect(error.message).toContain('7fPjN');
        });

        it('rateLimitExceededError includes limit info', () => {
            const error = rateLimitExceededError(10, 60_000);

            expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
            expect(error.message).toContain('10');
            expect(error.message).toContain('60');
        });
    });

    describe('Type Guards', () => {
        it('isX402PaymentError correctly identifies errors', () => {
            const x402Error = new X402PaymentError('Test', X402ErrorCode.USER_REJECTED);
            const regularError = new Error('Regular error');

            expect(isX402PaymentError(x402Error)).toBe(true);
            expect(isX402PaymentError(regularError)).toBe(false);
            expect(isX402PaymentError(null)).toBe(false);
            expect(isX402PaymentError(undefined)).toBe(false);
            expect(isX402PaymentError('string')).toBe(false);
        });

        it('isUserRejection correctly identifies rejections', () => {
            const rejected = userRejectedError(mockRequirements);
            const insufficient = insufficientBalanceError(mockRequirements, 0n);

            expect(isUserRejection(rejected)).toBe(true);
            expect(isUserRejection(insufficient)).toBe(false);
            expect(isUserRejection(new Error('test'))).toBe(false);
        });
    });
});

// ============================================================================
// Type Tests
// ============================================================================

describe('fetch/types', () => {
    describe('X402ErrorCode', () => {
        it('has all expected error codes', () => {
            expect(X402ErrorCode.USER_REJECTED).toBe('USER_REJECTED');
            expect(X402ErrorCode.INSUFFICIENT_BALANCE).toBe('INSUFFICIENT_BALANCE');
            expect(X402ErrorCode.TRANSACTION_FAILED).toBe('TRANSACTION_FAILED');
            expect(X402ErrorCode.NETWORK_ERROR).toBe('NETWORK_ERROR');
            expect(X402ErrorCode.TIMEOUT).toBe('TIMEOUT');
            expect(X402ErrorCode.WALLET_NOT_CONNECTED).toBe('WALLET_NOT_CONNECTED');
            expect(X402ErrorCode.AMOUNT_EXCEEDS_LIMIT).toBe('AMOUNT_EXCEEDS_LIMIT');
            expect(X402ErrorCode.RECIPIENT_NOT_ALLOWED).toBe('RECIPIENT_NOT_ALLOWED');
            expect(X402ErrorCode.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED');
        });
    });
});

// ============================================================================
// Security Validation Tests
// ============================================================================

describe('fetch/security', () => {
    describe('Amount Validation', () => {
        it('should reject amounts exceeding maxPaymentPerRequest', () => {
            const requirements: PaymentRequirements = {
                ...mockRequirements,
                amount: '100000000', // 0.1 SOL
            };
            const maxAllowed = 50_000_000n; // 0.05 SOL

            const error = amountExceedsLimitError(requirements, maxAllowed);

            expect(error.code).toBe('AMOUNT_EXCEEDS_LIMIT');
        });
    });

    describe('Recipient Whitelist', () => {
        it('should reject recipients not in whitelist', () => {
            const error = recipientNotAllowedError(mockRequirements, mockRequirements.payTo);

            expect(error.code).toBe('RECIPIENT_NOT_ALLOWED');
            expect(error.requirements?.payTo).toBe(mockRequirements.payTo);
        });
    });

    describe('Rate Limiting', () => {
        it('should create rate limit error with correct info', () => {
            const error = rateLimitExceededError(5, 30_000);

            expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
            expect(error.message).toContain('5');
            expect(error.message).toContain('30'); // 30 seconds
        });
    });
});
