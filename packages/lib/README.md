# @alleyboss/micropay-solana-x402-paywall

> Production-ready Solana micropayments library implementing the x402 protocol.

[![npm](https://img.shields.io/npm/v/@alleyboss/micropay-solana-x402-paywall)](https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/badge/bundle-38KB-green)](https://bundlephobia.com/package/@alleyboss/micropay-solana-x402-paywall)

## 🚀 What It Does

Turn any content into paid content with **one-time micropayments** on Solana. No subscriptions, no recurring charges—just pay to unlock.

```bash
npm install @alleyboss/micropay-solana-x402-paywall @solana/web3.js
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💰 **SOL & USDC Payments** | Native SOL and SPL tokens (USDC, USDT) |
| 🔐 **x402 Protocol** | HTTP 402 Payment Required standard |
| 🔑 **JWT Sessions** | Secure unlock tracking with anti-replay |
| 🛡️ **Signature Store** | Prevent double-spend at app layer |
| 🔌 **Express & Next.js** | Zero-boilerplate middleware |
| 💵 **Price Conversion** | USD↔SOL with multi-provider fallback |
| 🌳 **Tree-Shakeable** | Import only what you need |
| 🔄 **RPC Fallback** | Automatic failover on RPC errors |
| ⚡ **Priority Fees** | Land transactions faster |
| 📦 **Versioned Tx** | Full v0 transaction support |

## 📦 Quick Example

```typescript
import { verifyPayment, createSession } from '@alleyboss/micropay-solana-x402-paywall';

// Verify on-chain payment
const result = await verifyPayment({
  signature: 'tx...',
  expectedRecipient: 'CreatorWallet',
  expectedAmount: 10_000_000n, // 0.01 SOL
  clientConfig: { network: 'mainnet-beta' },
});

// Create session for unlocked content
if (result.valid) {
  const { token } = await createSession(
    result.from!,
    'article-123',
    { secret: process.env.SESSION_SECRET!, durationHours: 24 }
  );
}
```

## 🔧 Modules

9 tree-shakeable entry points for minimal bundle size:

```typescript
// Core verification
import { verifyPayment, verifySPLPayment } from '@alleyboss/micropay-solana-x402-paywall/solana';

// Session management  
import { createSession, validateSession } from '@alleyboss/micropay-solana-x402-paywall/session';

// x402 protocol
import { buildPaymentRequirement } from '@alleyboss/micropay-solana-x402-paywall/x402';

// Express/Next.js middleware
import { createExpressMiddleware, createPaywallMiddleware } from '@alleyboss/micropay-solana-x402-paywall/middleware';

// Anti-replay signature store
import { createMemoryStore, createRedisStore } from '@alleyboss/micropay-solana-x402-paywall/store';

// Client-side helpers
import { createPaymentFlow, buildSolanaPayUrl } from '@alleyboss/micropay-solana-x402-paywall/client';

// Price conversion (4-provider rotation)
import { getSolPrice, formatPriceDisplay, configurePricing } from '@alleyboss/micropay-solana-x402-paywall/pricing';

// Retry utilities
import { withRetry } from '@alleyboss/micropay-solana-x402-paywall/utils';
```

## 🔥 New in v2.1.0

- **RPC Fallback Support** — Automatic failover on primary RPC failure (configurable, default: off)
- **Priority Fees** — Compute budget instructions for landing transactions faster (configurable, default: off)
- **Versioned Transactions** — Full v0 transaction support with lookup tables
- **TDD Test Suite** — Comprehensive tests with vitest (must pass before npm publish)

```typescript
// RPC Fallback configuration
const config = {
  network: 'mainnet-beta',
  rpcUrl: 'https://primary-rpc.com',
  enableFallback: true, // default: false
  fallbackRpcUrls: [
    'https://fallback1.com',
    'https://fallback2.com',
  ],
};

// Priority fees
import { createPriorityFeeInstructions, estimatePriorityFee } from '@alleyboss/micropay-solana-x402-paywall/solana';

const instructions = createPriorityFeeInstructions({
  enabled: true,
  microLamports: 5000,
  computeUnits: 200_000,
});

// Versioned transactions
import { buildVersionedTransaction } from '@alleyboss/micropay-solana-x402-paywall/solana';

const { transaction } = await buildVersionedTransaction({
  connection,
  payer: wallet.publicKey,
  instructions: [transferIx],
  priorityFee: { enabled: true },
});
```

## 🛠️ RPC Providers

Works with any Solana RPC provider:

```typescript
const config = {
  network: 'mainnet-beta',
  // Tatum.io
  tatumApiKey: 'your-key',
  // Or custom (Helius, QuickNode, etc.)
  rpcUrl: 'https://your-rpc.com',
  // Optional: enable fallback
  enableFallback: true,
  fallbackRpcUrls: ['https://backup.rpc.com'],
};
```

## 📚 Documentation

**Full documentation, API reference, and examples:**

👉 **[solana-x402-paywall.vercel.app/docs](https://solana-x402-paywall.vercel.app/docs)**

## 📄 License

MIT © AlleyBoss

