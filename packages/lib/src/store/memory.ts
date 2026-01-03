// In-Memory Signature Store
// For development, testing, and single-instance deployments

/** Signature usage record */
export interface SignatureUsage {
    signature: string;
    resourceId: string;
    usedAt: Date;
    expiresAt: Date;
    walletAddress?: string;
}

/** Interface for tracking payment signature usage */
export interface SignatureStore {
    hasBeenUsed(signature: string): Promise<boolean>;
    markAsUsed(signature: string, resourceId: string, expiresAt: Date): Promise<void>;
    getUsage?(signature: string): Promise<SignatureUsage | null>;
}

export interface MemoryStoreOptions {
    /** Default TTL in seconds */
    defaultTTL?: number;
    /** Cleanup interval in ms (default: 60000) */
    cleanupInterval?: number;
}

interface StoredRecord {
    resourceId: string;
    usedAt: number;
    expiresAt: number;
    walletAddress?: string;
}

/**
 * Create an in-memory signature store
 * ⚠️ Not suitable for multi-instance deployments (use Redis instead)
 */
export function createMemoryStore(options: MemoryStoreOptions = {}): SignatureStore & { close: () => void } {
    const { cleanupInterval = 60000 } = options;
    const store = new Map<string, StoredRecord>();

    // Periodic cleanup of expired entries
    const cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of store.entries()) {
            if (record.expiresAt < now) {
                store.delete(key);
            }
        }
    }, cleanupInterval);

    return {
        async hasBeenUsed(signature: string): Promise<boolean> {
            const record = store.get(signature);
            if (!record) return false;

            // Check if expired
            if (record.expiresAt < Date.now()) {
                store.delete(signature);
                return false;
            }

            return true;
        },

        async markAsUsed(signature: string, resourceId: string, expiresAt: Date): Promise<void> {
            store.set(signature, {
                resourceId,
                usedAt: Date.now(),
                expiresAt: expiresAt.getTime(),
            });
        },

        async getUsage(signature: string): Promise<SignatureUsage | null> {
            const record = store.get(signature);
            if (!record) return null;

            // Check expiration
            if (record.expiresAt < Date.now()) {
                store.delete(signature);
                return null;
            }

            return {
                signature,
                resourceId: record.resourceId,
                usedAt: new Date(record.usedAt),
                expiresAt: new Date(record.expiresAt),
                walletAddress: record.walletAddress,
            };
        },

        /** Stop cleanup timer (for graceful shutdown) */
        close(): void {
            clearInterval(cleanupTimer);
            store.clear();
        },
    };
}
