// Demo articles configuration
import { Article } from '@/types';

// Default price: 0.01 SOL = 10,000,000 lamports
const DEFAULT_PRICE = BigInt(10_000_000);

export const DEMO_ARTICLES: Article[] = [
    {
        id: 'article-1',
        slug: 'future-of-decentralized-finance',
        title: 'The Future of Decentralized Finance: A Deep Dive',
        excerpt: 'Explore how DeFi is reshaping the financial landscape with innovative protocols and unprecedented opportunities for everyone.',
        content: `
# The Future of Decentralized Finance

Decentralized Finance (DeFi) represents a paradigm shift.

## Key Innovations
1. **AMMs**: Uniswap, Raydium
2. **Lending**: Aave, Solend
3. **Aggregators**: Jupiter

---
*Verified by x402 Sovereign Mode.*
`.trim(),
        author: { name: 'Alex Chen', avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=0D8ABC&color=fff' },
        publishedAt: new Date('2024-01-15'),
        readingTime: '8 min read',
        coverImage: 'https://picsum.photos/seed/article-1/800/600',
        tags: ['DeFi', 'Solana'],
        priceInLamports: DEFAULT_PRICE,
        isPremium: true,
        mode: 'sovereign',
    },
    {
        id: 'article-2',
        slug: 'building-solana-dapps-2024',
        title: 'Building Solana dApps: Platform Facilitated',
        excerpt: 'Learn how to build high-performance dApps. (Demonstrates Platform-Facilitated Payment Mode)',
        content: `
# Building Solana dApps (Platform Mode)

This article uses the **Platform Model**. The platform (x402 Demo) facilitates verification.

## Benefits
- No infrastructure management
- Instant verification
- Trustless settlement

---
*Verified by x402 Platform.*
`.trim(),
        author: { name: 'Sarah Dev', avatar: 'https://ui-avatars.com/api/?name=Sarah+Dev&background=6366f1&color=fff' },
        publishedAt: new Date('2024-02-01'),
        readingTime: '12 min read',
        coverImage: 'https://picsum.photos/seed/article-2/800/600',
        tags: ['Dev', 'Solana'],
        priceInLamports: BigInt(5_000_000),
        isPremium: true,
        mode: 'platform',
    },
    {
        id: 'article-3',
        slug: 'solana-token-extensions',
        title: 'Token Extensions: Hybrid Payment Model',
        excerpt: 'Deep dive into Token-2022 standards. (Demonstrates Hybrid Split Payment Mode)',
        content: `
# Token Extensions (Hybrid Mode)

This uses the **Hybrid Model**. Revenue is split between Creator (90%) and Platform (10%).

## Split Revenue
The x402 protocol allows defining multiple recipients in the \`X-Payment-Required\` header.

---
*Verified by Hybrid Consensus.*
`.trim(),
        author: { name: 'Mike Protocol', avatar: 'https://ui-avatars.com/api/?name=Mike+P&background=10b981&color=fff' },
        publishedAt: new Date('2024-02-10'),
        readingTime: '6 min read',
        coverImage: 'https://picsum.photos/seed/article-3/800/600',
        tags: ['Token-2022', 'Hybrid'],
        priceInLamports: BigInt(2_000_000),
        isPremium: true,
        mode: 'hybrid',
    },
    {
        id: 'article-4',
        slug: 'sovereign-verification',
        title: 'True Sovereignty: Self-Hosted Verification',
        excerpt: 'Demonstrating Sovereign Mode: Direct verification on your own infrastructure.',
        content: `
# True Sovereignty (Sovereign Mode)

**Mode: Sovereign**

In this mode, the server verifies the transaction directly against the Solana RPC. No third-party API is involved. You execute the "Banker" role yourself.

## How it works
1. Client pays
2. Server calls \`getSignatureStatus\` on RPC
3. Server confirms block depth
4. Content unlocked

---
*Verified Locally.*
`.trim(),
        author: { name: 'Satoshi N.', avatar: 'https://ui-avatars.com/api/?name=Satoshi+N&background=10B981&color=fff' },
        publishedAt: new Date('2024-04-01'),
        readingTime: '5 min read',
        coverImage: 'https://picsum.photos/seed/article-4/800/600',
        tags: ['Sovereign', 'Self-Hosted'],
        priceInLamports: BigInt(5_000_000),
        isPremium: true,
        mode: 'sovereign',
    },
    {
        id: 'article-5',
        slug: 'platform-x402-org',
        title: 'Global Scale: x402.org Platform',
        excerpt: 'Using the x402.org official facilitator for enterprise-grade verification.',
        content: `
# Global Scale (Platform Mode: x402.org)

**Mode: Platform (x402.org)**

This article relies on the official \`x402.org\` facilitator.

## Why Platform?
- **Enterprise SLA**: High availability verification
- **Fraud Detection**: Advanced double-spend protection
- **Analytics**: Built-in revenue dashboards

---
*Verified by x402.org*
`.trim(),
        author: { name: 'x402 Fdn', avatar: 'https://ui-avatars.com/api/?name=x402&background=000&color=fff' },
        publishedAt: new Date('2024-04-05'),
        readingTime: '4 min read',
        coverImage: 'https://picsum.photos/seed/article-5/800/600',
        tags: ['Platform', 'x402.org'],
        priceInLamports: BigInt(8_000_000),
        isPremium: true,
        mode: 'platform',
    },
    {
        id: 'article-6',
        slug: 'hybrid-revenue-share',
        title: 'Creator Economy: Hybrid Revenue Share',
        excerpt: 'A seamless hybrid model where platform and creator share success.',
        content: `
# Hybrid Revenue Share

**Mode: Hybrid**

Demonstrating advanced programmable payments.

## The Split
- **Creator**: 95%
- **Protocol**: 5%

This happens atomically in a single Solana transaction.

---
*Verified via Hybrid Logic.*
`.trim(),
        author: { name: 'Creator DAO', avatar: 'https://ui-avatars.com/api/?name=DAO&background=f59e0b&color=fff' },
        publishedAt: new Date('2024-04-10'),
        readingTime: '7 min read',
        coverImage: 'https://picsum.photos/seed/article-6/800/600',
        tags: ['Hybrid', 'RevShare'],
        priceInLamports: BigInt(3_000_000),
        isPremium: true,
        mode: 'hybrid',
    },
    {
        id: 'article-7',
        slug: 'ai-autonomous-payment',
        title: 'Autonomous Agents: Powered by PayAI',
        excerpt: 'The future of Agent-to-Agent economy, verified by the specialized PayAI network.',
        content: `
# Autonomous Agents (PayAI Mode)

**Mode: PayAI**

This resource is optimized for AI Agent consumption.

## PayAI Network
A specialized facilitator optimized for high-frequency, low-latency machine payments.

- **Optimized for Agents**: JSON-only responses available
- **Micro-fees**: <$0.0001 overhead
- **Machine Auth**: Token-based access

---
*Verified by PayAI.*
`.trim(),
        author: { name: 'PayAI Bot', avatar: 'https://ui-avatars.com/api/?name=PayAI&background=ef4444&color=fff' },
        publishedAt: new Date('2024-04-15'),
        readingTime: '3 min read',
        coverImage: 'https://picsum.photos/seed/article-7/800/600',
        tags: ['PayAI', 'Agents'],
        priceInLamports: BigInt(1_000_000),
        isPremium: true,
        mode: 'payai',
    },
];

export function getArticleBySlug(slug: string) { return DEMO_ARTICLES.find(a => a.slug === slug); }
export function getArticleById(id: string) { return DEMO_ARTICLES.find(a => a.id === id); }
export function getAllArticles() { return DEMO_ARTICLES; }
export function getArticlePreview(content: string) { return content.substring(0, 150) + '...'; }
