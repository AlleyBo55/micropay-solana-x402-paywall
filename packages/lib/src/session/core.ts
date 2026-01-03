// Session management with JWT (framework-agnostic core)
// SECURITY: Uses jose library with HS256, constant-time validation, input sanitization
import { SignJWT, jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import type { SessionData, SessionConfig, SessionValidation, SessionJWTPayload } from '../types';

// Maximum articles per session to prevent unbounded growth
const MAX_ARTICLES_PER_SESSION = 100;

// Minimum secret length for security
const MIN_SECRET_LENGTH = 32;

/**
 * Get the secret key for JWT signing
 * SECURITY: Enforces minimum secret length
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
 * Validate wallet address format (base58, 32-44 chars)
 * SECURITY: Prevents injection via wallet address field
 */
function validateWalletAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    // Solana addresses are base58, typically 32-44 characters
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
}

/**
 * Validate article ID format
 * SECURITY: Prevents injection via articleId field
 */
function validateArticleId(articleId: string): boolean {
    if (!articleId || typeof articleId !== 'string') return false;
    // Allow alphanumeric, hyphens, underscores, max 128 chars
    if (articleId.length > 128) return false;
    const safeIdRegex = /^[a-zA-Z0-9_-]+$/;
    return safeIdRegex.test(articleId);
}

/**
 * Create a new session after successful payment
 * SECURITY: Validates inputs, enforces limits
 */
export async function createSession(
    walletAddress: string,
    articleId: string,
    config: SessionConfig,
    siteWide: boolean = false
): Promise<{ token: string; session: SessionData }> {
    // Input validation
    if (!validateWalletAddress(walletAddress)) {
        throw new Error('Invalid wallet address format');
    }
    if (!validateArticleId(articleId)) {
        throw new Error('Invalid article ID format');
    }
    if (!config.durationHours || config.durationHours <= 0 || config.durationHours > 720) {
        throw new Error('Session duration must be between 1 and 720 hours');
    }

    const sessionId = uuidv4();
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (config.durationHours * 3600);

    const session: SessionData = {
        id: sessionId,
        walletAddress,
        unlockedArticles: [articleId],
        siteWideUnlock: Boolean(siteWide),
        createdAt: now,
        expiresAt,
    };

    const payload: SessionJWTPayload = {
        sub: walletAddress,
        sid: sessionId,
        articles: session.unlockedArticles,
        siteWide: session.siteWideUnlock,
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

/**
 * Validate an existing session token
 * SECURITY: jose library handles timing-safe comparison internally
 */
export async function validateSession(
    token: string,
    secret: string
): Promise<SessionValidation> {
    // Input validation
    if (!token || typeof token !== 'string') {
        return { valid: false, reason: 'Invalid token format' };
    }

    try {
        const { payload } = await jwtVerify(token, getSecretKey(secret));
        const sessionPayload = payload as unknown as SessionJWTPayload;

        // Validate required fields exist
        if (!sessionPayload.sub || !sessionPayload.sid || !sessionPayload.exp) {
            return { valid: false, reason: 'Malformed session payload' };
        }

        // Check expiration (jose already checks, but double-check)
        const now = Math.floor(Date.now() / 1000);
        if (sessionPayload.exp < now) {
            return { valid: false, reason: 'Session expired' };
        }

        // Validate wallet address format from token
        if (!validateWalletAddress(sessionPayload.sub)) {
            return { valid: false, reason: 'Invalid session data' };
        }

        const session: SessionData = {
            id: sessionPayload.sid,
            walletAddress: sessionPayload.sub,
            unlockedArticles: Array.isArray(sessionPayload.articles) ? sessionPayload.articles : [],
            siteWideUnlock: Boolean(sessionPayload.siteWide),
            createdAt: sessionPayload.iat ?? 0,
            expiresAt: sessionPayload.exp,
        };

        return { valid: true, session };
    } catch (error) {
        // SECURITY: Don't expose internal error details
        return { valid: false, reason: 'Invalid session' };
    }
}

/**
 * Add an article to an existing session
 * SECURITY: Enforces article limit to prevent token bloat
 */
export async function addArticleToSession(
    token: string,
    articleId: string,
    secret: string
): Promise<{ token: string; session: SessionData } | null> {
    // Validate article ID
    if (!validateArticleId(articleId)) {
        return null;
    }

    const validation = await validateSession(token, secret);
    if (!validation.valid || !validation.session) {
        return null;
    }

    const session = validation.session;

    // Already unlocked
    if (session.unlockedArticles.includes(articleId)) {
        return { token, session };
    }

    // SECURITY: Enforce maximum articles per session
    if (session.unlockedArticles.length >= MAX_ARTICLES_PER_SESSION) {
        return null;
    }

    const updatedArticles = [...session.unlockedArticles, articleId];

    const payload: SessionJWTPayload = {
        sub: session.walletAddress,
        sid: session.id,
        articles: updatedArticles,
        siteWide: session.siteWideUnlock,
        iat: session.createdAt,
        exp: session.expiresAt,
    };

    const newToken = await new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(getSecretKey(secret));

    return {
        token: newToken,
        session: { ...session, unlockedArticles: updatedArticles },
    };
}

/**
 * Check if an article is unlocked for a session
 */
export async function isArticleUnlocked(
    token: string,
    articleId: string,
    secret: string
): Promise<boolean> {
    if (!validateArticleId(articleId)) {
        return false;
    }

    const validation = await validateSession(token, secret);
    if (!validation.valid || !validation.session) {
        return false;
    }

    if (validation.session.siteWideUnlock) {
        return true;
    }

    return validation.session.unlockedArticles.includes(articleId);
}
