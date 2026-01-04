
import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    TransactionSignature,
    LAMPORTS_PER_SOL
} from '@solana/web3.js';

/**
 * Minimal wallet adapter interface compatible with @solana/wallet-adapter-base
 */
export interface WalletAdapterInterface {
    publicKey: PublicKey | null;
    signTransaction?: (transaction: Transaction) => Promise<Transaction>;
    sendTransaction: (
        transaction: Transaction,
        connection: Connection,
        options?: any
    ) => Promise<TransactionSignature>;
}

export interface SendPaymentParams {
    /** Solana Connection object */
    connection: Connection;
    /** Connected wallet adapter */
    wallet: WalletAdapterInterface;
    /** Recipient wallet address */
    recipientAddress: string;
    /** Amount in lamports */
    amount: bigint;
    /** Optional memo for the transaction */
    memo?: string;
    /** Commitment level (default: 'confirmed') */
    commitment?: 'processed' | 'confirmed' | 'finalized';
}

export interface PaymentResult {
    signature: string;
    amountSol: number;
}

/**
 * Send a SOL payment from the client-side wallet
 * 
 * Handles transaction creation, recent blockhash, and sending.
 * 
 * @example
 * ```typescript
 * const result = await sendSolanaPayment({
 *   connection,
 *   wallet,
 *   recipientAddress: '...',
 *   amount: 10_000_000n // 0.01 SOL
 * });
 * ```
 */
export async function sendSolanaPayment({
    connection,
    wallet,
    recipientAddress,
    amount,
    // memo, // TODO: Add memo support to transaction
    commitment = 'confirmed'
}: SendPaymentParams): Promise<PaymentResult> {
    if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
    }

    if (amount <= 0n) {
        throw new Error('Amount must be greater than 0');
    }

    // Memo is reserved for future use with SPL Memo program
    // usage: if (memo) { ... }

    try {
        const recipientPubkey = new PublicKey(recipientAddress);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: recipientPubkey,
                lamports: amount,
            })
        );

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash(commitment);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        const signature = await wallet.sendTransaction(transaction, connection);

        await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
        }, commitment);

        return {
            signature,
            amountSol: Number(amount) / LAMPORTS_PER_SOL
        };
    } catch (error: any) {
        console.error('Payment failed:', error);
        throw new Error(error.message || 'Payment failed');
    }
}
