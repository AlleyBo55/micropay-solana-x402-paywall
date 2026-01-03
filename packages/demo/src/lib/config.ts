// Configuration helpers for the demo app
import {
    buildPaymentRequirement,
    type SolanaClientConfig,
    type SolanaNetwork,
} from '@alleyboss/micropay-solana-x402-paywall';

export function getSolanaConfig(): SolanaClientConfig {
    return {
        network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork) || 'devnet',
        rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
        tatumApiKey: process.env.TATUM_API_KEY,
        // Optional: Enable RPC fallback for production reliability
        enableFallback: process.env.ENABLE_RPC_FALLBACK === 'true',
        fallbackRpcUrls: process.env.FALLBACK_RPC_URLS?.split(',').filter(Boolean),
    };
}

export function getCreatorWallet(): string {
    const wallet = process.env.CREATOR_WALLET_ADDRESS;
    if (!wallet) {
        throw new Error('CREATOR_WALLET_ADDRESS not configured');
    }
    return wallet;
}

export function getDefaultPrice(): bigint {
    const price = process.env.DEFAULT_ARTICLE_PRICE_LAMPORTS;
    return BigInt(price || '10000000');
}

export function buildArticlePaymentRequirement(params: {
    articleId: string;
    articleTitle: string;
    priceInLamports?: bigint;
}) {
    const config = getSolanaConfig();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

    return buildPaymentRequirement({
        articleId: params.articleId,
        articleTitle: params.articleTitle,
        priceInLamports: params.priceInLamports ?? getDefaultPrice(),
        creatorWallet: getCreatorWallet(),
        resourceUrl: `${siteUrl}/article/${params.articleId}`,
        network: config.network,
    });
}

export { buildPaymentRequirement };
