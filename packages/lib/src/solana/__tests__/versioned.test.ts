// Tests for Versioned Transaction Support
import { describe, it, expect } from 'vitest';
import { isVersionedTransaction } from '../versioned';

describe('versioned', () => {
    describe('isVersionedTransaction', () => {
        it('returns false for null', () => {
            expect(isVersionedTransaction(null)).toBe(false);
        });

        it('returns false for undefined', () => {
            expect(isVersionedTransaction(undefined)).toBe(false);
        });

        it('returns false for plain object', () => {
            expect(isVersionedTransaction({ version: 0 })).toBe(false);
        });

        it('returns false for legacy transaction-like object', () => {
            const legacyLike = {
                signatures: [],
                message: {},
            };
            expect(isVersionedTransaction(legacyLike)).toBe(false);
        });
    });

    // Note: buildVersionedTransaction requires actual Connection which we can't mock easily
    // Integration tests would require devnet connection
    describe('buildVersionedTransaction', () => {
        it.skip('builds versioned transaction with priority fees', async () => {
            // This test would require mocking Connection methods
            // Skipped as it requires integration testing with devnet
        });
    });
});
