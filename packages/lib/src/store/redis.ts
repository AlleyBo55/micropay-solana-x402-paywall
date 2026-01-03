// Redis Signature Store Adapter
// For production multi-instance deployments

import type { SignatureStore, SignatureUsage } from './memory';

/**
 * Minimal Redis client interface
 * Compatible with ioredis, redis, and similar clients
 */
export interface RedisClient {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, options?: { EX?: number }): Promise<string | null>;
    setex?(key: string, seconds: number, value: string): Promise<string>;
    exists(key: string): Promise<number>;
    del(key: string): Promise<number>;
}

export interface RedisStoreOptions {
    /** Redis client instance */
    client: RedisClient;
    /** Key prefix */
    keyPrefix?: string;
    /** Default TTL in seconds */
    defaultTTL?: number;
}

/**
 * Create a Redis-backed signature store
 * Production-ready for distributed deployments
 */
export function createRedisStore(options: RedisStoreOptions): SignatureStore {
    const { client, keyPrefix = 'micropay:sig:' } = options;

    const buildKey = (signature: string) => `${keyPrefix}${signature}`;

    return {
        async hasBeenUsed(signature: string): Promise<boolean> {
            const exists = await client.exists(buildKey(signature));
            return exists > 0;
        },

        async markAsUsed(signature: string, resourceId: string, expiresAt: Date): Promise<void> {
            const key = buildKey(signature);
            const ttl = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));

            const record: SignatureUsage = {
                signature,
                resourceId,
                usedAt: new Date(),
                expiresAt,
            };

            // Support both `setex` (ioredis) and `set` with EX (node-redis)
            if (client.setex) {
                await client.setex(key, ttl, JSON.stringify(record));
            } else {
                await client.set(key, JSON.stringify(record), { EX: ttl });
            }
        },

        async getUsage(signature: string): Promise<SignatureUsage | null> {
            const data = await client.get(buildKey(signature));
            if (!data) return null;

            try {
                const record = JSON.parse(data) as SignatureUsage;
                // Convert date strings back to Date objects
                return {
                    ...record,
                    usedAt: new Date(record.usedAt),
                    expiresAt: new Date(record.expiresAt),
                };
            } catch {
                return null;
            }
        },
    };
}
