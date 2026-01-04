// Agent Payment Utilities
// Server-side autonomous payment execution for AI agents
// SECURITY: Keypair must only be loaded server-side

import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { buildVersionedTransaction, type PriorityFeeConfig } from './solanaHelpers';
import bs58 from 'bs58';
// server-side only

/** Parameters for executing an agent payment */
export interface ExecuteAgentPaymentParams {
    /** Solana connection */
    connection: Connection;
    /** Agent's keypair (server-side only!) */
    agentKeypair: Keypair;
    /** Recipient wallet address (base58) */
    recipientAddress: string;
    /** Amount to send in lamports */
    amountLamports: bigint;
    /** Optional memo for the transaction */
    memo?: string;
    /** Optional priority fee configuration */
    priorityFee?: PriorityFeeConfig;
    /** Timeout for confirmation in ms (default: 60000) */
    confirmationTimeout?: number;
}

/** Result of an agent payment execution */
export interface AgentPaymentResult {
    /** Whether the payment was successful */
    success: boolean;
    /** Transaction signature (if successful) */
    signature?: string;
    /** Error message (if failed) */
    error?: string;
    /** Block time when confirmed (Unix timestamp) */
    confirmedAt?: number;
    /** Slot number */
    slot?: number;
    /** Amount sent in lamports */
    amountLamports?: bigint;
    /** Amount sent in SOL */
    amountSol?: number;
}

// Wallet address validation regex
const WALLET_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/**
 * Validate wallet address format
 */
function isValidWalletAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    return WALLET_REGEX.test(address);
}

/**
 * Execute an autonomous SOL payment from the agent's wallet
 * 
 * This is the core utility for AI agents to pay for x402-protected resources.
 * The agent keypair must be loaded server-side only (never exposed to client).
 * 
 * @example
 * ```typescript
 * import { executeAgentPayment } from '@alleyboss/micropay-solana-x402-paywall/agent';
 * import { Keypair, Connection } from '@solana/web3.js';
 * import bs58 from 'bs58';
 * 
 * // Load agent keypair from environment (server-side only!)
 * const agentKeypair = Keypair.fromSecretKey(
 *   bs58.decode(process.env.AGENT_KEYPAIR_SECRET!)
 * );
 * 
 * const connection = new Connection('https://api.devnet.solana.com');
 * 
 * const result = await executeAgentPayment({
 *   connection,
 *   agentKeypair,
 *   recipientAddress: 'RecipientWallet...',
 *   amountLamports: 20_000_000n, // 0.02 SOL
 *   priorityFee: { enabled: true, microLamports: 5000 },
 * });
 * 
 * if (result.success) {
 *   console.log('Payment sent:', result.signature);
 * }
 * ```
 */
export async function executeAgentPayment(
    params: ExecuteAgentPaymentParams
): Promise<AgentPaymentResult> {
    const {
        connection,
        agentKeypair,
        recipientAddress,
        amountLamports,
        priorityFee,
        confirmationTimeout = 60000,
    } = params;

    // Validate recipient address
    if (!isValidWalletAddress(recipientAddress)) {
        return {
            success: false,
            error: 'Invalid recipient address format',
        };
    }

    // Validate amount
    if (amountLamports <= 0n) {
        return {
            success: false,
            error: 'Amount must be greater than 0',
        };
    }

    try {
        const recipientPubkey = new PublicKey(recipientAddress);

        // Create transfer instruction
        const transferInstruction = SystemProgram.transfer({
            fromPubkey: agentKeypair.publicKey,
            toPubkey: recipientPubkey,
            lamports: amountLamports,
        });

        // Build versioned transaction with optional priority fee
        const { transaction, lastValidBlockHeight } = await buildVersionedTransaction({
            connection,
            payer: agentKeypair.publicKey,
            instructions: [transferInstruction],
            priorityFee,
        });

        // Sign transaction
        transaction.sign([agentKeypair]);

        // Send transaction
        const signature = await connection.sendTransaction(transaction, {
            maxRetries: 3,
            skipPreflight: false,
        });

        // Wait for confirmation with timeout
        const confirmationPromise = connection.confirmTransaction(
            {
                signature,
                lastValidBlockHeight,
                blockhash: transaction.message.recentBlockhash,
            },
            'confirmed'
        );

        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Confirmation timeout')), confirmationTimeout);
        });

        const confirmation = await Promise.race([confirmationPromise, timeoutPromise]);

        if (confirmation.value.err) {
            return {
                success: false,
                signature,
                error: 'Transaction failed on-chain',
            };
        }

        // Get transaction details for confirmed time
        const txDetails = await connection.getTransaction(signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0,
        });

        return {
            success: true,
            signature,
            confirmedAt: txDetails?.blockTime ?? Math.floor(Date.now() / 1000),
            slot: txDetails?.slot ?? confirmation.context.slot,
            amountLamports,
            amountSol: Number(amountLamports) / LAMPORTS_PER_SOL,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            success: false,
            error: errorMessage,
        };
    }
}

/**
 * Get the agent wallet's SOL balance
 */
export async function getAgentBalance(
    connection: Connection,
    agentKeypair: Keypair
): Promise<{ balance: bigint; balanceSol: number }> {
    const balance = await connection.getBalance(agentKeypair.publicKey);
    return {
        balance: BigInt(balance),
        balanceSol: balance / LAMPORTS_PER_SOL,
    };
}

/**
 * Check if agent has sufficient balance for a payment
 */
export async function hasAgentSufficientBalance(
    connection: Connection,
    agentKeypair: Keypair,
    requiredLamports: bigint,
    feeBufferLamports: bigint = 5_000_000n // 0.005 SOL default buffer for priority fees
): Promise<{ sufficient: boolean; balance: bigint; required: bigint }> {
    const { balance } = await getAgentBalance(connection, agentKeypair);
    // Add buffer for transaction fees + priority fees (mainnet can require 1-5M lamports)
    const totalRequired = requiredLamports + feeBufferLamports;
    return {
        sufficient: balance >= totalRequired,
        balance,
        required: totalRequired,
    };
}

/**
 * Create a Keypair from a base58-encoded secret key string
 * 
 * @example
 * ```typescript
 * const keypair = keypairFromBase58(process.env.AGENT_KEYPAIR_SECRET!);
 * ```
 */
export function keypairFromBase58(base58Secret: string): Keypair {
    try {
        const bytes = bs58.decode(base58Secret);
        if (bytes.length !== 64) {
            throw new Error('Invalid secret key length. Expected 64 bytes.');
        }
        return Keypair.fromSecretKey(bytes);
    } catch (error) {
        // Fallback: assume it's a comma-separated array of numbers
        const parts = base58Secret.split(',').map(n => parseInt(n.trim(), 10));
        if (parts.length === 64) {
            return Keypair.fromSecretKey(Uint8Array.from(parts));
        }
        throw new Error('Invalid secret key format. Expected base58 string or comma-separated bytes.');
    }
}

/**
 * Create a new random Keypair for agent use
 * Returns both the keypair and its base58-encoded secret for storage
 */
export function generateAgentKeypair(): { keypair: Keypair; secretBase58: string; publicKey: string } {
    const keypair = Keypair.generate();
    const secretBytes = Array.from(keypair.secretKey);
    return {
        keypair,
        secretBase58: secretBytes.join(','), // Comma-separated for easy storage
        publicKey: keypair.publicKey.toBase58(),
    };
}
