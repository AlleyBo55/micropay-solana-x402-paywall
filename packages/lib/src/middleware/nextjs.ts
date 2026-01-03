// Next.js Middleware for Paywall
// Zero-boilerplate integration for protected routes

import type { SignatureStore } from '../store';
import type { SessionData } from '../types';
import { validateSession } from '../session';

/**
 * Configuration for paywall middleware
 */
export interface PaywallMiddlewareConfig {
    /** Session secret for JWT validation */
    sessionSecret: string;
    /** Protected path patterns (glob-like) */
    protectedPaths: string[];
    /** Cookie name for session token */
    cookieName?: string;
    /** Optional signature store for anti-replay */
    signatureStore?: SignatureStore;
    /** Custom 402 response body */
    custom402Response?: (path: string) => object;
}

/**
 * Result of middleware check
 */
export interface MiddlewareResult {
    /** Whether access is allowed */
    allowed: boolean;
    /** Session data if valid */
    session?: SessionData;
    /** Reason for denial */
    reason?: string;
    /** Should respond with 402 */
    requiresPayment?: boolean;
}

/**
 * Check if path matches any protected pattern
 */
function matchesProtectedPath(path: string, patterns: string[]): boolean {
    for (const pattern of patterns) {
        // Simple glob matching: * matches anything, ** matches path segments
        const regexPattern = pattern
            .replace(/\*\*/g, '{{DOUBLE_STAR}}')
            .replace(/\*/g, '[^/]*')
            .replace(/{{DOUBLE_STAR}}/g, '.*');

        const regex = new RegExp(`^${regexPattern}$`);
        if (regex.test(path)) {
            return true;
        }
    }
    return false;
}

/**
 * Check paywall access for a request
 * Framework-agnostic core logic
 */
export async function checkPaywallAccess(
    path: string,
    sessionToken: string | undefined,
    config: PaywallMiddlewareConfig
): Promise<MiddlewareResult> {
    // Check if path is protected
    if (!matchesProtectedPath(path, config.protectedPaths)) {
        return { allowed: true };
    }

    // No session token
    if (!sessionToken) {
        return {
            allowed: false,
            reason: 'No session token',
            requiresPayment: true,
        };
    }

    // Validate session
    const validation = await validateSession(sessionToken, config.sessionSecret);

    if (!validation.valid || !validation.session) {
        return {
            allowed: false,
            reason: validation.reason || 'Invalid session',
            requiresPayment: true,
        };
    }

    return {
        allowed: true,
        session: validation.session,
    };
}

/**
 * Create Next.js middleware handler
 * 
 * @example
 * ```typescript
 * // middleware.ts
 * import { createPaywallMiddleware } from '@alleyboss/micropay-solana-x402-paywall/middleware';
 * 
 * export const middleware = createPaywallMiddleware({
 *   sessionSecret: process.env.SESSION_SECRET!,
 *   protectedPaths: ['/api/premium/*', '/api/content/*'],
 * });
 * 
 * export const config = { matcher: ['/api/premium/:path*', '/api/content/:path*'] };
 * ```
 */
export function createPaywallMiddleware(config: PaywallMiddlewareConfig) {
    const { cookieName = 'x402_session' } = config;

    return async function middleware(request: Request): Promise<Response | null> {
        const url = new URL(request.url);
        const path = url.pathname;

        // Get session from cookie header
        const cookieHeader = request.headers.get('cookie') || '';
        const cookies = Object.fromEntries(
            cookieHeader.split(';').map(c => {
                const [key, ...vals] = c.trim().split('=');
                return [key, vals.join('=')];
            })
        );
        const sessionToken = cookies[cookieName];

        const result = await checkPaywallAccess(path, sessionToken, config);

        if (!result.allowed && result.requiresPayment) {
            // Return 402 Payment Required
            const body = config.custom402Response
                ? config.custom402Response(path)
                : {
                    error: 'Payment Required',
                    message: 'This resource requires payment to access',
                    path,
                };

            return new Response(JSON.stringify(body), {
                status: 402,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Allow request to continue
        return null;
    };
}

/**
 * API route wrapper for Next.js App Router
 * 
 * @example
 * ```typescript
 * // app/api/premium/route.ts
 * import { withPaywall } from '@alleyboss/micropay-solana-x402-paywall/middleware';
 * 
 * async function handler(request: Request, session: SessionData) {
 *   return Response.json({ content: 'Premium content', wallet: session.walletAddress });
 * }
 * 
 * export const GET = withPaywall(handler, {
 *   sessionSecret: process.env.SESSION_SECRET!,
 *   articleId: 'article-123', // Optional: check specific article unlock
 * });
 * ```
 */
export function withPaywall<T>(
    handler: (request: Request, session: SessionData) => Promise<T>,
    options: {
        sessionSecret: string;
        cookieName?: string;
        articleId?: string;
    }
): (request: Request) => Promise<Response | T> {
    const { sessionSecret, cookieName = 'x402_session', articleId } = options;

    return async function protectedHandler(request: Request): Promise<Response | T> {
        // Extract session token from cookie
        const cookieHeader = request.headers.get('cookie') || '';
        const cookies = Object.fromEntries(
            cookieHeader.split(';').map(c => {
                const [key, ...vals] = c.trim().split('=');
                return [key, vals.join('=')];
            })
        );
        const sessionToken = cookies[cookieName];

        if (!sessionToken) {
            return new Response(
                JSON.stringify({ error: 'Payment Required', message: 'No session token' }),
                { status: 402, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validate session
        const validation = await validateSession(sessionToken, sessionSecret);

        if (!validation.valid || !validation.session) {
            return new Response(
                JSON.stringify({ error: 'Payment Required', message: validation.reason }),
                { status: 402, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check article-specific unlock if required
        if (articleId) {
            const { session } = validation;
            const hasAccess = session.siteWideUnlock || session.unlockedArticles.includes(articleId);

            if (!hasAccess) {
                return new Response(
                    JSON.stringify({ error: 'Payment Required', message: 'Article not unlocked' }),
                    { status: 402, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        // Call the actual handler with session
        return handler(request, validation.session);
    };
}
