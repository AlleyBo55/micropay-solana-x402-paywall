// Configuration helpers for the demo app

export interface SolanaConfig {
    network: 'mainnet-beta' | 'devnet';
    rpcUrl?: string;
}

export function getSolanaConfig(): SolanaConfig {
    const networkVal = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    const network = networkVal === 'mainnet-beta' ? 'mainnet-beta' : 'devnet';

    return {
        network,
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
    };
}

export function getCreatorWallet(): string {
    const wallet = process.env.CREATOR_WALLET_ADDRESS;
    if (!wallet) {
        throw new Error('CREATOR_WALLET_ADDRESS not configured in environment variables');
    }
    return wallet;
}

export function getDefaultPrice(): bigint {
    const price = process.env.DEFAULT_ARTICLE_PRICE_LAMPORTS;
    return BigInt(price || '10000000');
}
