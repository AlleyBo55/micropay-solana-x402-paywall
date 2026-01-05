// Tests for Agent Payment Utilities
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Keypair, Connection } from '@solana/web3.js';
import {
    executeAgentPayment,
    getAgentBalance,
    hasAgentSufficientBalance,
    generateAgentKeypair,
} from '../agentPayment';

// Valid base58 blockhash for testing
const MOCK_BLOCKHASH = 'GHtXQBsoZHVnNFa9YevAzFr17DJjgHXk3ycTKD5xD3Zi';

// Mock connection for testing
const createMockConnection = () => {
    return {
        getBalance: vi.fn().mockResolvedValue(1_000_000_000), // 1 SOL
        getLatestBlockhash: vi.fn().mockResolvedValue({
            blockhash: MOCK_BLOCKHASH,
            lastValidBlockHeight: 100000,
        }),
        sendTransaction: vi.fn().mockResolvedValue('5wHu1qwD7q4H1YqPhHvKFJyM2Zy9P3E7H1qAhNFG1234'),
        confirmTransaction: vi.fn().mockResolvedValue({
            value: { err: null },
            context: { slot: 12345 },
        }),
        getTransaction: vi.fn().mockResolvedValue({
            blockTime: Math.floor(Date.now() / 1000),
            slot: 12345,
        }),
    } as unknown as Connection;
};


describe('agent/agentPayment', () => {
    let testKeypair: Keypair;

    beforeEach(() => {
        testKeypair = Keypair.generate();
    });

    describe('generateAgentKeypair', () => {
        it('generates a valid keypair with secret', () => {
            const result = generateAgentKeypair();

            expect(result.keypair).toBeDefined();
            expect(result.secretBase58).toBeDefined();
            expect(result.publicKey).toBeDefined();
            expect(result.publicKey.length).toBeGreaterThanOrEqual(43);
            expect(result.publicKey.length).toBeLessThanOrEqual(44); // Base58 pubkey can be 43-44 chars
        });

        it('generates unique keypairs', () => {
            const result1 = generateAgentKeypair();
            const result2 = generateAgentKeypair();

            expect(result1.publicKey).not.toBe(result2.publicKey);
        });

        it('returns secret in comma-separated format', () => {
            const result = generateAgentKeypair();
            const parts = result.secretBase58.split(',');

            expect(parts).toHaveLength(64);
            parts.forEach(part => {
                const num = parseInt(part, 10);
                expect(num).toBeGreaterThanOrEqual(0);
                expect(num).toBeLessThanOrEqual(255);
            });
        });
    });

    describe('getAgentBalance', () => {
        it('returns balance in lamports and SOL', async () => {
            const mockConnection = createMockConnection();

            const result = await getAgentBalance(mockConnection, testKeypair);

            expect(result.balance).toBe(1_000_000_000n);
            expect(result.balanceSol).toBe(1);
        });

        it('handles zero balance', async () => {
            const mockConnection = {
                ...createMockConnection(),
                getBalance: vi.fn().mockResolvedValue(0),
            } as unknown as Connection;

            const result = await getAgentBalance(mockConnection, testKeypair);

            expect(result.balance).toBe(0n);
            expect(result.balanceSol).toBe(0);
        });
    });

    describe('hasAgentSufficientBalance', () => {
        it('returns true when balance is sufficient', async () => {
            const mockConnection = createMockConnection();

            const result = await hasAgentSufficientBalance(
                mockConnection,
                testKeypair,
                100_000_000n // 0.1 SOL
            );

            expect(result.sufficient).toBe(true);
            expect(result.balance).toBe(1_000_000_000n);
        });

        it('returns false when balance is insufficient', async () => {
            const mockConnection = {
                ...createMockConnection(),
                getBalance: vi.fn().mockResolvedValue(10_000), // Very low balance
            } as unknown as Connection;

            const result = await hasAgentSufficientBalance(
                mockConnection,
                testKeypair,
                100_000_000n // 0.1 SOL
            );

            expect(result.sufficient).toBe(false);
        });

        it('includes buffer for transaction fees', async () => {
            const mockConnection = {
                ...createMockConnection(),
                getBalance: vi.fn().mockResolvedValue(100_000), // Exactly requested
            } as unknown as Connection;

            // Should fail because buffer (5M lamports) not included
            const result = await hasAgentSufficientBalance(
                mockConnection,
                testKeypair,
                100_000n
            );

            expect(result.sufficient).toBe(false);
            expect(result.required).toBe(5_100_000n); // 100000 + 5M buffer for priority fees
        });
    });

    describe('executeAgentPayment', () => {
        it('rejects invalid recipient address', async () => {
            const mockConnection = createMockConnection();

            const result = await executeAgentPayment({
                connection: mockConnection,
                agentKeypair: testKeypair,
                recipientAddress: 'invalid-address',
                amountLamports: 1_000_000n,
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('Invalid recipient address format');
        });

        it('rejects zero amount', async () => {
            const mockConnection = createMockConnection();
            const recipientKeypair = Keypair.generate();

            const result = await executeAgentPayment({
                connection: mockConnection,
                agentKeypair: testKeypair,
                recipientAddress: recipientKeypair.publicKey.toBase58(),
                amountLamports: 0n,
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('Amount must be greater than 0');
        });

        it('rejects negative amount', async () => {
            const mockConnection = createMockConnection();
            const recipientKeypair = Keypair.generate();

            const result = await executeAgentPayment({
                connection: mockConnection,
                agentKeypair: testKeypair,
                recipientAddress: recipientKeypair.publicKey.toBase58(),
                amountLamports: -1n,
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('Amount must be greater than 0');
        });

        it('executes payment successfully', async () => {
            const mockConnection = createMockConnection();
            const recipientKeypair = Keypair.generate();

            const result = await executeAgentPayment({
                connection: mockConnection,
                agentKeypair: testKeypair,
                recipientAddress: recipientKeypair.publicKey.toBase58(),
                amountLamports: 2_000_000n, // 0.002 SOL
            });

            expect(result.success).toBe(true);
            expect(result.signature).toBe('5wHu1qwD7q4H1YqPhHvKFJyM2Zy9P3E7H1qAhNFG1234');
            expect(result.amountLamports).toBe(2_000_000n);
            expect(result.amountSol).toBe(0.002);
        });

        it('handles transaction failure', async () => {
            const mockConnection = {
                ...createMockConnection(),
                confirmTransaction: vi.fn().mockResolvedValue({
                    value: { err: 'TransactionError' },
                    context: { slot: 12345 },
                }),
            } as unknown as Connection;
            const recipientKeypair = Keypair.generate();

            const result = await executeAgentPayment({
                connection: mockConnection,
                agentKeypair: testKeypair,
                recipientAddress: recipientKeypair.publicKey.toBase58(),
                amountLamports: 2_000_000n,
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('Transaction failed on-chain');
        });

        it('respects priority fee config', async () => {
            const mockConnection = createMockConnection();
            const recipientKeypair = Keypair.generate();

            const result = await executeAgentPayment({
                connection: mockConnection,
                agentKeypair: testKeypair,
                recipientAddress: recipientKeypair.publicKey.toBase58(),
                amountLamports: 2_000_000n,
                priorityFee: { enabled: true, microLamports: 5000 },
            });

            expect(result.success).toBe(true);
        });
    });
});
