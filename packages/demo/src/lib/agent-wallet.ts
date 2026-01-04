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

    const trimmed = secretStr.trim();

    // Try Base58 format first (most common from CLI tools)
    if (!trimmed.includes(',') && trimmed.length >= 80) {
        try {
            const decoded = bs58.decode(trimmed);
            if (decoded.length === 64) {
                return Keypair.fromSecretKey(decoded);
            }
        } catch {
            // Not valid Base58, try comma format
        }
    }

    // Try comma-separated format
    const bytes = trimmed.split(',').map(n => parseInt(n.trim(), 10));

    if (bytes.length !== 64 || bytes.some(isNaN)) {
        throw new Error(
            'Invalid AGENT_KEYPAIR_SECRET format. Expected either:\n' +
            '1. Base58 encoded secret key (88 chars), or\n' +
            '2. 64 comma-separated numbers\n\n' +
            `Received: ${trimmed.substring(0, 20)}... (length: ${trimmed.length})`
        );
    }

    return Keypair.fromSecretKey(Uint8Array.from(bytes));
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
