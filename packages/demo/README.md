# @alleyboss/micropay-solana-x402-paywall Demo

Demo application showcasing the Solana x402 paywall library.

## Features Demonstrated

| Feature | Status | Notes |
|---------|--------|-------|
| x402 Protocol Flow | ✅ Implemented | Complete payment verification flow |
| SOL Payments | ✅ Implemented | Native SOL micropayments |
| Wallet Connect | ✅ Implemented | Phantom, Solflare, Backpack |
| JWT Sessions | ✅ Implemented | 24-hour unlock persistence |
| Paywall Overlay | ✅ Implemented | Blurred content with unlock CTA |
| RPC Fallback | ✅ Configured | Set `ENABLE_RPC_FALLBACK=true` |
| Priority Fees | 📖 Documented | See /docs - server-side integration |
| Versioned Tx | 📖 Documented | See /docs - for custom integrations |
| USDC/SPL Tokens | 📖 Documented | Library supports, demo uses SOL |

## Quick Start

```bash
# Install dependencies
npm install

# Create .env.local from example
cp .env.example .env.local

# Configure your wallet address in .env.local
# CREATOR_WALLET_ADDRESS=your_solana_wallet

# Start dev server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Yes | `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_RPC_URL` | Yes | Primary Solana RPC endpoint |
| `CREATOR_WALLET_ADDRESS` | Yes | Your Solana wallet for payments |
| `SESSION_SECRET` | Yes | 32+ char secret for JWT signing |
| `TATUM_API_KEY` | No | Tatum.io API key for RPC |
| `ENABLE_RPC_FALLBACK` | No | Enable RPC failover (v2.1) |
| `FALLBACK_RPC_URLS` | No | Comma-separated backup RPCs |

## Testing on Devnet

1. Get devnet SOL: [faucet.solana.com](https://faucet.solana.com)
2. Set `NEXT_PUBLIC_SOLANA_NETWORK=devnet`
3. Connect wallet and pay to unlock articles

## Deploy to Vercel

1. Import repo to Vercel
2. Set **Root Directory** to `packages/demo`
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AlleyBo55/micropay-solana-x402-paywall&root-directory=packages/demo)

## License

MIT

