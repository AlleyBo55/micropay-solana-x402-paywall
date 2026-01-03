// Priority Fee Utilities for Solana Transactions
// Adds compute budget instructions for landing transactions faster

import {
    ComputeBudgetProgram,
    type Connection,
    type PublicKey,
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
 * 
 * @example
 * ```typescript
 * const priorityIxs = createPriorityFeeInstructions({
 *   enabled: true,
 *   microLamports: 5000,
 *   computeUnits: 150_000,
 * });
 * 
 * // Add to transaction
 * transaction.add(...priorityIxs, ...yourInstructions);
 * ```
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

/**
 * Estimate priority fee based on recent network activity
 * Returns micro-lamports per compute unit
 * 
 * @example
 * ```typescript
 * const fee = await estimatePriorityFee(connection, [recipientPubkey]);
 * console.log(`Recommended fee: ${fee} micro-lamports/CU`);
 * ```
 */
export async function estimatePriorityFee(
    connection: Connection,
    accounts: PublicKey[] = []
): Promise<number> {
    try {
        const fees = await connection.getRecentPrioritizationFees({
            lockedWritableAccounts: accounts,
        });

        if (fees.length === 0) {
            return DEFAULT_MICRO_LAMPORTS;
        }

        // Get median of recent fees (more stable than mean)
        const sortedFees = fees
            .map((f) => f.prioritizationFee)
            .filter((f) => f > 0)
            .sort((a, b) => a - b);

        if (sortedFees.length === 0) {
            return DEFAULT_MICRO_LAMPORTS;
        }

        const medianIndex = Math.floor(sortedFees.length / 2);
        return sortedFees[medianIndex];
    } catch {
        // Fallback on RPC errors
        return DEFAULT_MICRO_LAMPORTS;
    }
}

/**
 * Calculate total priority fee cost in lamports
 * 
 * @example
 * ```typescript
 * const cost = calculatePriorityFeeCost(5000, 200_000);
 * console.log(`Priority fee: ${cost} lamports`);
 * ```
 */
export function calculatePriorityFeeCost(
    microLamportsPerCU: number,
    computeUnits: number
): number {
    return Math.ceil((microLamportsPerCU * computeUnits) / 1_000_000);
}
