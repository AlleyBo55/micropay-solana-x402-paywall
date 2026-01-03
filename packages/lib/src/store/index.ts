// Signature Store Exports
// Re-exports from implementations to avoid circular dependencies

// Core types and memory store
export type { SignatureStore, SignatureUsage, MemoryStoreOptions } from './memory';
export { createMemoryStore } from './memory';

// Redis store
export type { RedisStoreOptions, RedisClient } from './redis';
export { createRedisStore } from './redis';

// Store configuration type
export interface StoreConfig {
    /** Default TTL in seconds for signature records */
    defaultTTL?: number;
    /** Prefix for keys (useful for Redis) */
    keyPrefix?: string;
}

