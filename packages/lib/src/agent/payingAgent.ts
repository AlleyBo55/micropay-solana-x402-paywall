/**
 * @fileoverview Shaw-style Agent Helper
 * The sexiest way to create a paying AI agent
 * 
 * @example
 * ```typescript
 * import { createPayingAgent } from '@alleyboss/micropay-solana-x402-paywall/agent';
 * 
 * const agent = createPayingAgent(process.env.SOLANA_PRIVATE_KEY!);
 * const data = await agent.get('https://api.example.com/premium');
 * ```
 */

import { Keypair, Connection } from '@solana/web3.js';
import bs58 from 'bs58';
import { createX402Fetch, type X402FetchConfig } from '../fetch';
import { RPC_ENDPOINTS, type SolanaNetwork } from '../shared/constants';

/**
 * Configuration for creating a paying agent
 */
export interface PayingAgentConfig {
    /** Network: 'mainnet-beta' | 'devnet' | 'testnet' */
    network?: SolanaNetwork;
    /** Custom RPC URL */
    rpcUrl?: string;
    /** Max payment per request in lamports (safety limit) */
    maxPaymentPerRequest?: bigint;
    /** Allowed recipient addresses (whitelist) */
    allowedRecipients?: string[];
    /** Enable priority fees for faster confirmation */
    priorityFee?: boolean;
}

/**
 * Paying agent interface - fetch-like methods with auto-payment
 */
export interface PayingAgent {
    /** GET request with auto-payment */
    get: (url: string, init?: RequestInit) => Promise<Response>;
    /** POST request with auto-payment */
    post: (url: string, body: unknown, init?: RequestInit) => Promise<Response>;
    /** Generic fetch with auto-payment */
    fetch: (url: string, init?: RequestInit) => Promise<Response>;
    /** Get the agent's public key */
    publicKey: string;
    /** Get the agent's balance */
    getBalance: () => Promise<{ lamports: bigint; sol: number }>;
}

/**
 * Create a paying AI agent - the sexiest one-liner for agent developers
 * 
 * @param privateKey - Base58 or comma-separated Uint8Array string
 * @param config - Optional configuration
 * @returns PayingAgent with fetch-like methods
 * 
 * @example
 * ```typescript
 * const agent = createPayingAgent(process.env.SOLANA_PRIVATE_KEY!);
 * 
 * // Simple GET
 * const response = await agent.get('https://api.example.com/premium');
 * 
 * // POST with body
 * const result = await agent.post('https://api.example.com/ai', { prompt: 'Hello' });
 * 
 * // Check balance
 * const { sol } = await agent.getBalance();
 * console.log(`Agent has ${sol} SOL`);
 * ```
 */
export function createPayingAgent(
    privateKey: string,
    config: PayingAgentConfig = {}
): PayingAgent {
    const {
        network = 'mainnet-beta',
        rpcUrl,
        maxPaymentPerRequest,
        allowedRecipients,
        priorityFee = true,
    } = config;

    // Parse keypair from various formats
    let keypair: Keypair;
    if (privateKey.includes(',')) {
        // Comma-separated format: "1,2,3,..."
        const bytes = new Uint8Array(privateKey.split(',').map(n => parseInt(n.trim(), 10)));
        keypair = Keypair.fromSecretKey(bytes);
    } else {
        // Base58 format
        keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    }

    // Create connection
    const endpoint = rpcUrl ?? RPC_ENDPOINTS[network];
    const connection = new Connection(endpoint, 'confirmed');

    // Create x402Fetch with agent config
    const fetchConfig: X402FetchConfig = {
        wallet: keypair,
        network,
        connection,
        maxPaymentPerRequest,
        allowedRecipients,
        priorityFee: priorityFee ? { enabled: true, microLamports: 5000 } : undefined,
    };

    const x402Fetch = createX402Fetch(fetchConfig);

    return {
        get: (url: string, init?: RequestInit) =>
            x402Fetch(url, { ...init, method: 'GET' }),

        post: (url: string, body: unknown, init?: RequestInit) =>
            x402Fetch(url, {
                ...init,
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    ...init?.headers,
                },
            }),

        fetch: (url: string, init?: RequestInit) =>
            x402Fetch(url, init),

        publicKey: keypair.publicKey.toBase58(),

        getBalance: async () => {
            const lamports = await connection.getBalance(keypair.publicKey);
            return {
                lamports: BigInt(lamports),
                sol: lamports / 1_000_000_000,
            };
        },
    };
}
