// Payment-related TypeScript types for x402 protocol

/** x402 network identifiers for Solana */
export type X402Network = 'solana-devnet' | 'solana-mainnet';

/** Solana network types */
export type SolanaNetwork = 'devnet' | 'mainnet-beta';

/** SPL Token asset specification */
export interface SPLTokenAsset {
    /** Token mint address */
    mint: string;
    /** Token decimals (default: 6 for USDC/USDT) */
    decimals?: number;
}

/** Asset types for payments */
export type PaymentAsset = 'native' | 'usdc' | 'usdt' | SPLTokenAsset;

/** Known SPL token mint addresses */
export const TOKEN_MINTS = {
    /** USDC on mainnet */
    USDC_MAINNET: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    /** USDC on devnet */
    USDC_DEVNET: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    /** USDT on mainnet */
    USDT_MAINNET: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
} as const;

/** Payment requirement for x402 protocol */
export interface PaymentRequirement {
    /** Payment scheme - currently only 'exact' is supported */
    scheme: 'exact';
    /** Network identifier for x402 */
    network: X402Network;
    /** Amount in smallest unit as string (lamports for SOL, base units for tokens) */
    maxAmountRequired: string;
    /** URL of the protected resource */
    resource: string;
    /** Human-readable description */
    description: string;
    /** MIME type of the resource */
    mimeType?: string;
    /** Recipient wallet address */
    payTo: string;
    /** Maximum time in seconds to complete payment */
    maxTimeoutSeconds: number;
    /** Asset type - 'native' for SOL, 'usdc', 'usdt', or custom mint */
    asset: PaymentAsset;
    /** Additional metadata */
    extra?: {
        name?: string;
        articleId?: string;
        [key: string]: unknown;
    };
}

/** Payment payload sent by client after transaction */
export interface PaymentPayload {
    /** x402 protocol version */
    x402Version: number;
    /** Payment scheme */
    scheme: 'exact';
    /** Network identifier */
    network: X402Network;
    /** Transaction details */
    payload: {
        /** Transaction signature (base58) */
        signature: string;
        /** Base64 encoded transaction (optional) */
        transaction?: string;
    };
}

/** Request to verify a payment */
export interface VerificationRequest {
    paymentPayload: PaymentPayload;
    paymentRequirements: PaymentRequirement;
}

/** Response from payment verification */
export interface VerificationResponse {
    /** Whether the payment is valid */
    valid: boolean;
    /** Reason for invalid payment */
    invalidReason?: string;
    /** Whether the transaction is settled on-chain */
    settled?: boolean;
    /** Sender wallet address (payer) */
    from?: string;
    /** Transaction details */
    transaction?: {
        signature: string;
        blockTime?: number;
        slot?: number;
    };
}

/** Payment status for tracking */
export interface PaymentStatus {
    status: 'pending' | 'confirmed' | 'failed' | 'expired';
    signature?: string;
    confirmations?: number;
    error?: string;
}

/** x402 HTTP header constants */
export const X402_HEADERS = {
    PAYMENT_REQUIRED: 'x-payment-required',
    PAYMENT: 'x-payment',
    PAYMENT_RESPONSE: 'x-payment-response',
} as const;

/** Configuration for article pricing */
export interface ArticlePaymentConfig {
    articleId: string;
    priceInLamports: bigint;
    title: string;
    description?: string;
}
