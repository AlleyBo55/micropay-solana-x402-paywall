// Solana Helper Utilities for Agent Module
// Self-contained helpers to avoid dependency on deleted/replaced modules

import {
    Connection,
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
    ComputeBudgetProgram,
    type TransactionInstruction,
} from '@solana/web3.js';

/** Configuration for priority fees */
export interface PriorityFeeConfig {
    /** Enable priority fees (default: false) */
    enabled?: boolean;
    /** Price per compute unit in micro-lamports (default: auto-estimate) */
    microLamports?: number;
    /** Maximum compute units for transaction (default: 200_000) */
    computeUnits?: number;
}

/** Default priority fee settings */
const DEFAULT_COMPUTE_UNITS = 200_000;
const DEFAULT_MICRO_LAMPORTS = 1_000; // 0.001 lamports per CU

/**
 * Create compute budget instructions for priority fees
 */
export function createPriorityFeeInstructions(
    config: PriorityFeeConfig = {}
): TransactionInstruction[] {
    const { enabled = false, microLamports, computeUnits } = config;

    if (!enabled) {
        return [];
    }

    const instructions: TransactionInstruction[] = [];

    // Set compute unit limit
    const units = computeUnits ?? DEFAULT_COMPUTE_UNITS;
    instructions.push(ComputeBudgetProgram.setComputeUnitLimit({ units }));

    // Set compute unit price
    const price = microLamports ?? DEFAULT_MICRO_LAMPORTS;
    instructions.push(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: price }));

    return instructions;
}

/** Configuration for building versioned transactions */
export interface VersionedTransactionConfig {
    connection: Connection;
    payer: PublicKey;
    instructions: TransactionInstruction[];
    priorityFee?: PriorityFeeConfig;
    recentBlockhash?: string;
}

/** Result of building a versioned transaction */
export interface VersionedTransactionResult {
    transaction: VersionedTransaction;
    blockhash: string;
    lastValidBlockHeight: number;
}

/**
 * Build a versioned transaction (v0) with optional priority fees
 */
export async function buildVersionedTransaction(
    config: VersionedTransactionConfig
): Promise<VersionedTransactionResult> {
    const {
        connection,
        payer,
        instructions,
        priorityFee,
        recentBlockhash,
    } = config;

    // Prepend priority fee instructions if configured
    const priorityIxs = createPriorityFeeInstructions(priorityFee);
    const allInstructions = [...priorityIxs, ...instructions];

    // Get recent blockhash if not provided
    let blockhash: string;
    let lastValidBlockHeight: number;

    if (recentBlockhash) {
        blockhash = recentBlockhash;
        // Estimate last valid block height (typically ~150 blocks)
        const slot = await connection.getSlot();
        lastValidBlockHeight = slot + 150;
    } else {
        const latestBlockhash = await connection.getLatestBlockhash('confirmed');
        blockhash = latestBlockhash.blockhash;
        lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
    }

    // Build message
    const message = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash,
        instructions: allInstructions,
    }).compileToV0Message([]);

    // Create versioned transaction
    const transaction = new VersionedTransaction(message);

    return {
        transaction,
        blockhash,
        lastValidBlockHeight,
    };
}
