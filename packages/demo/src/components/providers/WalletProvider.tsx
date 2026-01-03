'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
    ConnectionProvider,
    WalletProvider,
    useWallet as useSolanaWallet,
    useConnection,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextState {
    connected: boolean;
    connecting: boolean;
    publicKey: PublicKey | null;
    balance: number | null;
    sendPayment: (recipient: string, lamports: bigint) => Promise<{ signature: string } | { error: string }>;
    refreshBalance: () => Promise<void>;
    disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextState>({
    connected: false,
    connecting: false,
    publicKey: null,
    balance: null,
    sendPayment: async () => ({ error: 'Not connected' }),
    refreshBalance: async () => { },
    disconnect: async () => { },
});

export function useWallet() {
    return useContext(WalletContext);
}

function WalletContextProvider({ children }: { children: React.ReactNode }) {
    const { publicKey, connected, connecting, sendTransaction, disconnect } = useSolanaWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState<number | null>(null);

    const refreshBalance = useCallback(async () => {
        if (publicKey && connection) {
            try {
                const bal = await connection.getBalance(publicKey);
                setBalance(bal / LAMPORTS_PER_SOL);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        } else {
            setBalance(null);
        }
    }, [publicKey, connection]);

    useEffect(() => {
        refreshBalance();
        // Refresh balance periodically when connected
        if (connected) {
            const interval = setInterval(refreshBalance, 15000);
            return () => clearInterval(interval);
        }
    }, [connected, refreshBalance]);

    const sendPayment = useCallback(async (
        recipient: string,
        lamports: bigint
    ): Promise<{ signature: string } | { error: string }> => {
        if (!publicKey || !connected) {
            return { error: 'Wallet not connected' };
        }

        try {
            const recipientPubkey = new PublicKey(recipient);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubkey,
                    lamports: BigInt(lamports),
                })
            );

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            const signature = await sendTransaction(transaction, connection);

            // Wait for confirmation
            await connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight,
            }, 'confirmed');

            // Refresh balance after payment
            await refreshBalance();

            return { signature };
        } catch (error) {
            console.error('Payment failed:', error);
            return {
                error: error instanceof Error ? error.message : 'Payment failed'
            };
        }
    }, [publicKey, connected, connection, sendTransaction, refreshBalance]);

    const value = useMemo(() => ({
        connected,
        connecting,
        publicKey,
        balance,
        sendPayment,
        refreshBalance,
        disconnect,
    }), [connected, connecting, publicKey, balance, sendPayment, refreshBalance, disconnect]);

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

interface SolanaWalletProviderProps {
    children: React.ReactNode;
}

export function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

    // Build RPC URL with Tatum API key if available
    let rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ||
        (network === 'mainnet-beta'
            ? 'https://api.mainnet-beta.solana.com'
            : 'https://api.devnet.solana.com');

    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new TorusWalletAdapter(),
        new LedgerWalletAdapter(),
    ], []);

    return (
        <ConnectionProvider endpoint={rpcUrl}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletContextProvider>
                        {children}
                    </WalletContextProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export { useSolanaWallet };
