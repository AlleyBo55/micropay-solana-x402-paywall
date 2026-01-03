// x402 payment verification service
// SECURITY: Input validation, network verification, on-chain settlement check
import { verifyPayment, type SolanaClientConfig } from '../solana';
import type { PaymentPayload, PaymentRequirement, VerificationResponse } from '../types';

// Signature validation regex (base58, 87-88 chars)
const SIGNATURE_REGEX = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/;

/**
 * Verify a payment payload against requirements
 * SECURITY: Full validation chain - format, network, on-chain
 */
export async function verifyX402Payment(
    payload: PaymentPayload,
    requirement: PaymentRequirement,
    clientConfig: SolanaClientConfig
): Promise<VerificationResponse> {
    // SECURITY: Validate payload exists
    if (!payload || typeof payload !== 'object') {
        return { valid: false, invalidReason: 'Invalid payload' };
    }

    // SECURITY: Validate signature exists and format
    const signature = payload.payload?.signature;
    if (!signature || typeof signature !== 'string') {
        return { valid: false, invalidReason: 'Missing transaction signature' };
    }
    if (!SIGNATURE_REGEX.test(signature)) {
        return { valid: false, invalidReason: 'Invalid signature format' };
    }

    // SECURITY: Validate x402 version
    if (payload.x402Version !== 1) {
        return { valid: false, invalidReason: 'Unsupported x402 version' };
    }

    // SECURITY: Validate scheme
    if (payload.scheme !== 'exact') {
        return { valid: false, invalidReason: 'Unsupported payment scheme' };
    }

    // SECURITY: Validate network matches exactly
    if (payload.network !== requirement.network) {
        return {
            valid: false,
            invalidReason: `Network mismatch: expected ${requirement.network}`,
        };
    }

    // SECURITY: Validate requirement has valid payTo address
    const walletRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (!walletRegex.test(requirement.payTo)) {
        return { valid: false, invalidReason: 'Invalid recipient configuration' };
    }

    // SECURITY: Validate amount is positive
    let expectedAmount: bigint;
    try {
        expectedAmount = BigInt(requirement.maxAmountRequired);
        if (expectedAmount <= 0n) {
            return { valid: false, invalidReason: 'Invalid payment amount' };
        }
    } catch {
        return { valid: false, invalidReason: 'Invalid payment amount format' };
    }

    // Verify on-chain
    const verification = await verifyPayment({
        signature,
        expectedRecipient: requirement.payTo,
        expectedAmount,
        maxAgeSeconds: requirement.maxTimeoutSeconds,
        clientConfig,
    });

    if (!verification.valid) {
        return {
            valid: false,
            invalidReason: verification.error || 'Transaction verification failed',
        };
    }

    return {
        valid: true,
        settled: verification.confirmed,
        from: verification.from,
        transaction: {
            signature: verification.signature,
            blockTime: verification.blockTime,
            slot: verification.slot,
        },
    };
}

/**
 * Parse payment payload from X-Payment header (base64 encoded JSON)
 * SECURITY: Safe JSON parsing with try-catch
 * 
 * @example
 * const payload = parsePaymentHeader(request.headers.get('x-payment'));
 */
export function parsePaymentHeader(header: string): PaymentPayload | null {
    if (!header || typeof header !== 'string') {
        return null;
    }

    // SECURITY: Limit header size to prevent DoS
    if (header.length > 10000) {
        return null;
    }

    try {
        const decoded = Buffer.from(header, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);

        // Basic structure validation
        if (!parsed || typeof parsed !== 'object') {
            return null;
        }

        return parsed as PaymentPayload;
    } catch {
        return null;
    }
}

/**
 * Encode PaymentRequirement for X-Payment-Required header
 * Per x402 spec: base64 encoded JSON
 * 
 * @example
 * response.headers.set('X-Payment-Required', encodePaymentRequirement(requirement));
 */
export function encodePaymentRequirement(requirement: PaymentRequirement): string {
    return Buffer.from(JSON.stringify(requirement)).toString('base64');
}

/**
 * Encode VerificationResponse for X-Payment-Response header
 */
export function encodePaymentResponse(response: VerificationResponse): string {
    return Buffer.from(JSON.stringify(response)).toString('base64');
}

/**
 * Create a 402 Payment Required response with proper x402 headers
 * 
 * @example
 * if (!hasValidPayment) {
 *   return create402Response(requirement, { message: 'Payment required' });
 * }
 */
export function create402Response(
    requirement: PaymentRequirement,
    body?: object
): Response {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Payment-Required': encodePaymentRequirement(requirement),
    });

    const responseBody = body || {
        error: 'Payment Required',
        message: 'This resource requires payment to access',
        x402Version: 1,
        accepts: [requirement],
    };

    return new Response(JSON.stringify(responseBody), {
        status: 402,
        headers,
    });
}
