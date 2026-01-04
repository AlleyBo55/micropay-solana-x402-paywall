// Bundle Credits System
// Optional credit-based session management for agent payments

import { SignJWT, jwtVerify } from 'jose';
// Replace 'uuid' with native crypto for smaller bundle size
const uuidv4 = () => crypto.randomUUID();
import type { SessionConfig, SessionData } from '../session/types';

/** Credit claims stored in session JWT */
export interface CreditSessionClaims {
    /** Number of remaining credits */
    credits: number;
    /** Unix timestamp when bundle expires (optional) */
    bundleExpiry?: number;
    /** Bundle type identifier (e.g., 'starter', 'pro') */
    bundleType?: string;
}

/** Extended session data with credit information */
export type CreditSessionData = SessionData & CreditSessionClaims;

/** Configuration for credit sessions */
export interface CreditSessionConfig extends SessionConfig {
    /** Initial number of credits */
    initialCredits: number;
    /** Bundle expiry in hours (optional, defaults to session duration) */
    bundleExpiryHours?: number;
    /** Bundle type identifier */
    bundleType?: string;
}

/** JWT payload for credit sessions */
interface CreditJWTPayload {
    sub: string;
    sid: string;
    articles: string[];
    siteWide: boolean;
    credits: number;
    bundleExpiry?: number;
    bundleType?: string;
    iat: number;
    exp: number;
}

// Constants
const MAX_CREDITS = 1000;
const MIN_SECRET_LENGTH = 32;

/**
 * Get the secret key for JWT signing
 */
function getSecretKey(secret: string): Uint8Array {
    if (!secret || typeof secret !== 'string') {
        throw new Error('Session secret is required');
    }
    if (secret.length < MIN_SECRET_LENGTH) {
        throw new Error(`Session secret must be at least ${MIN_SECRET_LENGTH} characters`);
    }
    return new TextEncoder().encode(secret);
}

/**
 * Validate wallet address format
 */
function validateWalletAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
}

/**
 * Create a new credit session after bundle purchase
 * 
 * @example
 * ```typescript
 * import { createCreditSession } from '@alleyboss/micropay-solana-x402-paywall/agent';
 * 
 * const { token, session } = await createCreditSession(
 *   walletAddress,
 *   'bundle-purchase',
 *   {
 *     secret: process.env.SESSION_SECRET!,
 *     durationHours: 24 * 30, // 30 days
 *     initialCredits: 10,
 *     bundleType: 'starter',
 *   }
 * );
 * 
 * // Set as cookie
 * response.cookies.set('x402_credits', token, { httpOnly: true });
 * ```
 */
export async function createCreditSession(
    walletAddress: string,
    purchaseId: string,
    config: CreditSessionConfig
): Promise<{ token: string; session: CreditSessionData }> {
    // Input validation
    if (!validateWalletAddress(walletAddress)) {
        throw new Error('Invalid wallet address format');
    }
    if (config.initialCredits <= 0 || config.initialCredits > MAX_CREDITS) {
        throw new Error(`Credits must be between 1 and ${MAX_CREDITS}`);
    }
    if (!config.durationHours || config.durationHours <= 0 || config.durationHours > 8760) {
        throw new Error('Session duration must be between 1 and 8760 hours (1 year)');
    }

    const sessionId = uuidv4();
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (config.durationHours * 3600);
    const bundleExpiry = config.bundleExpiryHours
        ? now + (config.bundleExpiryHours * 3600)
        : expiresAt;

    const session: CreditSessionData = {
        id: sessionId,
        walletAddress,
        unlockedArticles: [purchaseId],
        siteWideUnlock: false,
        createdAt: now,
        expiresAt,
        credits: config.initialCredits,
        bundleExpiry,
        bundleType: config.bundleType,
    };

    const payload: CreditJWTPayload = {
        sub: walletAddress,
        sid: sessionId,
        articles: session.unlockedArticles,
        siteWide: false,
        credits: config.initialCredits,
        bundleExpiry,
        bundleType: config.bundleType,
        iat: now,
        exp: expiresAt,
    };

    const token = await new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${config.durationHours}h`)
        .sign(getSecretKey(config.secret));

    return { token, session };
}

/** Result of validating a credit session */
export interface CreditValidation {
    valid: boolean;
    session?: CreditSessionData;
    reason?: string;
}

/**
 * Validate a credit session token
 */
export async function validateCreditSession(
    token: string,
    secret: string
): Promise<CreditValidation> {
    if (!token || typeof token !== 'string') {
        return { valid: false, reason: 'Invalid token format' };
    }

    try {
        const { payload } = await jwtVerify(token, getSecretKey(secret));
        const creditPayload = payload as unknown as CreditJWTPayload;

        // Validate required fields
        if (!creditPayload.sub || !creditPayload.sid || !creditPayload.exp) {
            return { valid: false, reason: 'Malformed session payload' };
        }

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (creditPayload.exp < now) {
            return { valid: false, reason: 'Session expired' };
        }

        // Check bundle expiry if set
        if (creditPayload.bundleExpiry && creditPayload.bundleExpiry < now) {
            return { valid: false, reason: 'Bundle expired' };
        }

        // Validate wallet format
        if (!validateWalletAddress(creditPayload.sub)) {
            return { valid: false, reason: 'Invalid session data' };
        }

        const session: CreditSessionData = {
            id: creditPayload.sid,
            walletAddress: creditPayload.sub,
            unlockedArticles: Array.isArray(creditPayload.articles) ? creditPayload.articles : [],
            siteWideUnlock: Boolean(creditPayload.siteWide),
            createdAt: creditPayload.iat ?? 0,
            expiresAt: creditPayload.exp,
            credits: creditPayload.credits ?? 0,
            bundleExpiry: creditPayload.bundleExpiry,
            bundleType: creditPayload.bundleType,
        };

        return { valid: true, session };
    } catch {
        return { valid: false, reason: 'Invalid session' };
    }
}

/** Result of using a credit */
export interface UseCreditResult {
    /** Whether the credit was successfully used */
    success: boolean;
    /** Remaining credits after use */
    remainingCredits: number;
    /** New token with decremented credits (if successful) */
    newToken?: string;
    /** Error message (if failed) */
    error?: string;
}

/**
 * Use one credit from the session
 * Returns a new token with decremented credit count
 * 
 * @example
 * ```typescript
 * import { useCredit } from '@alleyboss/micropay-solana-x402-paywall/agent';
 * 
 * const result = await useCredit(token, process.env.SESSION_SECRET!);
 * 
 * if (result.success) {
 *   console.log(`Credit used. ${result.remainingCredits} remaining`);
 *   // Update cookie with new token
 *   response.cookies.set('x402_credits', result.newToken!);
 * } else {
 *   console.log('No credits:', result.error);
 * }
 * ```
 */
export async function useCredit(
    token: string,
    secret: string,
    creditsToUse: number = 1
): Promise<UseCreditResult> {
    if (creditsToUse <= 0) {
        return { success: false, remainingCredits: 0, error: 'Invalid credit amount' };
    }

    const validation = await validateCreditSession(token, secret);

    if (!validation.valid || !validation.session) {
        return {
            success: false,
            remainingCredits: 0,
            error: validation.reason || 'Invalid session'
        };
    }

    const session = validation.session;

    // Check if enough credits
    if (session.credits < creditsToUse) {
        return {
            success: false,
            remainingCredits: session.credits,
            error: 'Insufficient credits'
        };
    }

    // Decrement credits and create new token
    const newCredits = session.credits - creditsToUse;

    const payload: CreditJWTPayload = {
        sub: session.walletAddress,
        sid: session.id,
        articles: session.unlockedArticles,
        siteWide: session.siteWideUnlock,
        credits: newCredits,
        bundleExpiry: session.bundleExpiry,
        bundleType: session.bundleType,
        iat: session.createdAt,
        exp: session.expiresAt,
    };

    const newToken = await new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(getSecretKey(secret));

    return {
        success: true,
        remainingCredits: newCredits,
        newToken,
    };
}

/**
 * Add credits to an existing session
 * Useful for top-ups or rewards
 */
export async function addCredits(
    token: string,
    secret: string,
    creditsToAdd: number
): Promise<{ success: boolean; newToken?: string; totalCredits?: number; error?: string }> {
    if (creditsToAdd <= 0 || creditsToAdd > MAX_CREDITS) {
        return { success: false, error: 'Invalid credit amount' };
    }

    const validation = await validateCreditSession(token, secret);

    if (!validation.valid || !validation.session) {
        return { success: false, error: validation.reason || 'Invalid session' };
    }

    const session = validation.session;
    const newCredits = Math.min(session.credits + creditsToAdd, MAX_CREDITS);

    const payload: CreditJWTPayload = {
        sub: session.walletAddress,
        sid: session.id,
        articles: session.unlockedArticles,
        siteWide: session.siteWideUnlock,
        credits: newCredits,
        bundleExpiry: session.bundleExpiry,
        bundleType: session.bundleType,
        iat: session.createdAt,
        exp: session.expiresAt,
    };

    const newToken = await new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(getSecretKey(secret));

    return {
        success: true,
        newToken,
        totalCredits: newCredits,
    };
}

/**
 * Get remaining credits from a session token (quick check without full validation)
 */
export async function getRemainingCredits(
    token: string,
    secret: string
): Promise<{ credits: number; valid: boolean; bundleExpiry?: number }> {
    const validation = await validateCreditSession(token, secret);

    if (!validation.valid || !validation.session) {
        return { credits: 0, valid: false };
    }

    return {
        credits: validation.session.credits,
        valid: true,
        bundleExpiry: validation.session.bundleExpiry,
    };
}
