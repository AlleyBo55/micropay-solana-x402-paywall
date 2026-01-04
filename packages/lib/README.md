# @alleyboss/micropay-solana-x402-paywall

> Production-ready Solana micropayments library wrapper for the official x402 SDK.

[![npm](https://img.shields.io/npm/v/@alleyboss/micropay-solana-x402-paywall)](https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/badge/bundle-38KB-green)](https://bundlephobia.com/package/@alleyboss/micropay-solana-x402-paywall)

## 🚀 What It Does

Turn any content into paid content with **one-time micropayments** on Solana. fully compatible with the official [x402.org](https://x402.org) protocol.

This library enhances the official SDK with features like **AI Agent Payments**, **Hybrid Sessions**, and **Express.js Middleware**.

```bash
npm install @alleyboss/micropay-solana-x402-paywall @x402/core @x402/svm @solana/web3.js
```

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 💰 **SOL & USDC** | Native SOL and SPL tokens (USDC, USDT) | ✅ Verified by `@x402/svm` |
| 🔐 **x402 Protocol** | Full HTTP 402 compliance | ✅ Powered by `@x402/core` |
| 🔑 **JWT Sessions** | "Pay once, unlock for 24h" logic | ✅ Built-in (Hybrid Support) |
| 🛡️ **Replay Protection** | Prevent double-spend / replay attacks | ✅ Managed by x402 Facilitator |
| 🔌 **Express Integration** | Middleware for Express/Node.js | ✅ Built-in |
| 💵 **Price Conversion** | USD↔SOL with multi-provider fallback | ✅ Built-in |
| 🤖 **AI Agents** | Autonomous payment execution for agents | ✅ Built-in |
| ⚡ **Priority Fees** | Compute unit price optimization | ✅ Supported (Agent Module) |
| 📦 **Versioned Tx** | v0 Transaction support | ✅ Native (x402 SDK) |
| 🌳 **Tree-Shakeable** | Modular exports | ✅ Built-in |

## 📦 Quick Example (Express.js)

```typescript
import express from 'express';
import { x402ResourceServer } from '@x402/core/server';
import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';

const app = express();
// The x402ResourceServer handles protocol logic and facilitator communication
const server = new x402ResourceServer({
    facilitatorUrl: process.env.X402_FACILITATOR_URL,
    serviceId: process.env.X402_SERVICE_ID,
});

app.get('/premium', x402Middleware(server, {
    accepts: {
        scheme: 'exact',
        amount: '1000000', // 0.001 SOL
        network: 'solana-mainnet'
    },
    description: 'Premium Article'
}), (req, res) => {
    // Session token or payment proof is available
    res.send('Thank you for your payment!');
});
```

## 📦 Next.js (App Router)

```typescript
// app/api/premium/route.ts
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

const withMicropay = createX402Middleware({
    walletAddress: 'YOUR_WALLET_ADDRESS',
    network: 'devnet',
    // Optional: Custom Facilitator (e.g. for Mainnet Pro)
    // facilitatorUrl: 'https://facilitator.pro-provider.com/v1/MY_KEY'
});

const handler = (req) => {
    return Response.json({ content: "Premium Data" });
};

// Protect the route
export const GET = withMicropay(handler, {
    description: "Unlock Premium Content",
    accepts: {
        amount: "1000000", // 0.001 SOL
        scheme: "exact"
    }
});
```

## 🔧 Modules

Import only what you need:

```typescript
// Express Middleware
import { x402Middleware } from '@alleyboss/micropay-solana-x402-paywall/express';

// AI Agent Payments
import { executeAgentPayment } from '@alleyboss/micropay-solana-x402-paywall/agent';

// Pricing Utilities
import { getSolPrice, lamportsToUsd } from '@alleyboss/micropay-solana-x402-paywall/pricing';

// Session Management (Hybrid)
import { createSession, validateSession } from '@alleyboss/micropay-solana-x402-paywall/session';

// Client Helpers
import { createPaymentFlow } from '@alleyboss/micropay-solana-x402-paywall/client';
```

## 🛡️ Self-Sovereign Verification (New in v3.1)

By default, the library uses the `x402.org` hosted facilitator for convenience. However, you can opt for **Self-Sovereign Mode** to verify payments directly against your own Solana RPC node, removing reliance on any external API services.

```typescript
// app/api/articles/[id]/route.ts
const withMicropay = createX402Middleware({
    walletAddress: 'YOUR_WALLET',
    network: 'devnet',
    price: '1000000',
    // ⚡️ Enable Self-Sovereign Mode
    // The library will verify transactions locally using this RPC connection.
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL 
});
```

## 🤖 AI Agent Payments

Enable autonomous AI agents to pay for premium API access.

```typescript
import { executeAgentPayment } from '@alleyboss/micropay-solana-x402-paywall/agent';
import { Keypair, Connection } from '@solana/web3.js';

const agentKeypair = Keypair.fromSecretKey(/* ... */);

const result = await executeAgentPayment({
  connection: new Connection('https://api.mainnet-beta.solana.com'),
  agentKeypair,
  recipientAddress: 'CREATOR_WALLET',
  amountLamports: 2_000_000n, 
  priorityFee: { enabled: true, microLamports: 10000 }, // Priority Fees Supported
});

if (result.success) {
  console.log('Payment confirmed:', result.signature);
}
```

## 📚 Documentation

For full documentation:
- **Library Docs**: [solana-x402-paywall.vercel.app/docs](https://solana-x402-paywall.vercel.app/docs)
- **Protocol Docs**: [x402.org](https://docs.x402.org)

## ☕ Support

If you find this library useful, you can buy me a coffee by sending some SOL to:

**`7fPjNJaEHtepp1ZRr6GsaW1k22U1FupQtwuHUkTb6Xg9`**

Your support helps maintain this project!

## 📄 License

MIT © AlleyBoss
