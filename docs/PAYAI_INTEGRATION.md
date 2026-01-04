# PayAI Format Integration Guide

## Overview

The `@alleyboss/micropay-solana-x402-paywall` library provides native support for the **PayAI payment format**, enabling seamless multi-chain payment integration. PayAI is a standardized payment protocol that works across Solana (SVM), Ethereum, Base, and other blockchain networks.

## What is PayAI?

PayAI is a universal payment format that extends the x402 protocol to support multiple blockchain ecosystems. It provides a consistent interface for payment requests and responses across different chains, making it ideal for:

- Multi-chain applications
- Cross-chain payment gateways
- AI agents that operate across multiple networks
- Unified payment APIs

## Features

- ✅ **Automatic Format Detection** - No code changes needed
- ✅ **Transparent Transformation** - PayAI → x402 conversion happens automatically
- ✅ **Multi-Chain Ready** - Supports Solana, Ethereum, Base, and more
- ✅ **Type-Safe** - Full TypeScript support with exported types
- ✅ **Backward Compatible** - Existing x402 format continues to work

## PayAI Format Specification

### Solana (SVM) Format

```typescript
{
  "scheme": "exact-svm",
  "networkId": "solana" | "solana-devnet",
  "paymentDetails": {
    "amount": "10000000",
    "recipient": "YourWalletAddress..."
  },
  "authorization": {
    "message": "base64-encoded-transaction",  // Optional
    "signatures": ["signature1", "signature2"]
  }
}
```

### Ethereum (EVM) Format

```typescript
{
  "scheme": "exact-evm",
  "networkId": "base" | "polygon-amoy" | "ethereum",
  "paymentDetails": {
    "amount": "1000000",
    "recipient": "0x..."
  },
  "authorization": {
    "from": "0x...",
    "to": "0x...",
    "value": "0",
    "data": "0x...",
    "validAfter": 1234567890,
    "validBefore": 1234567890,
    "nonce": "...",
    "v": 27,
    "r": "0x...",
    "s": "0x..."
  }
}
```

## Network Identifiers

### Solana Networks

| PayAI Network ID | CAIP-2 Format | Description |
|-----------------|---------------|-------------|
| `solana` | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | Mainnet Beta |
| `solana-devnet` | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` | Devnet |

### EVM Networks

| PayAI Network ID | Description |
|-----------------|-------------|
| `base` | Coinbase Base L2 |
| `ethereum` | Ethereum Mainnet |
| `polygon-amoy` | Polygon Amoy Testnet |

## Implementation Guide

### Server-Side Setup

The middleware automatically detects and processes PayAI format. No special configuration required:

```typescript
// app/api/premium/route.ts
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

export const runtime = 'edge';

const withPayment = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '10000000', // 0.01 SOL
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL // Optional: enables local verification
});

export const GET = withPayment(async (req) => {
  return new Response(JSON.stringify({ 
    content: 'Premium data unlocked!' 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### Client-Side Integration

#### Using Standard Solana Wallet

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

async function payWithPayAI() {
  const { publicKey, signTransaction } = useWallet();
  const connection = new Connection('https://api.devnet.solana.com');
  
  // Create payment transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: publicKey!,
      toPubkey: new PublicKey('CREATOR_WALLET'),
      lamports: 10_000_000
    })
  );
  
  // Sign transaction
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = publicKey!;
  
  const signed = await signTransaction!(transaction);
  
  // Send transaction
  const signature = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(signature);
  
  // Build PayAI payload
  const payaiPayload = {
    scheme: 'exact-svm',
    networkId: 'solana-devnet',
    paymentDetails: {
      amount: '10000000',
      recipient: 'CREATOR_WALLET'
    },
    authorization: {
      signatures: [signature]
    }
  };
  
  // Call protected API
  const response = await fetch('/api/premium', {
    headers: {
      'Authorization': `x402 ${btoa(JSON.stringify(payaiPayload))}`
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('Access granted:', data);
  }
}
```

#### Using AI Agent

```typescript
import { executeAgentPayment } from '@alleyboss/micropay-solana-x402-paywall/agent';
import { Keypair, Connection } from '@solana/web3.js';

async function agentPayWithPayAI() {
  const agentKeypair = Keypair.fromSecretKey(
    Uint8Array.from(process.env.AGENT_SECRET!.split(',').map(Number))
  );
  
  // Execute payment
  const result = await executeAgentPayment({
    connection: new Connection('https://api.devnet.solana.com'),
    agentKeypair,
    recipientAddress: 'CREATOR_WALLET',
    amountLamports: 10_000_000n,
    priorityFee: { enabled: true, microLamports: 5000 }
  });
  
  if (result.success) {
    // Build PayAI payload
    const payaiPayload = {
      scheme: 'exact-svm',
      networkId: 'solana-devnet',
      authorization: {
        signatures: [result.signature]
      }
    };
    
    // Access protected resource
    const response = await fetch('/api/premium', {
      headers: {
        'Authorization': `x402 ${btoa(JSON.stringify(payaiPayload))}`
      }
    });
  }
}
```

## Verification Modes

The library supports two verification modes for PayAI payments:

### Local Verification (Self-Sovereign)

When `rpcUrl` is provided, payments are verified directly on your Solana RPC node:

```typescript
createX402Middleware({
  walletAddress: 'YOUR_WALLET',
  price: '10000000',
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL // Enables local verification
});
```

**Advantages:**
- No external dependencies
- Maximum privacy
- Full control over verification logic

**Requirements:**
- Solana RPC endpoint
- RPC rate limits management

### Remote Verification (PayAI Facilitator)

When no `rpcUrl` is provided, verification is delegated to a PayAI facilitator:

```typescript
createX402Middleware({
  walletAddress: 'YOUR_WALLET',
  price: '10000000',
  network: 'devnet',
  facilitatorUrl: 'https://facilitator.payai.network' // Optional
});
```

**Advantages:**
- Zero configuration
- Advanced features (swaps, multi-chain)
- No RPC management needed

**Considerations:**
- Relies on third-party service
- Payment metadata shared with facilitator

### Automatic Fallback

If remote verification fails and `rpcUrl` is available, the middleware automatically falls back to local verification:

```typescript
createX402Middleware({
  walletAddress: 'YOUR_WALLET',
  price: '10000000',
  network: 'devnet',
  facilitatorUrl: 'https://facilitator.payai.network',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL // Fallback option
});
```

## TypeScript Support

Import PayAI types for type-safe development:

```typescript
import type { 
  PayAIPayload, 
  PayAISvmAuthorization,
  PayAIEvmAuthorization,
  PayAIScheme,
  PayAINetworkId
} from '@alleyboss/micropay-solana-x402-paywall';

const payload: PayAIPayload = {
  scheme: 'exact-svm',
  networkId: 'solana-devnet',
  authorization: {
    signatures: ['...']
  }
};
```

## Migration from x402 Format

Existing x402 implementations continue to work without changes. PayAI format is automatically detected:

```typescript
// Both formats work with the same middleware

// x402 format (existing)
const x402Payload = {
  scheme: 'exact',
  network: 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
  payload: { signature: '...' }
};

// PayAI format (new)
const payaiPayload = {
  scheme: 'exact-svm',
  networkId: 'solana-devnet',
  authorization: { signatures: ['...'] }
};
```

## Best Practices

### 1. Use Environment Variables

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
CREATOR_WALLET_ADDRESS=YourWalletAddress...
```

### 2. Handle Errors Gracefully

```typescript
try {
  const response = await fetch('/api/premium', {
    headers: { 'Authorization': `x402 ${btoa(JSON.stringify(payaiPayload))}` }
  });
  
  if (response.status === 402) {
    // Payment required
    const paymentInfo = await response.json();
    console.log('Payment needed:', paymentInfo);
  } else if (response.ok) {
    // Access granted
    const data = await response.json();
  }
} catch (error) {
  console.error('Payment error:', error);
}
```

### 3. Validate Signatures Client-Side

```typescript
// Confirm transaction before sending PayAI payload
await connection.confirmTransaction(signature, 'confirmed');
```

### 4. Use Priority Fees for Reliability

```typescript
const result = await executeAgentPayment({
  // ...
  priorityFee: { 
    enabled: true, 
    microLamports: 5000 // Adjust based on network congestion
  }
});
```

## Troubleshooting

### Payment Not Verified

**Issue:** 402 response even after payment

**Solutions:**
1. Ensure transaction is confirmed on-chain
2. Check signature is included in authorization
3. Verify network ID matches your configuration
4. Confirm wallet address matches recipient

### Network Mismatch

**Issue:** Wrong network identifier

**Solution:**
```typescript
// Use correct network ID
'solana-devnet' // for devnet
'solana'        // for mainnet
```

### Type Errors

**Issue:** TypeScript errors with PayAI types

**Solution:**
```typescript
import type { PayAIPayload } from '@alleyboss/micropay-solana-x402-paywall';
```

## Examples

### Complete Next.js API Route

```typescript
// app/api/article/[id]/route.ts
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

export const runtime = 'edge';

const withPayment = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '5000000', // 0.005 SOL per article
  network: 'mainnet-beta',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});

export const GET = withPayment(async (req, { params }) => {
  const articleId = params.id;
  
  // Fetch premium content
  const article = await getArticle(articleId);
  
  return new Response(JSON.stringify(article), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### React Component with PayAI

```typescript
'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function PremiumArticle({ articleId }: { articleId: string }) {
  const [content, setContent] = useState<string | null>(null);
  const { publicKey, signTransaction } = useWallet();
  
  async function unlockArticle() {
    // Create and sign payment transaction
    // ... (transaction code)
    
    const payaiPayload = {
      scheme: 'exact-svm',
      networkId: 'solana',
      authorization: { signatures: [signature] }
    };
    
    const response = await fetch(`/api/article/${articleId}`, {
      headers: {
        'Authorization': `x402 ${btoa(JSON.stringify(payaiPayload))}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setContent(data.content);
    }
  }
  
  return (
    <div>
      {content ? (
        <article>{content}</article>
      ) : (
        <button onClick={unlockArticle}>
          Unlock Article (0.005 SOL)
        </button>
      )}
    </div>
  );
}
```

## Additional Resources

- [x402 Protocol Specification](https://x402.org)
- [PayAI Documentation](https://payai.network/docs)
- [Solana Web3.js Guide](https://solana-labs.github.io/solana-web3.js/)
- [GitHub Repository](https://github.com/AlleyBo55/micropay-solana-x402-paywall)

## Support

For issues or questions:
- GitHub Issues: [Report a bug](https://github.com/AlleyBo55/micropay-solana-x402-paywall/issues)
- npm Package: [@alleyboss/micropay-solana-x402-paywall](https://www.npmjs.com/package/@alleyboss/micropay-solana-x402-paywall)
