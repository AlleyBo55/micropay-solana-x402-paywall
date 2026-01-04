# PayAI Format Integration

The middleware now supports the **PayAI format** for payment requests.

## PayAI Format Structure

```typescript
{
  "scheme": "exact-svm" | "exact-evm",
  "networkId": "solana" | "solana-devnet" | "base" | "polygon-amoy",
  "paymentDetails": { /* mirrored from 402 response */ },
  "authorization": {
    // For Solana (exact-svm):
    "message": "base64-serialized-transaction",
    "signatures": ["signature1", "signature2"]
    
    // For EVM (exact-evm):
    "from": "0x...",
    "to": "0x...",
    "value": "0",
    "data": "0x...",
    "validAfter": 1234567890,
    "validBefore": 1234567890,
    "nonce": "...",
    "v": 27,
    "r": "...",
    "s": "..."
  }
}
```

## Usage Example

### Client-Side

```typescript
const payaiPayload = {
  scheme: 'exact-svm',
  networkId: 'solana-devnet',
  authorization: {
    signatures: [signature]
  }
};

const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `x402 ${btoa(JSON.stringify(payaiPayload))}`
  }
});
```

### Server-Side

```typescript
import { createX402Middleware } from '@alleyboss/micropay-solana-x402-paywall/next';

const withPayment = createX402Middleware({
  walletAddress: process.env.CREATOR_WALLET_ADDRESS!,
  price: '10000000',
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL
});

export default withPayment(async (req) => {
  return new Response('Premium content unlocked!');
});
```

## Network Mapping

| PayAI | CAIP-2 |
|-------|--------|
| `solana` | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` |
| `solana-devnet` | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` |

## Type Definitions

```typescript
import type { PayAIPayload } from '@alleyboss/micropay-solana-x402-paywall';
```
