// Tests for Credit Session Utilities
import { describe, it, expect, beforeEach } from 'vitest';
import {
    createCreditSession,
    validateCreditSession,
    useCredit,
    addCredits,
    getRemainingCredits,
} from '../credits';

describe('agent/credits', () => {
    const testSecret = 'test-secret-key-that-is-at-least-32-chars-long';
    const testWallet = '7o2cYFMPAj35a8DKXKkd2iKAGYBhwLxqB3yj5NqRz5M9';

    describe('createCreditSession', () => {
        it('creates a valid credit session', async () => {
            const result = await createCreditSession(testWallet, 'bundle-1', {
                secret: testSecret,
                durationHours: 24,
                initialCredits: 10,
                bundleType: 'starter',
            });

            expect(result.token).toBeDefined();
            expect(result.session.credits).toBe(10);
            expect(result.session.walletAddress).toBe(testWallet);
            expect(result.session.bundleType).toBe('starter');
        });

        it('rejects invalid wallet address', async () => {
            await expect(
                createCreditSession('invalid', 'bundle-1', {
                    secret: testSecret,
                    durationHours: 24,
                    initialCredits: 10,
                })
            ).rejects.toThrow('Invalid wallet address format');
        });

        it('rejects zero credits', async () => {
            await expect(
                createCreditSession(testWallet, 'bundle-1', {
                    secret: testSecret,
                    durationHours: 24,
                    initialCredits: 0,
                })
            ).rejects.toThrow('Credits must be between 1 and');
        });

        it('rejects excessive credits', async () => {
            await expect(
                createCreditSession(testWallet, 'bundle-1', {
                    secret: testSecret,
                    durationHours: 24,
                    initialCredits: 9999,
                })
            ).rejects.toThrow('Credits must be between 1 and');
        });

        it('rejects invalid duration', async () => {
            await expect(
                createCreditSession(testWallet, 'bundle-1', {
                    secret: testSecret,
                    durationHours: 0,
                    initialCredits: 10,
                })
            ).rejects.toThrow('Session duration must be between');
        });

        it('rejects short secret', async () => {
            await expect(
                createCreditSession(testWallet, 'bundle-1', {
                    secret: 'short',
                    durationHours: 24,
                    initialCredits: 10,
                })
            ).rejects.toThrow('Session secret must be at least');
        });
    });

    describe('validateCreditSession', () => {
        let validToken: string;

        beforeEach(async () => {
            const result = await createCreditSession(testWallet, 'bundle-1', {
                secret: testSecret,
                durationHours: 24,
                initialCredits: 5,
            });
            validToken = result.token;
        });

        it('validates a valid token', async () => {
            const result = await validateCreditSession(validToken, testSecret);

            expect(result.valid).toBe(true);
            expect(result.session?.credits).toBe(5);
            expect(result.session?.walletAddress).toBe(testWallet);
        });

        it('rejects invalid token', async () => {
            const result = await validateCreditSession('invalid-token', testSecret);

            expect(result.valid).toBe(false);
            expect(result.reason).toBe('Invalid session');
        });

        it('rejects wrong secret', async () => {
            const result = await validateCreditSession(validToken, 'wrong-secret-that-is-at-least-32-chars');

            expect(result.valid).toBe(false);
        });

        it('rejects empty token', async () => {
            const result = await validateCreditSession('', testSecret);

            expect(result.valid).toBe(false);
            expect(result.reason).toBe('Invalid token format');
        });
    });

    describe('useCredit', () => {
        let validToken: string;

        beforeEach(async () => {
            const result = await createCreditSession(testWallet, 'bundle-1', {
                secret: testSecret,
                durationHours: 24,
                initialCredits: 3,
            });
            validToken = result.token;
        });

        it('uses one credit successfully', async () => {
            const result = await useCredit(validToken, testSecret);

            expect(result.success).toBe(true);
            expect(result.remainingCredits).toBe(2);
            expect(result.newToken).toBeDefined();
        });

        it('uses multiple credits', async () => {
            const result = await useCredit(validToken, testSecret, 2);

            expect(result.success).toBe(true);
            expect(result.remainingCredits).toBe(1);
        });

        it('fails when insufficient credits', async () => {
            const result = await useCredit(validToken, testSecret, 5);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Insufficient credits');
            expect(result.remainingCredits).toBe(3);
        });

        it('fails with invalid credit amount', async () => {
            const result = await useCredit(validToken, testSecret, 0);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid credit amount');
        });

        it('fails with invalid token', async () => {
            const result = await useCredit('invalid', testSecret);

            expect(result.success).toBe(false);
        });

        it('decrements correctly over multiple uses', async () => {
            let token = validToken;

            // Use 1 credit
            let result = await useCredit(token, testSecret);
            expect(result.remainingCredits).toBe(2);
            token = result.newToken!;

            // Use another credit
            result = await useCredit(token, testSecret);
            expect(result.remainingCredits).toBe(1);
            token = result.newToken!;

            // Use last credit
            result = await useCredit(token, testSecret);
            expect(result.remainingCredits).toBe(0);
            token = result.newToken!;

            // Try to use when empty
            result = await useCredit(token, testSecret);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Insufficient credits');
        });
    });

    describe('addCredits', () => {
        let validToken: string;

        beforeEach(async () => {
            const result = await createCreditSession(testWallet, 'bundle-1', {
                secret: testSecret,
                durationHours: 24,
                initialCredits: 5,
            });
            validToken = result.token;
        });

        it('adds credits successfully', async () => {
            const result = await addCredits(validToken, testSecret, 3);

            expect(result.success).toBe(true);
            expect(result.totalCredits).toBe(8);
            expect(result.newToken).toBeDefined();
        });

        it('rejects invalid credit amount', async () => {
            const result = await addCredits(validToken, testSecret, 0);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid credit amount');
        });

        it('caps at maximum credits', async () => {
            const result = await addCredits(validToken, testSecret, 999);

            expect(result.success).toBe(true);
            expect(result.totalCredits).toBe(1000); // MAX_CREDITS
        });
    });

    describe('getRemainingCredits', () => {
        it('returns correct credit count', async () => {
            const { token } = await createCreditSession(testWallet, 'bundle-1', {
                secret: testSecret,
                durationHours: 24,
                initialCredits: 7,
            });

            const result = await getRemainingCredits(token, testSecret);

            expect(result.credits).toBe(7);
            expect(result.valid).toBe(true);
        });

        it('returns 0 for invalid token', async () => {
            const result = await getRemainingCredits('invalid', testSecret);

            expect(result.credits).toBe(0);
            expect(result.valid).toBe(false);
        });
    });
});
