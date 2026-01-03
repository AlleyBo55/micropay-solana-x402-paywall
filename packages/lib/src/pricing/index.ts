// Price Conversion Helpers
// Multi-provider SOL price fetching with fallback rotation

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
    /** Request timeout in milliseconds (default: 5000) */
    timeout?: number;
}

// Cached price data
let cachedPrice: PriceData | null = null;
let config: PriceConfig = {};
let lastProviderIndex = -1;

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
 * // Or just adjust cache TTL
 * configurePricing({ cacheTTL: 30000 }); // 30 seconds
 * ```
 */
export function configurePricing(newConfig: PriceConfig): void {
    config = { ...config, ...newConfig };
    cachedPrice = null; // Clear cache on config change
}

/**
 * Built-in price providers with reliability rotation
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
): Promise<number> {
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

        return price;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Get SOL price with multi-provider fallback
 * 
 * Provider rotation order:
 * 1. CoinCap (primary)
 * 2. Binance (backup #1)
 * 3. CoinGecko (backup #2)
 * 4. Kraken (backup #3)
 * 
 * @example
 * ```typescript
 * const { solPrice, source } = await getSolPrice();
 * console.log(`SOL is $${solPrice} (from ${source})`);
 * ```
 */
export async function getSolPrice(): Promise<PriceData> {
    const cacheTTL = config.cacheTTL ?? 60000;
    const timeout = config.timeout ?? 5000;

    // Return cached price if valid
    if (cachedPrice && Date.now() - cachedPrice.fetchedAt.getTime() < cacheTTL) {
        return cachedPrice;
    }

    // Try custom provider first if configured
    if (config.customProvider) {
        try {
            const price = await config.customProvider();
            if (price > 0) {
                cachedPrice = {
                    solPrice: price,
                    fetchedAt: new Date(),
                    source: 'custom',
                };
                return cachedPrice;
            }
        } catch {
            // Fall through to built-in providers
        }
    }

    // Try providers in rotation, starting after the last successful one
    for (let i = 0; i < PROVIDERS.length; i++) {
        const idx = (lastProviderIndex + 1 + i) % PROVIDERS.length;
        const provider = PROVIDERS[idx];

        try {
            const price = await fetchFromProvider(provider, timeout);
            lastProviderIndex = idx;

            cachedPrice = {
                solPrice: price,
                fetchedAt: new Date(),
                source: provider.name,
            };
            return cachedPrice;
        } catch {
            // Try next provider
            continue;
        }
    }

    // All providers failed, use stale cache if available
    if (cachedPrice) {
        // Mark as stale but still usable
        return {
            ...cachedPrice,
            source: `${cachedPrice.source} (stale)`,
        };
    }

    // SECURITY: Never use hardcoded fallback - throw error instead
    throw new Error(
        'Failed to fetch SOL price from all providers. ' +
        'Configure a custom provider or ensure network connectivity.'
    );
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
    cachedPrice = null;
    lastProviderIndex = -1;
}

/**
 * Get list of available built-in providers
 */
export function getProviders(): { name: string; url: string }[] {
    return PROVIDERS.map(p => ({ name: p.name, url: p.url }));
}
