// Express/Node.js Middleware
// Universal middleware compatible with Express, Fastify, Koa adapters

import type { SignatureStore } from '../store';
import type { SessionData } from '../types';
import { validateSession } from '../session';

/**
 * Generic HTTP request/response interfaces for framework compatibility
 * Works with Express, Fastify, raw Node.js http, etc.
 */
export interface GenericRequest {
    url?: string;
    path?: string;
    headers: Record<string, string | string[] | undefined> | { get(name: string): string | undefined };
    cookies?: Record<string, string>;
}

export interface GenericResponse {
    status?(code: number): GenericResponse;
    statusCode?: number;
    json?(body: object): void;
    send?(body: string): void;
    setHeader?(name: string, value: string): void;
    end?(body?: string): void;
}

export type NextFunction = (error?: Error) => void;

/**
 * Express-style middleware configuration
 */
export interface ExpressPaywallConfig {
    /** Session secret for JWT validation */
    sessionSecret: string;
    /** Protected path patterns (glob-like) */
    protectedPaths: string[];
    /** Cookie name for session token (default: 'x402_session') */
    cookieName?: string;
    /** Optional signature store */
    signatureStore?: SignatureStore;
    /** Header name for session token (alternative to cookie) */
    headerName?: string;
    /** Custom 402 response */
    onPaymentRequired?: (req: GenericRequest, res: GenericResponse) => void;
    /** Called when access is granted */
    onAccessGranted?: (req: GenericRequest, session: SessionData) => void;
}

/**
 * Augmented request with session data
 */
export interface PaywallRequest extends GenericRequest {
    session?: SessionData;
}

/**
 * Simple glob pattern matching (supports * and **)
 */
function matchPath(path: string, patterns: string[]): boolean {
    for (const pattern of patterns) {
        const regex = pattern
            .replace(/\*\*/g, '<<<GLOBSTAR>>>')
            .replace(/\*/g, '[^/]*')
            .replace(/<<<GLOBSTAR>>>/g, '.*');

        if (new RegExp(`^${regex}$`).test(path)) {
            return true;
        }
    }
    return false;
}

/**
 * Check if headers object has a get method (Fetch/Next.js style)
 */
function hasGetMethod(headers: GenericRequest['headers']): headers is { get(name: string): string | undefined } {
    return typeof (headers as { get?: unknown }).get === 'function';
}

/**
 * Get header value from either style of headers object
 */
function getHeader(headers: GenericRequest['headers'], name: string): string | undefined {
    if (hasGetMethod(headers)) {
        return headers.get(name) ?? undefined;
    }
    const value = (headers as Record<string, string | string[] | undefined>)[name];
    return typeof value === 'string' ? value : undefined;
}

/**
 * Extract session token from request
 */
function extractToken(req: GenericRequest, config: ExpressPaywallConfig): string | undefined {
    const { cookieName = 'x402_session', headerName } = config;

    // Try custom header first (for API clients)
    if (headerName) {
        const token = getHeader(req.headers, headerName.toLowerCase());
        if (token) return token;
    }

    // Try Authorization header (Bearer token)
    const authHeader = getHeader(req.headers, 'authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    // Try cookies
    if (req.cookies?.[cookieName]) {
        return req.cookies[cookieName];
    }

    // Parse cookie header manually if cookies not pre-parsed
    const cookieHeader = getHeader(req.headers, 'cookie');
    if (cookieHeader) {
        const match = cookieHeader.split(';')
            .map(c => c.trim())
            .find(c => c.startsWith(`${cookieName}=`));

        if (match) {
            return match.slice(cookieName.length + 1);
        }
    }

    return undefined;
}

/**
 * Create Express-compatible paywall middleware
 * Also works with Connect, Polka, and similar frameworks
 * 
 * @example
 * ```typescript
 * import express from 'express';
 * import { createExpressMiddleware } from '@alleyboss/micropay-solana-x402-paywall/middleware';
 * 
 * const app = express();
 * 
 * app.use('/api/premium', createExpressMiddleware({
 *   sessionSecret: process.env.SESSION_SECRET!,
 *   protectedPaths: ['/**'],
 * }));
 * 
 * app.get('/api/premium/content', (req, res) => {
 *   res.json({ content: 'Premium!', wallet: req.session?.walletAddress });
 * });
 * ```
 */
export function createExpressMiddleware(config: ExpressPaywallConfig) {
    const { sessionSecret, protectedPaths, onPaymentRequired, onAccessGranted } = config;

    return async function paywallMiddleware(
        req: PaywallRequest,
        res: GenericResponse,
        next: NextFunction
    ): Promise<void> {
        const path = req.path || req.url?.split('?')[0] || '/';

        // Check if path needs protection
        if (!matchPath(path, protectedPaths)) {
            next();
            return;
        }

        // Extract token
        const token = extractToken(req, config);

        if (!token) {
            if (onPaymentRequired) {
                onPaymentRequired(req, res);
            } else {
                sendPaymentRequired(res, 'No session token');
            }
            return;
        }

        // Validate session
        const validation = await validateSession(token, sessionSecret);

        if (!validation.valid || !validation.session) {
            if (onPaymentRequired) {
                onPaymentRequired(req, res);
            } else {
                sendPaymentRequired(res, validation.reason || 'Invalid session');
            }
            return;
        }

        // Attach session to request
        req.session = validation.session;

        if (onAccessGranted) {
            onAccessGranted(req, validation.session);
        }

        next();
    };
}

/**
 * Send 402 Payment Required response
 */
function sendPaymentRequired(res: GenericResponse, reason: string): void {
    const body = JSON.stringify({
        error: 'Payment Required',
        message: reason,
    });

    // Check for Express-style response (has both status and json methods)
    const statusFn = res.status;
    const jsonFn = res.json;

    if (statusFn && jsonFn) {
        // Express-style: res.status(402).json(...)
        const chainedRes = statusFn.call(res, 402);
        if (chainedRes?.json) {
            chainedRes.json({ error: 'Payment Required', message: reason });
        }
    } else if (res.statusCode !== undefined && res.setHeader && res.end) {
        // Raw Node.js http
        res.statusCode = 402;
        res.setHeader('Content-Type', 'application/json');
        res.end(body);
    }
}

/**
 * Fastify-compatible plugin factory
 * 
 * @example
 * ```typescript
 * import Fastify from 'fastify';
 * import { createFastifyPlugin } from '@alleyboss/micropay-solana-x402-paywall/middleware';
 * 
 * const fastify = Fastify();
 * fastify.register(createFastifyPlugin({
 *   sessionSecret: process.env.SESSION_SECRET!,
 *   protectedPaths: ['/api/premium/*'],
 * }));
 * ```
 */
export function createFastifyPlugin(config: ExpressPaywallConfig) {
    return async function paywallPlugin(fastify: any) {
        fastify.addHook('preHandler', createExpressMiddleware(config));
    };
}
