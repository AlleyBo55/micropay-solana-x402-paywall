# SolanaPaywall 🔐

A production-ready, per-article paywall system using the **x402 protocol** and **Solana micropayments**. No subscriptions needed — readers pay only for what they want to read.

![License](https://img.shields.io/badge/license-MIT-green)
![Solana](https://img.shields.io/badge/Solana-Devnet%20%7C%20Mainnet-purple)
![x402](https://img.shields.io/badge/x402-Protocol-blue)

## ✨ Features

- **x402 Protocol Integration** — HTTP 402 "Payment Required" for clean paywall gating
- **SOL Payments** — Native Solana token micropayments (fast & low-cost)
- **Wallet Connect** — Support for Phantom, Solflare, Backpack, and more
- **Solana Pay QR** — Mobile-friendly QR code payments
- **Session Management** — Pay once, access for 24 hours (configurable)
- **Creator Dashboard** — Track earnings and article performance
- **Premium UI** — Glassmorphism design with smooth animations
- **Vercel Ready** — One-click deployment with environment variables

### 🚧 Future Improvements (Roadmap)

- [ ] **Multiple Token Options** — Support for USDC, custom SPL tokens, and Token-2022
- [ ] **Token-Gated Access** — Free access for NFT/token holders
- [ ] **Dynamic Pricing** — Oracle-based USD pricing
- [ ] **Site-Wide Unlock** — Pay once, access all articles
- [ ] **Analytics Export** — CSV/JSON export for earnings data
- [ ] **Webhook Notifications** — Real-time payment alerts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)
- [Tatum.io](https://tatum.io) API key (free tier available)

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
NEXT_PUBLIC_RPC_URL=https://solana-devnet.gateway.tatum.io

# Get your free API key at https://tatum.io
# Free tier: 5 requests/second, perfect for development!
TATUM_API_KEY=your_tatum_api_key_here

# Payment Configuration
CREATOR_WALLET_ADDRESS=your_solana_wallet_address

# Session Configuration (JWT)
SESSION_SECRET=your_32_character_minimum_secret_key
SESSION_DURATION_HOURS=24

# Article Pricing (in lamports)
# 1 SOL = 1,000,000,000 lamports
# Example: 0.01 SOL = 10,000,000 lamports
DEFAULT_ARTICLE_PRICE_LAMPORTS=10000000
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
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

### Key Components

| Component | Description |
|-----------|-------------|
| `PaywallOverlay` | Blurs content and shows payment CTA |
| `PaymentModal` | Wallet connect + payment UI |
| `SessionManager` | JWT-based unlock tracking |
| `VerifyAPI` | On-chain payment verification |

## 🌐 RPC Provider: Tatum.io

This project uses [Tatum.io](https://tatum.io) as the default RPC provider for Solana.

### Why Tatum?

- ✅ **Free Tier Available** — 5 requests/second, perfect for development
- ✅ **High Performance** — Low latency nodes
- ✅ **Easy Setup** — Just add your API key
- ✅ **Both Networks** — Devnet and Mainnet support

### Getting Your Free API Key

1. Visit [tatum.io](https://tatum.io)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local`:

```env
TATUM_API_KEY=your_api_key_here
NEXT_PUBLIC_RPC_URL=https://solana-devnet.gateway.tatum.io
```

## 🧪 Testing on Devnet

1. **Get Devnet SOL**
   - Visit [Sol Faucet](https://faucet.solana.com)
   - Or use CLI: `solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet`

2. **Configure for Devnet**
   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_RPC_URL=https://solana-devnet.gateway.tatum.io/YOUR_API_KEY
   ```

3. **Test Payment Flow**
   - Open an article
   - Connect your wallet
   - Pay with devnet SOL
   - Content should unlock!

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AlleyBo55/micropay-solana-x402-paywall.git)

### Environment Variables for Vercel

Add these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_RPC_URL` | Your Tatum RPC URL |
| `TATUM_API_KEY` | Your Tatum API key |
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

## 🎬 Video Demo Script

For creating a video walkthrough:

### Scene 1: Introduction (30s)
- Show landing page
- Explain: "SolanaPaywall enables per-article micropayments using x402 protocol"
- Highlight: "No subscriptions — readers pay only for what they read"

### Scene 2: User Experience (60s)
- Navigate to a demo article
- Show blurred content with paywall overlay
- Connect wallet (show Phantom popup)
- Click "Pay X SOL"
- Show transaction approval
- Watch content unlock smoothly

### Scene 3: Creator Dashboard (30s)
- Navigate to /dashboard
- Show earnings overview
- Show article performance metrics
- Show recent transactions

### Scene 4: Technical Overview (60s)
- Explain x402 protocol flow
- Show code structure briefly
- Highlight Tatum.io RPC integration
- Show environment configuration

### Scene 5: Call to Action (20s)
- "Deploy your own in minutes"
- Show Vercel deploy button
- Link to GitHub repo

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
- [Tatum.io - Free Solana RPC](https://tatum.io)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Next.js Documentation](https://nextjs.org/docs)

---

Built with ❤️ using x402 Protocol on Solana
