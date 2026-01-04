// x402 SDK Configuration
// Uses official Coinbase x402 SDK for payment verification

import { FacilitatorHttpClient } from '@x402/core/facilitator';
import { x402ResourceServer } from '@x402/core/server';
import { registerExactSvmScheme } from '@x402/svm/exact/server';

// Facilitator URL - uses x402.org for devnet, PayAI for mainnet
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator';

// Create facilitator client
export const facilitatorClient = new FacilitatorHttpClient({
    url: FACILITATOR_URL,
});

// Create x402 resource server with Solana support
export const x402Server = new x402ResourceServer(facilitatorClient);

// Register Solana (SVM) exact payment scheme
registerExactSvmScheme(x402Server, {});

// Network identifier (CAIP-2 format)
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta'
    ? 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp' // mainnet
    : 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1'; // devnet

// Creator wallet for receiving payments
export const CREATOR_WALLET = process.env.CREATOR_WALLET_ADDRESS || '';

// Default price in USD (will be converted to SOL)
export const DEFAULT_ARTICLE_PRICE_USD = '$0.01';
