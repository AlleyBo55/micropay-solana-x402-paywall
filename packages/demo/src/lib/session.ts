// Next.js session integration wrapper
// This wraps the framework-agnostic session core from the library with Next.js cookie handling
import { cookies } from 'next/headers';
import {
    createSession as createSessionCore,
    validateSession as validateSessionCore,
    addArticleToSession as addArticleCore,
    isArticleUnlocked as isArticleUnlockedCore,
    type SessionData,
    type SessionValidation,
} from '@alleyboss/micropay-solana-x402-paywall/session';

const SESSION_COOKIE_NAME = 'x402_session';

function getSessionConfig() {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('SESSION_SECRET must be at least 32 characters');
    }
    return {
        durationHours: parseInt(process.env.SESSION_DURATION_HOURS || '24', 10),
        secret,
    };
}

/**
 * Create session and set cookie
 */
export async function createSession(
    walletAddress: string,
    articleId: string,
    siteWide: boolean = false
): Promise<{ token: string; session: SessionData }> {
    const config = getSessionConfig();
    const result = await createSessionCore(walletAddress, articleId, config, siteWide);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: config.durationHours * 3600,
        path: '/',
    });

    return result;
}

/**
 * Validate session from cookie
 */
export async function validateSession(token?: string): Promise<SessionValidation> {
    const config = getSessionConfig();

    if (!token) {
        const cookieStore = await cookies();
        token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    }

    if (!token) {
        return { valid: false, reason: 'No session cookie' };
    }

    return validateSessionCore(token, config.secret);
}

/**
 * Get session from cookies
 */
export async function getSessionFromCookies(): Promise<SessionValidation> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        return { valid: false, reason: 'No session cookie' };
    }

    return validateSession(token);
}

/**
 * Add article to existing session
 */
export async function addArticleToSession(
    articleId: string
): Promise<{ token: string; session: SessionData } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    const config = getSessionConfig();
    const result = await addArticleCore(token, articleId, config.secret);

    if (result) {
        cookieStore.set(SESSION_COOKIE_NAME, result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: config.durationHours * 3600,
            path: '/',
        });
    }

    return result;
}

/**
 * Check if article is unlocked
 */
export async function isArticleUnlocked(articleId: string): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return false;

    const config = getSessionConfig();
    return isArticleUnlockedCore(token, articleId, config.secret);
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export const SESSION_COOKIE = SESSION_COOKIE_NAME;
