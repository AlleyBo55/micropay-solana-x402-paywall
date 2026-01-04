// Price Conversion Helpers
// Multi-provider SOL price fetching with parallel racing and serverless-safe caching

/**
 * Price data from API
 */
export interface PriceData {
    /** SOL price in USD */
    solPrice: number;
    /** Timestamp of price fetch */
    fetchedAt: Date;
    /** Source of price data */
    source: string;
}

/**
 * Custom price provider function type
 */
export type CustomPriceProvider = () => Promise<number>;

/**
 * Price provider configuration
 */
export interface PriceConfig {
    /** Custom price provider (if set, skips built-in providers) */
    customProvider?: CustomPriceProvider;
    /** Cache TTL in milliseconds (default: 60000) */
    cacheTTL?: number;
    /** Request timeout in milliseconds (default: 3000) */
    timeout?: number;
    /** Use parallel fetching (default: true, faster but more network calls) */
    parallelFetch?: boolean;
}

/**
 * Serverless-safe price cache
 * Uses timestamp-based invalidation to handle cold starts properly
 */
interface PriceCache {
    data: PriceData;
    timestamp: number;
}

// Module-level cache with explicit timestamp checking
// Works correctly in serverless: if cache is stale, it's ignored
let priceCache: PriceCache | null = null;
let currentConfig: PriceConfig = {};

/**
 * Configure price fetching
 * 
 * @example
 * ```typescript
 * // Use custom API
 * configurePricing({
 *   customProvider: async () => {
 *     const res = await fetch('https://my-api.com/sol-price');
 *     return (await res.json()).price;
 *   },
 * });
 * 
 * // Or adjust settings
 * configurePricing({ cacheTTL: 30000, parallelFetch: true });
 * ```
 */
export function configurePricing(newConfig: PriceConfig): void {
    currentConfig = { ...currentConfig, ...newConfig };
    // Don't clear cache on config change - let TTL handle it
}

/**
 * Built-in price providers with parallel support
 */
const PROVIDERS = [
    {
        name: 'coincap',
        url: 'https://api.coincap.io/v2/assets/solana',
        parse: (data: { data?: { priceUsd?: string } }) => parseFloat(data.data?.priceUsd || '0'),
    },
    {
        name: 'binance',
        url: 'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
        parse: (data: { price?: string }) => parseFloat(data.price || '0'),
    },
    {
        name: 'coingecko',
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
        parse: (data: { solana?: { usd?: number } }) => data.solana?.usd || 0,
    },
    {
        name: 'kraken',
        url: 'https://api.kraken.com/0/public/Ticker?pair=SOLUSD',
        parse: (data: { result?: { SOLUSD?: { c?: string[] } } }) =>
            parseFloat(data.result?.SOLUSD?.c?.[0] || '0'),
    },
];

/**
 * Fetch price from a single provider
 */
async function fetchFromProvider(
    provider: typeof PROVIDERS[0],
    timeout: number
): Promise<{ price: number; source: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(provider.url, {
            headers: { 'Accept': 'application/json' },
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json() as Record<string, unknown>;
        const price = provider.parse(data as Parameters<typeof provider.parse>[0]);

        if (!price || price <= 0) {
            throw new Error('Invalid price');
        }

        return { price, source: provider.name };
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Fetch price using parallel racing (fastest provider wins)
 */
async function fetchPriceParallel(timeout: number): Promise<{ price: number; source: string }> {
    const promises = PROVIDERS.map(provider =>
        fetchFromProvider(provider, timeout).catch(() => null)
    );

    // Race all providers, first successful one wins
    const results = await Promise.all(promises);
    const validResult = results.find(r => r !== null);

    if (validResult) {
        return validResult;
    }

    throw new Error('All providers failed');
}

/**
 * Fetch price using sequential fallback
 */
async function fetchPriceSequential(timeout: number): Promise<{ price: number; source: string }> {
    for (const provider of PROVIDERS) {
        try {
            return await fetchFromProvider(provider, timeout);
        } catch {
            continue;
        }
    }
    throw new Error('All providers failed');
}

/**
 * Get SOL price with multi-provider support
 * 
 * Default behavior: Parallel fetch (all providers race, fastest wins)
 * This is faster and more reliable in serverless environments.
 * 
 * @example
 * ```typescript
 * const { solPrice, source } = await getSolPrice();
 * console.log(`SOL is $${solPrice} (from ${source})`);
 * ```
 */
export async function getSolPrice(): Promise<PriceData> {
    const cacheTTL = currentConfig.cacheTTL ?? 60000;
    const timeout = currentConfig.timeout ?? 3000;
    const useParallel = currentConfig.parallelFetch ?? true;
    const now = Date.now();

    // Return cached price if valid (serverless-safe: explicit timestamp check)
    if (priceCache && (now - priceCache.timestamp) < cacheTTL) {
        return priceCache.data;
    }

    // Try custom provider first if configured
    if (currentConfig.customProvider) {
        try {
            const price = await currentConfig.customProvider();
            if (price > 0) {
                const data: PriceData = {
                    solPrice: price,
                    fetchedAt: new Date(),
                    source: 'custom',
                };
                priceCache = { data, timestamp: now };
                return data;
            }
        } catch {
            // Fall through to built-in providers
        }
    }

    // Fetch from providers
    try {
        const result = useParallel
            ? await fetchPriceParallel(timeout)
            : await fetchPriceSequential(timeout);

        const data: PriceData = {
            solPrice: result.price,
            fetchedAt: new Date(),
            source: result.source,
        };
        priceCache = { data, timestamp: now };
        return data;
    } catch {
        // All providers failed, use stale cache if available
        if (priceCache) {
            return {
                ...priceCache.data,
                source: `${priceCache.data.source} (stale)`,
            };
        }

        // SECURITY: Never use hardcoded fallback - throw error instead
        throw new Error(
            'Failed to fetch SOL price from all providers. ' +
            'Configure a custom provider or ensure network connectivity.'
        );
    }
}

/**
 * Convert lamports to USD
 * 
 * @example
 * ```typescript
 * const usd = await lamportsToUsd(10_000_000n); // 0.01 SOL
 * console.log(`$${usd.toFixed(2)}`);
 * ```
 */
export async function lamportsToUsd(lamports: bigint): Promise<number> {
    const { solPrice } = await getSolPrice();
    const sol = Number(lamports) / 1_000_000_000;
    return sol * solPrice;
}

/**
 * Convert USD to lamports
 * 
 * @example
 * ```typescript
 * const lamports = await usdToLamports(1.50); // $1.50
 * console.log(`${lamports} lamports`);
 * ```
 */
export async function usdToLamports(usd: number): Promise<bigint> {
    const { solPrice } = await getSolPrice();
    const sol = usd / solPrice;
    return BigInt(Math.floor(sol * 1_000_000_000));
}

/**
 * Format a price for display with both SOL and USD
 * 
 * @example
 * ```typescript
 * const display = await formatPriceDisplay(10_000_000n);
 * // Returns: "0.0100 SOL (~$1.50)"
 * ```
 */
export async function formatPriceDisplay(lamports: bigint): Promise<string> {
    const { solPrice } = await getSolPrice();
    const sol = Number(lamports) / 1_000_000_000;
    const usd = sol * solPrice;

    return `${sol.toFixed(4)} SOL (~$${usd.toFixed(2)})`;
}

/**
 * Synchronous price formatting (requires pre-fetched price)
 */
export function formatPriceSync(lamports: bigint, solPrice: number): {
    sol: number;
    usd: number;
    formatted: string;
} {
    const sol = Number(lamports) / 1_000_000_000;
    const usd = sol * solPrice;

    return {
        sol,
        usd,
        formatted: `${sol.toFixed(4)} SOL (~$${usd.toFixed(2)})`,
    };
}

/**
 * Clear the price cache (for testing or manual refresh)
 */
export function clearPriceCache(): void {
    priceCache = null;
}

/**
 * Get list of available built-in providers
 */
export * from './utils';
export function getProviders(): { name: string; url: string }[] {
    return PROVIDERS.map(p => ({ name: p.name, url: p.url }));
}
