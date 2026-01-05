# SolanaPaywall 🔐

A production-ready, per-article paywall system using the **x402 protocol** and **Solana micropayments**. No subscriptions needed — readers pay only for what they want to read.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-Devnet%20%7C%20Mainnet-purple)](https://solana.com)
[![x402](https://img.shields.io/badge/x402-Protocol-blue)](https://x402.org)

  <a href="https://solana-x402-paywall.vercel.app/docs">
    <img src="https://img.shields.io/badge/📖_Read_Docs-000000?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Read Docs" height="40"/>
  </a>
  <a href="https://railway.com/deploy/owL10e?referralCode=WF4b52&utm_medium=integration&utm_source=template&utm_campaign=generic">
    <img src="https://img.shields.io/badge/🚀_Deploy_One--Click-000000?style=for-the-badge&logo=railway&logoColor=white" alt="One-Click Deploy" height="40"/>
  </a>
  <a href="https://solana-x402-paywall.vercel.app">
    <img src="https://img.shields.io/badge/⚡_View_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="View Demo" height="40"/>
  </a>
</div>

## 🏆 Why Choose SolanaPaywall?

Building a robust crypto payment system is hard. We made it 10x easier.

- **🚀 Save 100+ Hours** — Don't reinvent the wheel. We handled the edge cases, wallet connections, and verification logic.
- **🛡️ Bank-Grade Security** — Implements the full **x402** standard with server-side validation and anti-replay protection.
- **🧩 Plug & Play** — Drop-in React components and Next.js middleware. Get running in minutes, not weeks.
- **📱 Mobile Optimized** — Built-in Solana Pay QR support for seamless mobile wallet payments.

## ✨ Features

Turn any content into paid content with **one-time micropayments** on Solana. No subscriptions, no recurring charges—just pay to unlock.

| Feature | Description |
|---------|-------------|
| 💰 **SOL & USDC Payments** | Native SOL and SPL tokens (USDC, USDT) |
| 🔐 **x402 Protocol** | Full HTTP 402 compliance with `X-Payment-Required` headers |
| 🔑 **JWT Sessions** | Secure unlock tracking with anti-replay |
| 🛡️ **Signature Store** | Prevent double-spend at app layer |
| 🔌 **Express & Next.js** | Zero-boilerplate middleware |
| 💵 **Price Conversion** | USD↔SOL with multi-provider fallback |
| 🌳 **Tree-Shakeable** | Import only what you need |
| 🔄 **RPC Fallback** | Automatic failover on RPC errors |
| ⚡ **Priority Fees** | Land transactions faster |
| 📦 **Versioned Tx** | Full v0 transaction support |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)
- An RPC URL (Tatum, Helius, QuickNode, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/AlleyBo55/micropay-solana-x402-paywall.git
cd solanapaywall

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

### Environment Variables

```env
# Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# RPC Configuration (See "Flexible RPC Providers" below)
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
# Optional: Enable automatic fallback
ENABLE_RPC_FALLBACK=true
FALLBACK_RPC_URLS=https://api.devnet.solana.com,https://devnet.helius-rpc.com/your-key

# Payment Configuration
CREATOR_WALLET_ADDRESS=your_solana_wallet_address

# Session Configuration (JWT)
SESSION_SECRET=your_32_character_minimum_secret_key
SESSION_DURATION_HOURS=24
```

## 🌐 Flexible RPC Providers

This project is compatible with **any Solana RPC provider**. While the demo references [Tatum.io](https://tatum.io) for its free tier, you can use high-performance nodes from any provider:

- **[Helius](https://helius.dev)** — Specialized Solana RPCs & APIs
- **[QuickNode](https://www.quicknode.com/chains/solana)** — Enterprise-grade infrastructure
- **[Tatum](https://tatum.io)** — Multi-chain developer platform
- **[Alchemy](https://www.alchemy.com/solana)** — Reliable blockchain infrastructure
- **[GenesysGo](https://shdw.genesysgo.com)** — Shadow generic RPCs

### Configuring Your RPC

In `packages/lib/src/config.ts` or via environment variables, you can set your primary and fallback options:

```typescript
const config = {
  network: 'mainnet-beta',
  
  // Primary RPC (e.g. Helius)
  rpcUrl: 'https://mainnet.helius-rpc.com/?api-key=...',
  
  // Enable automatic fallback
  enableFallback: true,
  fallbackRpcUrls: [
    'https://api.mainnet-beta.solana.com', // Public node (rate limited but free)
    'https://solana-mainnet.gateway.tatum.io/...'
  ]
};
```

## 📖 How It Works

### x402 Protocol Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User visits /article/premium-content                     │
│                          │                                   │
│                          ▼                                   │
│  2. Server checks session → Not unlocked                     │
│                          │                                   │
│                          ▼                                   │
│  3. Page renders with blurred content + paywall overlay      │
│                          │                                   │
│                          ▼                                   │
│  4. User clicks "Unlock" → Connects wallet                   │
│                          │                                   │
│                          ▼                                   │
│  5. User signs transaction → SOL sent to creator             │
│                          │                                   │
│                          ▼                                   │
│  6. Frontend sends signature to /api/payment/verify          │
│                          │                                   │
│                          ▼                                   │
│  7. Server verifies on-chain → Creates session cookie        │
│                          │                                   │
│                          ▼                                   │
│  8. Content unlocks! Access valid for 24 hours               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🤖 Agent Chat Demo (NEW!)

Experience **autonomous AI agent payments** in action! The Agent Chat Demo showcases an AI agent that autonomously pays for premium API access using x402 micropayments on Solana.

### Try It Out

```bash
cd packages/demo
npm install
npm run dev
# Visit http://localhost:3001/agent-chat
```

### Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI Agent** | Chat with an agent that can pay for premium features |
| 💳 **Autonomous Payments** | Agent pays SOL micropayments without human interaction |
| 🔄 **Live Streaming** | Watch payment steps in real-time during chat |
| 📊 **Premium Content** | Premium queries trigger actual Devnet payments |

### How It Works

1. User asks a free question → Agent responds normally
2. User asks for "premium crypto analysis" → Agent detects premium request
3. Agent autonomously pays 0.002 SOL via x402 protocol
4. Payment confirmed on-chain → Premium content delivered
5. All steps shown transparently in chat UI

### Setup Agent Wallet

```bash
# Generate a new keypair
node -e "console.log(require('@solana/web3.js').Keypair.generate().secretKey.toString())"

# Add to .env.local
AGENT_KEYPAIR_SECRET=<comma-separated-bytes>

# Fund on Devnet
solana airdrop 2 <agent-address> --url devnet
```

## 🚢 Deploy to Vercel


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AlleyBo55/micropay-solana-x402-paywall.git)

Add these variables in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_RPC_URL` | Your RPC URL (Tatum, Helius, etc.) |
| `CREATOR_WALLET_ADDRESS` | Your Solana wallet |
| `SESSION_SECRET` | Random 32+ char string |
| `SESSION_DURATION_HOURS` | `24` (default) |
| `DEFAULT_ARTICLE_PRICE_LAMPORTS` | `10000000` (0.01 SOL) |

## 📁 Project Structure

```
solanapaywall/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── payment/verify/    # Payment verification endpoint
│   │   │   └── session/validate/  # Session validation endpoint
│   │   ├── article/[slug]/        # Dynamic article pages
│   │   ├── dashboard/             # Creator dashboard
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── article/               # Article content renderer
│   │   ├── paywall/               # Paywall overlay & modal
│   │   └── providers/             # Wallet provider context
│   ├── config/
│   │   └── articles.ts            # Demo article configuration
│   ├── lib/
│   │   ├── session/               # JWT session management
│   │   ├── solana/                # Solana client & verification
│   │   └── x402/                  # x402 protocol helpers
│   └── types/                     # TypeScript type definitions
├── .env.example                   # Environment template
├── vercel.json                    # Vercel deployment config
└── README.md                      # This file
```

## 🔒 Security Architecture

We take security seriously. Here's why you can trust this library:

1. **Zero-Trust Verification**  
   We never trust the client. All payment signatures are verified **on-chain** (or via high-performance RPCs) by your backend before issuing access tokens.

2. **Anti-Replay Protection**  
   We implement a **Signature Store** (Redis/Memory) to ensure every transaction signature can only be used ONCE. This prevents "replay attacks" where a user tries to use the same payment proof multiple times.

3. **Stateless JWT Sessions**  
   Access is granted via signed HTTP-only cookies. No database required for session management. The proof of payment is cryptographically sealed in the token.

4. **No Private Keys Stored**  
   The library is designed to be non-custodial for the payment flow. User wallets sign transactions directly. Your server only needs a public key to verify.

- ✅ No hardcoded private keys
- ✅ Session cookies are HTTP-only and secure
- ✅ On-chain verification for all payments
- ✅ Environment variables for sensitive config
- ✅ CORS headers configured properly

> [!CAUTION]
> **SPL Token Validation Note**: The library currently validates that tokens are sent to a *valid token account*, but does not perform the extra RPC call to verify that token account is owned by `expectedRecipient`. For high-value transactions, we recommend implementing a strict verification step server-side.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Resources

- [x402 Protocol Documentation](https://x402.org)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Built with ❤️ using x402 Protocol on Solana
