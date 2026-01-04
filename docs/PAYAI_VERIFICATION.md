# PayAI Verification Modes

## How PayAI Format is Verified

When a PayAI format payment is received, the middleware automatically detects it and transforms it to x402 format, then verifies using one of two modes:

### 1. Local Verification (Self-Sovereign)
**When**: `rpcUrl` is provided in config
**How**: Uses `LocalSvmFacilitator` to verify directly on Solana RPC
**Logs**: 
```
[x402Middleware] Mode: Local
[x402Middleware] Facilitator type: LocalSvmFacilitator
```

### 2. Remote Verification (PayAI/x402 Facilitator)
**When**: No `rpcUrl` provided
**How**: Uses `HTTPFacilitatorClient` to call remote facilitator API
**Logs**:
```
[x402Middleware] Mode: Remote
[x402Middleware] Facilitator type: HTTPFacilitatorClient
```

## Configuration Examples

### Local Verification
```typescript
createX402Middleware({
  walletAddress: 'YOUR_WALLET',
  price: '10000000',
  network: 'devnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL // Enables local verification
});
```

### Remote Verification
```typescript
createX402Middleware({
  walletAddress: 'YOUR_WALLET',
  price: '10000000',
  network: 'devnet',
  facilitatorUrl: 'https://facilitator.payai.network' // Optional, defaults to x402.org
  // No rpcUrl = uses remote facilitator
});
```

## Fallback Behavior

If remote verification fails AND `rpcUrl` is available, the middleware automatically falls back to local verification:

```typescript
if (!isLocalVerification && config.rpcUrl) {
  console.log('[x402Middleware] Attempting local RPC fallback...');
  const localFacilitator = new LocalSvmFacilitator(config.rpcUrl);
  verifyResult = await localFacilitator.verify(payload, verifyPaymentSpec);
}
```

## Checking Logs

To see which mode is being used, check your server logs for:
- `[x402Middleware] Mode: Local` or `Remote`
- `[x402Middleware] Facilitator type: LocalSvmFacilitator` or `HTTPFacilitatorClient`
- `[x402Middleware] PayAI format detected, transforming...` (when PayAI format is used)
