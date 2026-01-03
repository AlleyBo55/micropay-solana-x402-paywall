// Utility functions
// Retry logic with exponential backoff for RPC resilience

export interface RetryOptions {
    /** Maximum number of attempts */
    maxAttempts?: number;
    /** Base delay in milliseconds */
    baseDelay?: number;
    /** Maximum delay in milliseconds */
    maxDelay?: number;
    /** Whether to add jitter to delay */
    jitter?: boolean;
    /** Errors to retry on (default: all) */
    retryOn?: (error: unknown) => boolean;
}

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff and optional jitter
 */
function calculateDelay(attempt: number, options: Required<Omit<RetryOptions, 'retryOn'>>): number {
    const { baseDelay, maxDelay, jitter } = options;

    // Exponential backoff: baseDelay * 2^attempt
    let delay = baseDelay * Math.pow(2, attempt);

    // Cap at maxDelay
    delay = Math.min(delay, maxDelay);

    // Add jitter (±25%)
    if (jitter) {
        const jitterAmount = delay * 0.25;
        delay += (Math.random() * jitterAmount * 2) - jitterAmount;
    }

    return Math.floor(delay);
}

/**
 * Execute a function with retry logic and exponential backoff
 * 
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => connection.getBalance(publicKey),
 *   { maxAttempts: 3, baseDelay: 500 }
 * );
 * ```
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxAttempts = 3,
        baseDelay = 500,
        maxDelay = 10000,
        jitter = true,
        retryOn = () => true,
    } = options;

    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check if we should retry this error
            if (!retryOn(error)) {
                throw error;
            }

            // Don't sleep after the last attempt
            if (attempt < maxAttempts - 1) {
                const delay = calculateDelay(attempt, {
                    maxAttempts,
                    baseDelay,
                    maxDelay,
                    jitter
                });
                await sleep(delay);
            }
        }
    }

    throw lastError;
}

/**
 * Check if error is a transient RPC error that should be retried
 */
export function isRetryableRPCError(error: unknown): boolean {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        // Rate limiting
        if (message.includes('429') || message.includes('rate limit')) {
            return true;
        }

        // Network errors
        if (message.includes('timeout') || message.includes('econnreset')) {
            return true;
        }

        // Server errors
        if (message.includes('503') || message.includes('502') || message.includes('500')) {
            return true;
        }

        // Solana-specific transient errors
        if (message.includes('blockhash not found') || message.includes('slot skipped')) {
            return true;
        }
    }

    return false;
}
