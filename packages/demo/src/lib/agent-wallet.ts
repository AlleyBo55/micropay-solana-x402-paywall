// Agent wallet utilities for server-side payment execution
// SECURITY: This file MUST only be imported in server-side code (API routes)

import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getSolanaConfig } from './config';
import bs58 from 'bs58';

/**
 * Get the agent keypair from environment variable
 * Supports two formats:
 * 1. Base58 encoded secret key (88 characters)
 * 2. Comma-separated array of 64 numbers
 * 
 * SECURITY: Only call this server-side!
 */
export function getAgentKeypair(): Keypair {
    const secretStr = process.env.AGENT_KEYPAIR_SECRET;

    if (!secretStr) {
        throw new Error('AGENT_KEYPAIR_SECRET not configured');
    }

    // Clean up input string - remove quotes, brackets, and whitespace
    const cleaned = secretStr.trim().replace(/^['"]|['"]$/g, '').replace(/^\[|\]$/g, '');

    // Try Base58 format (no commas, long string)
    if (!cleaned.includes(',') && cleaned.length >= 80) {
        try {
            const decoded = bs58.decode(cleaned);
            if (decoded.length === 64) {
                return Keypair.fromSecretKey(decoded);
            }
        } catch {
            // Not valid Base58, fall through to try comma format
        }
    }

    // Try comma-separated format
    try {
        const bytes = cleaned.split(',').map(n => {
            const val = parseInt(n.trim(), 10);
            if (isNaN(val)) throw new Error('Invalid number');
            return val;
        });

        if (bytes.length !== 64) {
            throw new Error(`Invalid secret key length. Expected 64 bytes, got ${bytes.length}`);
        }

        return Keypair.fromSecretKey(Uint8Array.from(bytes));
    } catch (e) {
        throw new Error(
            'Invalid AGENT_KEYPAIR_SECRET format. Expected either:\n' +
            '1. Base58 encoded secret key (88 chars), or\n' +
            '2. 64 comma-separated numbers (JSON array or raw)\n\n' +
            `Received start: ${secretStr.substring(0, 20)}...`
        );
    }
}

/**
 * Get a Solana connection configured for the current network
 */
export function getConnection(): Connection {
    const config = getSolanaConfig();

    // Build RPC URL
    let rpcUrl = config.rpcUrl;

    // Fallback to public endpoints if not configured
    if (!rpcUrl) {
        rpcUrl = config.network === 'mainnet-beta'
            ? 'https://api.mainnet-beta.solana.com'
            : 'https://api.devnet.solana.com';
    }

    return new Connection(rpcUrl, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
    });
}

/**
 * Get agent wallet balance
 */
export async function getAgentBalance(): Promise<{ lamports: number; sol: number }> {
    const keypair = getAgentKeypair();
    const connection = getConnection();
    const lamports = await connection.getBalance(keypair.publicKey);

    return {
        lamports,
        sol: lamports / LAMPORTS_PER_SOL,
    };
}

/**
 * Get agent wallet public key
 */
export function getAgentPublicKey(): string {
    try {
        const keypair = getAgentKeypair();
        return keypair.publicKey.toBase58();
    } catch (e) {
        return `Error: ${e instanceof Error ? e.message : 'Unknown'}`;
    }
}

/**
 * Validate agent wallet configuration (for debugging)
 */
export async function validateAgentWallet(): Promise<{
    configured: boolean;
    address?: string;
    balance?: number;
    error?: string;
}> {
    try {
        const keypair = getAgentKeypair();
        const connection = getConnection();
        const balance = await connection.getBalance(keypair.publicKey);

        return {
            configured: true,
            address: keypair.publicKey.toBase58(),
            balance: balance / LAMPORTS_PER_SOL,
        };
    } catch (e) {
        return {
            configured: false,
            error: e instanceof Error ? e.message : 'Unknown error',
        };
    }
}
