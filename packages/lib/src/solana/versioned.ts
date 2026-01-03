// Versioned Transaction Support
// Utilities for building and working with versioned transactions

import {
    TransactionMessage,
    VersionedTransaction,
    type AddressLookupTableAccount,
    type Connection,
    type PublicKey,
    type TransactionInstruction,
} from '@solana/web3.js';
import { createPriorityFeeInstructions, type PriorityFeeConfig } from './priority-fees';

/** Configuration for building versioned transactions */
export interface VersionedTransactionConfig {
    /** Solana connection */
    connection: Connection;
    /** Fee payer public key */
    payer: PublicKey;
    /** Transaction instructions */
    instructions: TransactionInstruction[];
    /** Address lookup tables for compression (optional) */
    lookupTables?: AddressLookupTableAccount[];
    /** Priority fee configuration (optional, default: disabled) */
    priorityFee?: PriorityFeeConfig;
    /** Recent blockhash (optional, will fetch if not provided) */
    recentBlockhash?: string;
}

/** Result of building a versioned transaction */
export interface VersionedTransactionResult {
    /** The built versioned transaction */
    transaction: VersionedTransaction;
    /** The blockhash used */
    blockhash: string;
    /** Last valid block height for the transaction */
    lastValidBlockHeight: number;
}

/**
 * Build a versioned transaction (v0) with optional priority fees and lookup tables
 * 
 * @example
 * ```typescript
 * const { transaction, blockhash, lastValidBlockHeight } = await buildVersionedTransaction({
 *   connection,
 *   payer: wallet.publicKey,
 *   instructions: [transferIx],
 *   priorityFee: { enabled: true, microLamports: 5000 },
 * });
 * 
 * // Sign and send
 * transaction.sign([wallet]);
 * const sig = await connection.sendTransaction(transaction);
 * ```
 */
export async function buildVersionedTransaction(
    config: VersionedTransactionConfig
): Promise<VersionedTransactionResult> {
    const {
        connection,
        payer,
        instructions,
        lookupTables = [],
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
    }).compileToV0Message(lookupTables);

    // Create versioned transaction
    const transaction = new VersionedTransaction(message);

    return {
        transaction,
        blockhash,
        lastValidBlockHeight,
    };
}

/**
 * Fetch address lookup table accounts
 * 
 * @example
 * ```typescript
 * const tables = await fetchLookupTables(connection, [tableAddress1, tableAddress2]);
 * const { transaction } = await buildVersionedTransaction({
 *   connection,
 *   payer,
 *   instructions,
 *   lookupTables: tables,
 * });
 * ```
 */
export async function fetchLookupTables(
    connection: Connection,
    addresses: PublicKey[]
): Promise<AddressLookupTableAccount[]> {
    const tables: AddressLookupTableAccount[] = [];

    for (const address of addresses) {
        const result = await connection.getAddressLookupTable(address);
        if (result.value) {
            tables.push(result.value);
        }
    }

    return tables;
}

/**
 * Check if a transaction version is supported
 */
export function isVersionedTransaction(
    tx: unknown
): tx is VersionedTransaction {
    return tx instanceof VersionedTransaction;
}
