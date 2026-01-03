// Solana RPC client with multi-provider support and optional fallback
import { Connection, clusterApiUrl, type Cluster } from '@solana/web3.js';
import type { SolanaNetwork } from '../types';

/** Configuration for Solana client */
export interface SolanaClientConfig {
    /** Network to connect to */
    network: SolanaNetwork;
    /** Custom RPC URL (optional) */
    rpcUrl?: string;
    /** Tatum.io API key for RPC (optional) */
    tatumApiKey?: string;
    /** Enable RPC fallback on errors (default: false) */
    enableFallback?: boolean;
    /** Fallback RPC URLs to try on primary failure (optional) */
    fallbackRpcUrls?: string[];
}

/** RPC connection with fallback support */
export interface RpcConnectionWithFallback {
    /** Primary connection */
    connection: Connection;
    /** Fallback connections (if configured) */
    fallbacks: Connection[];
    /** Whether fallback is enabled */
    fallbackEnabled: boolean;
}

// Singleton state
let cachedConnection: Connection | null = null;
let cachedNetwork: SolanaNetwork | null = null;
let cachedFallbacks: Connection[] = [];
let cachedFallbackEnabled = false;

/**
 * Build RPC URL based on configuration priority:
 * 1. Custom RPC URL
 * 2. Tatum.io with API key
 * 3. Public RPC (rate limited)
 */
function buildRpcUrl(config: SolanaClientConfig): string {
    const { network, rpcUrl, tatumApiKey } = config;

    if (rpcUrl) {
        // If Tatum URL without key, append key if available
        if (rpcUrl.includes('tatum.io') && tatumApiKey && !rpcUrl.includes(tatumApiKey)) {
            return rpcUrl.endsWith('/') ? `${rpcUrl}${tatumApiKey}` : `${rpcUrl}/${tatumApiKey}`;
        }
        return rpcUrl;
    }

    if (tatumApiKey) {
        const baseUrl = network === 'mainnet-beta'
            ? 'https://solana-mainnet.gateway.tatum.io'
            : 'https://solana-devnet.gateway.tatum.io';
        return `${baseUrl}/${tatumApiKey}`;
    }

    // Fallback to public RPC
    return clusterApiUrl(network as Cluster);
}

/**
 * Create a connection with specified options
 */
function createConnection(rpcUrl: string): Connection {
    return new Connection(rpcUrl, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
    });
}

/**
 * Get or create a Solana connection
 * Uses singleton pattern with network-aware caching
 */
export function getConnection(config: SolanaClientConfig): Connection {
    const { network } = config;

    // Return cached if same network
    if (cachedConnection && cachedNetwork === network) {
        return cachedConnection;
    }

    const rpcUrl = buildRpcUrl(config);
    cachedConnection = createConnection(rpcUrl);
    cachedNetwork = network;

    // Setup fallbacks if enabled
    cachedFallbackEnabled = config.enableFallback ?? false;
    cachedFallbacks = [];

    if (cachedFallbackEnabled && config.fallbackRpcUrls?.length) {
        cachedFallbacks = config.fallbackRpcUrls.map(createConnection);
    }

    return cachedConnection;
}

/**
 * Get connection with fallback support
 * Returns both primary and fallback connections for manual failover
 */
export function getConnectionWithFallback(config: SolanaClientConfig): RpcConnectionWithFallback {
    const connection = getConnection(config);
    return {
        connection,
        fallbacks: cachedFallbacks,
        fallbackEnabled: cachedFallbackEnabled,
    };
}

/**
 * Execute an RPC call with automatic fallback on failure
 * Only used when fallback is enabled in config
 * 
 * @example
 * ```typescript
 * const balance = await withFallback(
 *   config,
 *   (conn) => conn.getBalance(publicKey)
 * );
 * ```
 */
export async function withFallback<T>(
    config: SolanaClientConfig,
    operation: (connection: Connection) => Promise<T>
): Promise<T> {
    const { connection, fallbacks, fallbackEnabled } = getConnectionWithFallback(config);

    try {
        return await operation(connection);
    } catch (error) {
        if (!fallbackEnabled || fallbacks.length === 0) {
            throw error;
        }

        // Check if error is retryable (network errors, rate limits)
        if (!isRetryableError(error)) {
            throw error;
        }

        // Try fallbacks in order
        for (let i = 0; i < fallbacks.length; i++) {
            try {
                return await operation(fallbacks[i]);
            } catch (fallbackError) {
                // If last fallback, throw the error
                if (i === fallbacks.length - 1) {
                    throw fallbackError;
                }
                // Otherwise continue to next fallback
            }
        }

        // Should never reach here, but TypeScript needs this
        throw error;
    }
}

/**
 * Check if an error is retryable (network issues, rate limits)
 */
function isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return (
            message.includes('429') ||
            message.includes('503') ||
            message.includes('502') ||
            message.includes('timeout') ||
            message.includes('econnrefused') ||
            message.includes('enotfound') ||
            message.includes('rate limit')
        );
    }
    return false;
}

/**
 * Reset the cached connection
 * Useful for testing or network switching
 */
export function resetConnection(): void {
    cachedConnection = null;
    cachedNetwork = null;
}

/**
 * Check if network is mainnet
 */
export function isMainnet(network: SolanaNetwork): boolean {
    return network === 'mainnet-beta';
}

/**
 * Convert Solana network to x402 network identifier
 */
export function toX402Network(network: SolanaNetwork): 'solana-devnet' | 'solana-mainnet' {
    return network === 'mainnet-beta' ? 'solana-mainnet' : 'solana-devnet';
}
