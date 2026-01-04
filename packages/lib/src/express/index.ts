import type { Request, Response, NextFunction } from 'express';
import {
    x402ResourceServer,
    x402HTTPResourceServer,
    type HTTPAdapter,
    type RouteConfig
} from '@x402/core/server';

/**
 * Express Adapter for x402
 */
export class ExpressAdapter implements HTTPAdapter {
    constructor(private req: Request) { }

    getHeader(name: string): string | undefined {
        const val = this.req.headers[name.toLowerCase()];
        if (Array.isArray(val)) return val[0];
        return val;
    }

    getMethod(): string {
        return this.req.method;
    }

    getPath(): string {
        return this.req.path;
    }

    getUrl(): string {
        return this.req.originalUrl || this.req.url;
    }

    getAcceptHeader(): string {
        return this.req.headers['accept'] || '';
    }

    getUserAgent(): string {
        return this.req.headers['user-agent'] || '';
    }

    getQueryParams(): Record<string, string | string[]> {
        return this.req.query as Record<string, string | string[]>;
    }

    getQueryParam(name: string): string | string[] | undefined {
        return this.req.query[name] as string | string[] | undefined;
    }

    async getBody(): Promise<unknown> {
        return this.req.body;
    }
}

/**
 * Create x402 middleware for Express
 * 
 * @example
 * ```typescript
 * import { x402ResourceServer } from '@x402/core/server';
 * import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';
 * 
 * const server = new x402ResourceServer(facilitatorClient);
 * 
 * app.get('/premium', x402Middleware(server, {
 *   accepts: { scheme: 'exact', ... },
 *   description: 'Premium content'
 * }), (req, res) => {
 *   res.send('You paid!');
 * });
 * ```
 */
export function x402Middleware(
    server: x402ResourceServer,
    routeConfig: RouteConfig
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Create a temporary HTTP resource server for this request
            // We use the current path + method to ensure it matches
            // NOTE: req.path contains the actual path (e.g. /users/123), not the route pattern
            const currentRouteKey = `${req.method} ${req.path}`;
            const routes = {
                [currentRouteKey]: routeConfig
            };

            const httpServer = new x402HTTPResourceServer(server, routes);
            await httpServer.initialize();

            const adapter = new ExpressAdapter(req);

            // Process request
            const result = await httpServer.processHTTPRequest({
                adapter,
                method: req.method,
                path: req.path
            });

            if (result.type === 'payment-verified' || result.type === 'no-payment-required') {
                // Attach result to request
                (req as any).x402 = result;
                return next();
            }

            if (result.type === 'payment-error') {
                const instructions = result.response;

                // Set headers
                if (instructions.headers) {
                    Object.entries(instructions.headers).forEach(([key, value]) => {
                        if (value) res.setHeader(key, value);
                    });
                }

                // Send response
                res.status(instructions.status).send(instructions.body);
                return;
            }

        } catch (error) {
            console.error('x402 middleware error:', error);
            res.status(500).json({ error: 'Payment verification error' });
        }
    };
}
