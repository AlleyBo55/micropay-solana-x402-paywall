/**
 * @fileoverview x402Fetch - Drop-in fetch() replacement with automatic 402 handling
 * @module @alleyboss/micropay-solana-x402-paywall/fetch
 * 
 * @example
 * ```typescript
 * import { createX402Fetch } from '@alleyboss/micropay-solana-x402-paywall/fetch';
 * 
 * const x402Fetch = createX402Fetch({
 *   wallet: useWallet(),  // or Keypair for server-side
 *   network: 'mainnet-beta',
 * });
 * 
 * // Use it like fetch() - automatically handles 402 responses
 * const response = await x402Fetch('/api/premium-data');
 * const data = await response.json();
 * ```
 */

import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    VersionedTransaction,
    TransactionMessage,
    ComputeBudgetProgram,
} from '@solana/web3.js';
import type { SignerWalletAdapter } from '@solana/wallet-adapter-base';

import type {
    X402FetchConfig,
    X402RequestInit,
    X402FetchFunction,
    PaymentRequirements,
    WalletLike,
    SolanaNetwork,
} from './types';

import {
    X402PaymentError,
    userRejectedError,
    insufficientBalanceError,
    transactionFailedError,
    networkError,
    invalid402ResponseError,
    timeoutError,
    walletNotConnectedError,
    amountExceedsLimitError,
    recipientNotAllowedError,
    rateLimitExceededError,
} from './errors';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_TIMEOUT = 30_000; // 30 seconds
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RATE_LIMIT_WINDOW = 60_000; // 1 minute
const DEFAULT_RATE_LIMIT_MAX = 10;

const RPC_ENDPOINTS: Record<SolanaNetwork, string> = {
    'mainnet-beta': 'https://api.mainnet-beta.solana.com',
    'devnet': 'https://api.devnet.solana.com',
    'testnet': 'https://api.testnet.solana.com',
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if wallet is a Keypair (server-side) or WalletAdapter (browser)
 */
function isKeypair(wallet: WalletLike): wallet is Keypair {
    return wallet instanceof Keypair;
}

/**
 * Check if wallet is connected (WalletAdapter only)
 */
function isWalletConnected(wallet: WalletLike): boolean {
    if (isKeypair(wallet)) return true;
    return wallet.connected && wallet.publicKey != null;
}

/**
 * Get public key from wallet
 */
function getPublicKey(wallet: WalletLike): PublicKey {
    if (isKeypair(wallet)) return wallet.publicKey;
    if (!wallet.publicKey) throw walletNotConnectedError();
    return wallet.publicKey;
}

/**
 * Parse payment requirements from 402 response headers
 */
function parse402Response(response: Response): PaymentRequirements {
    // Try x402 header format first
    const x402Header = response.headers.get('X-Payment-Requirements');
    if (x402Header) {
        try {
            const parsed = JSON.parse(x402Header);
            return {
                payTo: parsed.payTo ?? parsed.recipient,
                amount: String(parsed.amount),
                asset: parsed.asset ?? 'SOL',
                network: parsed.network ?? 'solana-mainnet',
                description: parsed.description,
                resource: parsed.resource,
                maxAge: parsed.maxAge,
            };
        } catch {
            throw invalid402ResponseError('Invalid X-Payment-Requirements header');
        }
    }

    // Try WWW-Authenticate header (x402 spec)
    const wwwAuth = response.headers.get('WWW-Authenticate');
    if (wwwAuth?.startsWith('X402')) {
        try {
            // Parse: X402 base64(json)
            const base64Part = wwwAuth.slice(5).trim();
            const jsonStr = atob(base64Part);
            const parsed = JSON.parse(jsonStr);
            return {
                payTo: parsed.payTo ?? parsed.recipient,
                amount: String(parsed.amount),
                asset: parsed.asset ?? 'SOL',
                network: parsed.network ?? 'solana-mainnet',
                description: parsed.description,
                resource: parsed.resource,
                maxAge: parsed.maxAge,
            };
        } catch {
            throw invalid402ResponseError('Invalid WWW-Authenticate header');
        }
    }

    throw invalid402ResponseError('No payment requirements found in 402 response');
}

/**
 * Build x402 payment proof header
 */
function buildPaymentHeader(signature: string): string {
    const payload = {
        x402Version: 2,
        scheme: 'exact',
        payload: { signature },
    };
    return `X402 ${btoa(JSON.stringify(payload))}`;
}

// ============================================================================
// Core Implementation
// ============================================================================

/**
 * Create a configured x402Fetch instance
 * 
 * This factory function returns a fetch-like function that automatically
 * handles HTTP 402 responses by executing Solana payments.
 * 
 * @param config - Configuration options
 * @returns A fetch function that handles 402 automatically
 * 
 * @example Browser (with Wallet Adapter)
 * ```typescript
 * import { useWallet } from '@solana/wallet-adapter-react';
 * 
 * function MyComponent() {
 *   const wallet = useWallet();
 *   const x402Fetch = useMemo(() => createX402Fetch({
 *     wallet,
 *     network: 'mainnet-beta',
 *     onPaymentRequired: async (req) => {
 *       return confirm(`Pay ${req.amount} lamports?`);
 *     },
 *   }), [wallet]);
 *   
 *   // Use it like fetch
 *   const loadData = () => x402Fetch('/api/premium').then(r => r.json());
 * }
 * ```
 * 
 * @example Server/Agent (with Keypair)
 * ```typescript
 * import { Keypair } from '@solana/web3.js';
 * import bs58 from 'bs58';
 * 
 * const agentKeypair = Keypair.fromSecretKey(
 *   bs58.decode(process.env.AGENT_PRIVATE_KEY!)
 * );
 * 
 * const x402Fetch = createX402Fetch({
 *   wallet: agentKeypair,
 *   network: 'mainnet-beta',
 * });
 * 
 * // Autonomous payment
 * const response = await x402Fetch('https://api.example.com/data');
 * ```
 */
export function createX402Fetch(config: X402FetchConfig): X402FetchFunction {
    const {
        wallet,
        network = 'mainnet-beta',
        connection: providedConnection,
        facilitatorUrl: _facilitatorUrl, // Reserved for future facilitator integration
        onPaymentRequired,
        onPaymentSuccess,
        onPaymentError,
        priorityFee,
        maxRetries = DEFAULT_MAX_RETRIES,
        timeout = DEFAULT_TIMEOUT,
        // Security options
        maxPaymentPerRequest,
        allowedRecipients,
        // UX options
        commitment = 'confirmed',
        rateLimit,
    } = config;

    // Suppress unused variable warning
    void _facilitatorUrl;

    // Rate limiter state
    const paymentTimestamps: number[] = [];
    const rateLimitMax = rateLimit?.maxPayments ?? DEFAULT_RATE_LIMIT_MAX;
    const rateLimitWindow = rateLimit?.windowMs ?? DEFAULT_RATE_LIMIT_WINDOW;

    /**
     * Check rate limit before payment
     */
    function checkRateLimit(): void {
        const now = Date.now();
        // Remove timestamps outside the window
        while (paymentTimestamps.length > 0 && paymentTimestamps[0] < now - rateLimitWindow) {
            paymentTimestamps.shift();
        }
        if (paymentTimestamps.length >= rateLimitMax) {
            throw rateLimitExceededError(rateLimitMax, rateLimitWindow);
        }
    }

    /**
     * Record a payment for rate limiting
     */
    function recordPayment(): void {
        paymentTimestamps.push(Date.now());
    }

    /**
     * Validate payment requirements against security config
     */
    function validateSecurityRequirements(requirements: PaymentRequirements): void {
        const amountLamports = BigInt(requirements.amount);

        // Check max payment limit
        if (maxPaymentPerRequest !== undefined && amountLamports > maxPaymentPerRequest) {
            throw amountExceedsLimitError(requirements, maxPaymentPerRequest);
        }

        // Check recipient whitelist
        if (allowedRecipients !== undefined && allowedRecipients.length > 0) {
            if (!allowedRecipients.includes(requirements.payTo)) {
                throw recipientNotAllowedError(requirements, requirements.payTo);
            }
        }
    }

    // Create connection if not provided
    const connection = providedConnection ?? new Connection(RPC_ENDPOINTS[network], {
        commitment,
    });

    /**
     * Execute a SOL transfer payment
     */
    async function executePayment(requirements: PaymentRequirements): Promise<string> {
        const payer = getPublicKey(wallet);
        const recipient = new PublicKey(requirements.payTo);
        const amountLamports = BigInt(requirements.amount);

        // Check balance
        const balance = await connection.getBalance(payer);
        if (BigInt(balance) < amountLamports) {
            throw insufficientBalanceError(requirements, BigInt(balance));
        }

        // Build transaction
        const instructions = [];

        // Add priority fee if configured
        if (priorityFee?.enabled) {
            instructions.push(
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: priorityFee.microLamports ?? 5000,
                })
            );
        }

        // Add transfer instruction
        instructions.push(
            SystemProgram.transfer({
                fromPubkey: payer,
                toPubkey: recipient,
                lamports: amountLamports,
            })
        );

        // Get recent blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        // Build versioned transaction
        const messageV0 = new TransactionMessage({
            payerKey: payer,
            recentBlockhash: blockhash,
            instructions,
        }).compileToV0Message();

        const tx = new VersionedTransaction(messageV0);

        // Sign transaction
        if (isKeypair(wallet)) {
            // Server-side: sign with keypair
            tx.sign([wallet]);
        } else {
            // Browser: use wallet adapter (must be SignerWalletAdapter)
            const signerWallet = wallet as SignerWalletAdapter;
            if (!signerWallet.signTransaction) {
                throw new X402PaymentError(
                    'Wallet does not support transaction signing. Use a SignerWalletAdapter.',
                    'WALLET_NOT_CONNECTED'
                );
            }
            const signedTx = await signerWallet.signTransaction(tx);
            // Copy signature to our tx
            if (signedTx.signatures[0]) {
                tx.signatures[0] = signedTx.signatures[0];
            }
        }

        // Send and confirm
        const signature = await connection.sendTransaction(tx, {
            maxRetries,
        });

        // Wait for confirmation
        await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
        }, commitment);

        return signature;
    }

    /**
     * The actual x402Fetch function
     */
    async function x402Fetch(
        input: RequestInfo | URL,
        init?: X402RequestInit
    ): Promise<Response> {
        const { skipPayment, paymentOverride, ...fetchInit } = init ?? {};

        // Make initial request
        let response: Response;
        try {
            response = await fetch(input, fetchInit);
        } catch (error) {
            throw networkError(error instanceof Error ? error : undefined);
        }

        // If not 402, return as-is
        if (response.status !== 402) {
            return response;
        }

        // Skip payment if requested
        if (skipPayment) {
            return response;
        }

        // Check wallet connection
        if (!isWalletConnected(wallet)) {
            throw walletNotConnectedError();
        }

        // Parse payment requirements
        let requirements: PaymentRequirements;
        try {
            requirements = parse402Response(response);
            // Apply overrides if any
            if (paymentOverride) {
                requirements = { ...requirements, ...paymentOverride };
            }
        } catch (error) {
            if (error instanceof X402PaymentError) throw error;
            throw invalid402ResponseError(error instanceof Error ? error.message : undefined);
        }

        // =====================================================================
        // Security Validations (Critical)
        // =====================================================================

        // Validate against security config (max amount, whitelist)
        validateSecurityRequirements(requirements);

        // Check rate limit before proceeding
        checkRateLimit();

        // Call payment required hook
        if (onPaymentRequired) {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
            const shouldProceed = await onPaymentRequired(requirements, url);
            if (!shouldProceed) {
                throw userRejectedError(requirements);
            }
        }

        // Execute payment with timeout
        let signature: string;
        try {
            const paymentPromise = executePayment(requirements);
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(timeoutError(requirements)), timeout);
            });

            signature = await Promise.race([paymentPromise, timeoutPromise]);

            // Record payment for rate limiting
            recordPayment();

            // Call success hook
            if (onPaymentSuccess) {
                await onPaymentSuccess(signature, requirements);
            }
        } catch (error) {
            if (error instanceof X402PaymentError) {
                if (onPaymentError) {
                    await onPaymentError(error, requirements);
                }
                throw error;
            }
            const wrappedError = transactionFailedError(
                requirements,
                error instanceof Error ? error : undefined
            );
            if (onPaymentError) {
                await onPaymentError(wrappedError, requirements);
            }
            throw wrappedError;
        }

        // Retry request with payment proof
        const retryHeaders = new Headers(fetchInit?.headers);
        retryHeaders.set('Authorization', buildPaymentHeader(signature));

        try {
            return await fetch(input, {
                ...fetchInit,
                headers: retryHeaders,
            });
        } catch (error) {
            throw networkError(error instanceof Error ? error : undefined);
        }
    }

    return x402Fetch;
}

// ============================================================================
// Convenience Exports
// ============================================================================

/**
 * Parse payment requirements from a 402 response
 * Useful for custom handling outside of x402Fetch
 */
export { parse402Response as parsePaymentRequirements };

/**
 * Build an x402 payment header from a signature
 * Useful for manual header construction
 */
export { buildPaymentHeader };
