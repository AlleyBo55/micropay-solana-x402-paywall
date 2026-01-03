// x402 payment configuration and helpers
// SECURITY: Input sanitization for payment requirements
import type { PaymentRequirement, X402Network, SolanaNetwork } from '../types';
import { toX402Network } from '../solana';

// Wallet address validation regex
const WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/** Parameters for building a payment requirement */
export interface BuildPaymentParams {
    /** Unique article identifier */
    articleId: string;
    /** Article title for display */
    articleTitle: string;
    /** Price in lamports */
    priceInLamports: bigint;
    /** Creator wallet address */
    creatorWallet: string;
    /** Full URL of the protected resource */
    resourceUrl: string;
    /** Solana network */
    network: SolanaNetwork;
    /** Max time to complete payment (default: 300s) */
    maxTimeoutSeconds?: number;
}

/**
 * Sanitize string for safe display (prevent XSS in UIs)
 */
function sanitizeDisplayString(str: string, maxLength: number = 200): string {
    if (!str || typeof str !== 'string') return '';
    return str.slice(0, maxLength).replace(/[<>"'&]/g, '');
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Build a payment requirement for an article
 * SECURITY: Validates all inputs before building requirement
 */
export function buildPaymentRequirement(params: BuildPaymentParams): PaymentRequirement {
    // Validate wallet address
    if (!WALLET_REGEX.test(params.creatorWallet)) {
        throw new Error('Invalid creator wallet address');
    }

    // Validate price
    if (params.priceInLamports <= 0n) {
        throw new Error('Price must be positive');
    }

    // Validate URL
    if (!isValidUrl(params.resourceUrl)) {
        throw new Error('Invalid resource URL');
    }

    // Validate network
    if (params.network !== 'devnet' && params.network !== 'mainnet-beta') {
        throw new Error('Invalid network');
    }

    // Validate timeout
    const timeout = params.maxTimeoutSeconds ?? 300;
    if (timeout < 60 || timeout > 3600) {
        throw new Error('Timeout must be between 60 and 3600 seconds');
    }

    const x402Network = toX402Network(params.network);

    // Sanitize display strings
    const safeTitle = sanitizeDisplayString(params.articleTitle, 200);
    const safeArticleId = sanitizeDisplayString(params.articleId, 128);

    return {
        scheme: 'exact',
        network: x402Network,
        maxAmountRequired: params.priceInLamports.toString(),
        resource: params.resourceUrl,
        description: `Unlock: ${safeTitle}`,
        mimeType: 'text/html',
        payTo: params.creatorWallet,
        maxTimeoutSeconds: timeout,
        asset: 'native',
        extra: {
            name: safeTitle,
            articleId: safeArticleId,
        },
    };
}

/**
 * Encode payment requirement for x402 header
 */
export function encodePaymentRequired(requirement: PaymentRequirement): string {
    return Buffer.from(JSON.stringify(requirement)).toString('base64');
}

/**
 * Decode payment requirement from x402 header
 * SECURITY: Safe parsing with size limit
 */
export function decodePaymentRequired(encoded: string): PaymentRequirement {
    if (!encoded || typeof encoded !== 'string') {
        throw new Error('Invalid encoded requirement');
    }

    // SECURITY: Limit size to prevent DoS
    if (encoded.length > 10000) {
        throw new Error('Encoded requirement too large');
    }

    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    } catch {
        throw new Error('Failed to decode payment requirement');
    }
}

/**
 * x402 response header names
 */
export const X402_HEADERS = {
    PAYMENT_REQUIRED: 'X-Payment-Required',
    PAYMENT: 'X-Payment',
    PAYMENT_RESPONSE: 'X-Payment-Response',
} as const;

/**
 * Create 402 Payment Required response body
 */
export function create402ResponseBody(requirement: PaymentRequirement): {
    error: string;
    message: string;
    price: { amount: string; asset: string; network: X402Network };
} {
    // Convert asset to string for JSON serialization
    const assetStr = typeof requirement.asset === 'string'
        ? requirement.asset
        : requirement.asset.mint;

    return {
        error: 'Payment Required',
        message: requirement.description,
        price: {
            amount: requirement.maxAmountRequired,
            asset: assetStr,
            network: requirement.network,
        },
    };
}

/**
 * Create headers for 402 response
 */
export function create402Headers(requirement: PaymentRequirement): Record<string, string> {
    const encoded = encodePaymentRequired(requirement);
    return {
        'Content-Type': 'application/json',
        [X402_HEADERS.PAYMENT_REQUIRED]: encoded,
        'Access-Control-Expose-Headers': X402_HEADERS.PAYMENT_REQUIRED,
    };
}
