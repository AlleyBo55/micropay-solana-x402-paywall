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
# The Future of Decentralized Finance: A Deep Dive

Decentralized Finance, or DeFi, represents one of the most transformative innovations in the history of finance. By leveraging blockchain technology, DeFi protocols are creating a new financial system that is open, transparent, and accessible to anyone with an internet connection.

## The Promise of Open Finance

Traditional financial systems are often characterized by their exclusivity. Banks, investment firms, and other financial institutions serve as gatekeepers, determining who can access financial services. DeFi changes this paradigm entirely.

With DeFi, anyone can:
- Lend and borrow assets without intermediaries
- Trade tokens on decentralized exchanges
- Earn yield through liquidity provision
- Access sophisticated financial instruments

## Key Innovations Driving DeFi

### Automated Market Makers (AMMs)

AMMs like Uniswap and Raydium have revolutionized token trading. Instead of relying on traditional order books, these protocols use mathematical formulas to determine prices and execute trades instantly.

### Lending Protocols

Platforms like Solend on Solana allow users to deposit collateral and borrow against it. The interest rates are determined algorithmically based on supply and demand.

### Yield Aggregators

Yield aggregators automatically move funds between different protocols to maximize returns, making sophisticated DeFi strategies accessible to everyone.

## The Solana Advantage

Solana's high throughput and low transaction costs make it an ideal platform for DeFi applications. With sub-second finality and transaction fees measured in fractions of a cent, Solana enables:

- High-frequency trading strategies
- Micro-transactions and micropayments
- Complex multi-step DeFi operations

## Looking Ahead

The DeFi landscape continues to evolve at a rapid pace. We're seeing the emergence of:

1. **Real-World Asset Tokenization** - Bringing traditional assets on-chain
2. **Cross-chain Bridges** - Enabling liquidity to flow between networks
3. **Decentralized Identity** - Creating trustless reputation systems
4. **AI-Powered DeFi** - Using machine learning for risk assessment and optimization

## Conclusion

DeFi is not just a technological innovation; it's a movement toward a more inclusive and efficient financial system. As the infrastructure matures and user experience improves, we can expect DeFi to play an increasingly important role in global finance.

---

*Thank you for unlocking this article! Your support helps create more quality content about the future of finance.*
    `.trim(),
        author: {
            name: 'Alex Chen',
            avatar: '/avatars/alex.jpg',
        },
        publishedAt: new Date('2024-01-15'),
        readingTime: '8 min read',
        coverImage: '/covers/defi.png',
        tags: ['DeFi', 'Solana', 'Finance'],
        priceInLamports: DEFAULT_PRICE,
        isPremium: true,
    },
    {
        id: 'article-2',
        slug: 'building-solana-dapps-2024',
        title: 'Building Solana dApps in 2024: The Complete Guide',
        excerpt: 'Learn how to build high-performance decentralized applications on Solana with the latest tools and best practices.',
        content: `
# Building Solana dApps in 2024: The Complete Guide

The Solana ecosystem has matured significantly, offering developers a rich set of tools and frameworks for building decentralized applications. This guide covers everything you need to know to get started.

## Why Build on Solana?

Solana offers several compelling advantages for dApp developers:

- **Speed**: 400ms block times and 65,000 TPS
- **Cost**: Transactions cost a fraction of a cent
- **Ecosystem**: Rich tooling and active community
- **Composability**: Easy integration with existing protocols

## Setting Up Your Development Environment

### Prerequisites

\`\`\`bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor Framework
cargo install --git https://github.com/coral-xyz/anchor anchor-cli
\`\`\`

### Project Structure

A typical Solana dApp consists of:

1. **On-chain Program** (Rust/Anchor)
2. **Client SDK** (TypeScript)
3. **Frontend** (React/Next.js)

## Building Your First Program

Here's a simple example using Anchor:

\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("Your_Program_ID");

#[program]
pub mod hello_world {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, Solana!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
\`\`\`

## Frontend Integration

Modern Solana frontends use the wallet adapter for seamless wallet connections:

\`\`\`typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';

function MyComponent() {
  const { publicKey, sendTransaction } = useWallet();
  
  const handleClick = async () => {
    const connection = new Connection('https://api.devnet.solana.com');
    const transaction = new Transaction();
    // Add instructions...
    await sendTransaction(transaction, connection);
  };
  
  return <button onClick={handleClick}>Send Transaction</button>;
}
\`\`\`

## Testing and Deployment

### Local Testing

\`\`\`bash
# Start local validator
solana-test-validator

# Deploy to localnet
anchor deploy
\`\`\`

### Devnet Deployment

\`\`\`bash
# Set CLI to devnet
solana config set --url devnet

# Airdrop SOL for deployment
solana airdrop 2

# Deploy
anchor deploy
\`\`\`

## Best Practices

1. **Security First**: Always audit your programs
2. **Optimize Compute**: Minimize compute units usage
3. **Error Handling**: Use descriptive error codes
4. **Testing**: Comprehensive unit and integration tests

## Conclusion

Building on Solana in 2024 is more accessible than ever. With robust tooling, comprehensive documentation, and an active community, developers can create high-performance dApps that deliver exceptional user experiences.

---

*Thank you for supporting quality developer content!*
    `.trim(),
        author: {
            name: 'Sarah Martinez',
            avatar: '/avatars/sarah.jpg',
        },
        publishedAt: new Date('2024-02-20'),
        readingTime: '12 min read',
        coverImage: '/covers/solana-dev.png',
        tags: ['Solana', 'Development', 'Tutorial'],
        priceInLamports: BigInt(15_000_000), // 0.015 SOL
        isPremium: true,
    },
    {
        id: 'article-3',
        slug: 'micropayments-revolution',
        title: 'The Micropayments Revolution: How x402 Changes Everything',
        excerpt: 'Discover how the x402 protocol enables instant micropayments on the web, unlocking new business models for content creators.',
        content: `
# The Micropayments Revolution: How x402 Changes Everything

For decades, the internet has struggled with monetization. Advertising became dominant, but it comes with privacy concerns and misaligned incentives. Subscriptions work for some, but create "subscription fatigue." Micropayments always seemed like the answer, but never quite worked—until now.

## The x402 Protocol

x402 brings micropayments to HTTP, the protocol that powers the web. Named after the HTTP 402 "Payment Required" status code, x402 enables:

- **Native HTTP Integration**: Works with any web server
- **Instant Payments**: Sub-second transaction finality on Solana
- **Low Fees**: Fractions of a cent per transaction
- **No Accounts Required**: Pay with your crypto wallet

## How It Works

1. Client requests a paid resource
2. Server responds with 402 and payment details
3. Client signs a payment transaction
4. Server verifies on-chain and grants access

\`\`\`
Client                    Server
   |                         |
   |  GET /article/premium   |
   |------------------------>|
   |                         |
   |  402 Payment Required   |
   |  X-Payment-Required: {  |
   |    price: 0.01 SOL      |
   |    payTo: creator       |
   |  }                      |
   |<------------------------|
   |                         |
   |  GET /article/premium   |
   |  X-Payment: {signature} |
   |------------------------>|
   |                         |
   |  200 OK (content)       |
   |<------------------------|
\`\`\`

## Why Solana?

Solana is uniquely suited for micropayments:

### Speed
With 400ms block times, payments confirm almost instantly. Users don't wait—they pay and immediately access content.

### Cost
Transaction fees are typically 0.000005 SOL (~$0.001). Even for $0.01 micropayments, fees are negligible.

### Scalability
65,000+ TPS means the network can handle massive adoption without congestion.

## New Business Models

x402 enables business models that were previously impractical:

### Pay-Per-Article
Instead of subscriptions, readers pay only for what they read. A $0.10 article gives creators more per-reader than ad revenue while being cheaper than a subscription for occasional readers.

### API Monetization
Developers can monetize APIs with automatic payment flows. AI agents can pay for data and services programmatically.

### Micro-Tipping
Send $0.01 tips for quality comments, helpful answers, or great content. Small amounts add up.

### Gated Communities
Access exclusive content or communities with one-time payments. No recurring charges for inactive users.

## The Privacy Advantage

Unlike ads and subscriptions:
- No tracking required
- No personal data collected
- No account creation needed
- Pseudonymous payments via wallet

## Building with x402

Implementing x402 is surprisingly simple:

\`\`\`typescript
// Server-side middleware
app.use(paymentMiddleware({
  'GET /premium/*': {
    price: { amount: '10000000', asset: 'native' },
    payTo: 'creator-wallet-address'
  }
}));
\`\`\`

## The Future

As x402 adoption grows, we'll see:
- Browser-native wallet integration
- Automatic micropayments based on user preferences
- AI agents with budgets for accessing paid resources
- A more sustainable creator economy

## Conclusion

The micropayments revolution is finally here. With x402 and Solana, we have the technology to transform how content is monetized on the web—creating a more direct, fair, and sustainable ecosystem for creators and consumers alike.

---

*You just used x402 to unlock this article! Thanks for being part of the future of web payments.*
    `.trim(),
        author: {
            name: 'Jamie Wilson',
            avatar: '/avatars/jamie.jpg',
        },
        publishedAt: new Date('2024-03-10'),
        readingTime: '10 min read',
        coverImage: '/covers/micropayments.png',
        tags: ['x402', 'Micropayments', 'Web3'],
        priceInLamports: BigInt(8_000_000), // 0.008 SOL
        isPremium: true,
    },
];

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string): Article | undefined {
    return DEMO_ARTICLES.find((article) => article.slug === slug);
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): Article | undefined {
    return DEMO_ARTICLES.find((article) => article.id === id);
}

/**
 * Get all articles
 */
export function getAllArticles(): Article[] {
    return DEMO_ARTICLES;
}

/**
 * Get free preview of article content (first paragraph)
 */
export function getArticlePreview(content: string): string {
    const lines = content.split('\n').filter((line) => line.trim());
    const previewLines = lines.slice(0, 5);
    return previewLines.join('\n');
}
