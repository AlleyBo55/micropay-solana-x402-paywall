# SolanaPaywall 🔐

A production-ready, per-article paywall system using the **x402 protocol** and **Solana micropayments**. No subscriptions needed — readers pay only for what they want to read.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-Devnet%20%7C%20Mainnet-purple)](https://solana.com)
[![x402](https://img.shields.io/badge/x402-Protocol-blue)](https://x402.org)

<div align="center">
  <a href="https://solana-x402-paywall.vercel.app/docs">
    <img src="https://img.shields.io/badge/📖_Read_Docs-000000?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Read Docs" height="40"/>
  </a>
  <a href="https://solana-x402-paywall.vercel.app">
    <img src="https://img.shields.io/badge/⚡_View_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="View Demo" height="40"/>
  </a>
</div>

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

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AlleyBo55/micropay-solana-x402-paywall.git)

Add these variables in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_RPC_URL` | Your RPC URL (Tatum, Helius, etc.) |
| `CREATOR_WALLET_ADDRESS` | Your Solana wallet |
| `SESSION_SECRET` | Random 32+ char string |

## 🔒 Security Best Practices

- ✅ No hardcoded private keys
- ✅ Session cookies are HTTP-only and secure
- ✅ On-chain verification for all payments
- ✅ Environment variables for sensitive config
- ✅ CORS headers configured properly

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
