// Tests for Solana Client with RPC Fallback
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getConnection,
    getConnectionWithFallback,
    withFallback,
    resetConnection,
    isMainnet,
    toX402Network,
    type SolanaClientConfig,
} from '../client';

// Real devnet RPC endpoints for testing
const DEVNET_PRIMARY = 'https://api.devnet.solana.com';
const DEVNET_FALLBACK = 'https://rpc.ankr.com/solana_devnet';

describe('solana/client', () => {
    beforeEach(() => {
        resetConnection();
    });

    describe('getConnection', () => {
        it('creates connection for devnet', () => {
            const config: SolanaClientConfig = { network: 'devnet' };
            const connection = getConnection(config);
            expect(connection).toBeDefined();
            expect(connection.rpcEndpoint).toContain('devnet');
        });

        it('creates connection for mainnet-beta', () => {
            const config: SolanaClientConfig = { network: 'mainnet-beta' };
            const connection = getConnection(config);
            expect(connection).toBeDefined();
        });

        it('uses custom RPC URL when provided', () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                rpcUrl: DEVNET_PRIMARY,
            };
            const connection = getConnection(config);
            expect(connection.rpcEndpoint).toBe(DEVNET_PRIMARY);
        });

        it('builds Tatum URL with API key', () => {
            const config: SolanaClientConfig = {
                network: 'mainnet-beta',
                tatumApiKey: 'test-api-key',
            };
            const connection = getConnection(config);
            expect(connection.rpcEndpoint).toContain('tatum.io');
            expect(connection.rpcEndpoint).toContain('test-api-key');
        });

        it('caches connection for same network', () => {
            const config: SolanaClientConfig = { network: 'devnet' };
            const conn1 = getConnection(config);
            const conn2 = getConnection(config);
            expect(conn1).toBe(conn2);
        });

        it('creates new connection for different network', () => {
            const conn1 = getConnection({ network: 'devnet' });
            resetConnection();
            const conn2 = getConnection({ network: 'mainnet-beta' });
            expect(conn1).not.toBe(conn2);
        });
    });

    describe('getConnectionWithFallback', () => {
        it('returns fallbackEnabled as false by default', () => {
            const config: SolanaClientConfig = { network: 'devnet' };
            const result = getConnectionWithFallback(config);
            expect(result.fallbackEnabled).toBe(false);
            expect(result.fallbacks).toEqual([]);
        });

        it('returns fallbacks when configured with real devnet URLs', () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                rpcUrl: DEVNET_PRIMARY,
                enableFallback: true,
                fallbackRpcUrls: [DEVNET_FALLBACK],
            };
            const result = getConnectionWithFallback(config);
            expect(result.fallbackEnabled).toBe(true);
            expect(result.fallbacks).toHaveLength(1);
            expect(result.fallbacks[0].rpcEndpoint).toBe(DEVNET_FALLBACK);
        });

        it('returns empty fallbacks when enabled but no URLs provided', () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                enableFallback: true,
            };
            const result = getConnectionWithFallback(config);
            expect(result.fallbackEnabled).toBe(true);
            expect(result.fallbacks).toEqual([]);
        });

        it('configures multiple fallback endpoints', () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                rpcUrl: DEVNET_PRIMARY,
                enableFallback: true,
                fallbackRpcUrls: [
                    DEVNET_FALLBACK,
                    'https://solana-devnet.g.alchemy.com/v2/demo',
                ],
            };
            const result = getConnectionWithFallback(config);
            expect(result.fallbacks).toHaveLength(2);
        });
    });

    describe('isMainnet', () => {
        it('returns true for mainnet-beta', () => {
            expect(isMainnet('mainnet-beta')).toBe(true);
        });

        it('returns false for devnet', () => {
            expect(isMainnet('devnet')).toBe(false);
        });
    });

    describe('toX402Network', () => {
        it('converts mainnet-beta to solana-mainnet', () => {
            expect(toX402Network('mainnet-beta')).toBe('solana-mainnet');
        });

        it('converts devnet to solana-devnet', () => {
            expect(toX402Network('devnet')).toBe('solana-devnet');
        });
    });

    describe('withFallback', () => {
        it('executes operation on primary connection when successful', async () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                rpcUrl: DEVNET_PRIMARY,
                enableFallback: true,
                fallbackRpcUrls: [DEVNET_FALLBACK],
            };

            // Force connection creation
            getConnection(config);

            const mockOperation = vi.fn().mockResolvedValue('success');
            const result = await withFallback(config, mockOperation);

            expect(result).toBe('success');
            expect(mockOperation).toHaveBeenCalledTimes(1);
        });

        it('throws immediately when fallback is disabled', async () => {
            const config: SolanaClientConfig = { network: 'devnet' };
            getConnection(config);

            const error = new Error('RPC error');
            const mockOperation = vi.fn().mockRejectedValue(error);

            await expect(withFallback(config, mockOperation)).rejects.toThrow('RPC error');
        });

        it('throws for non-retryable errors even with fallback enabled', async () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                rpcUrl: DEVNET_PRIMARY,
                enableFallback: true,
                fallbackRpcUrls: [DEVNET_FALLBACK],
            };
            getConnection(config);

            const error = new Error('Invalid signature');
            const mockOperation = vi.fn().mockRejectedValue(error);

            await expect(withFallback(config, mockOperation)).rejects.toThrow('Invalid signature');
        });

        it('tries fallback on retryable errors (429, 503)', async () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                rpcUrl: DEVNET_PRIMARY,
                enableFallback: true,
                fallbackRpcUrls: [DEVNET_FALLBACK],
            };
            getConnection(config);

            const rateLimitError = new Error('HTTP 429 Too Many Requests');
            const mockOperation = vi
                .fn()
                .mockRejectedValueOnce(rateLimitError)
                .mockResolvedValueOnce('fallback-success');

            const result = await withFallback(config, mockOperation);
            expect(result).toBe('fallback-success');
            expect(mockOperation).toHaveBeenCalledTimes(2);
        });
    });

    describe('integration: real devnet RPC', () => {
        it('can fetch slot from devnet', async () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                rpcUrl: DEVNET_PRIMARY,
            };
            const connection = getConnection(config);

            // This makes a real RPC call
            const slot = await connection.getSlot();
            expect(slot).toBeGreaterThan(0);
        });

        it('can use withFallback for real RPC calls', async () => {
            const config: SolanaClientConfig = {
                network: 'devnet',
                rpcUrl: DEVNET_PRIMARY,
                enableFallback: true,
                fallbackRpcUrls: [DEVNET_FALLBACK],
            };
            getConnection(config);

            const slot = await withFallback(config, (conn) => conn.getSlot());
            expect(slot).toBeGreaterThan(0);
        });
    });
});

