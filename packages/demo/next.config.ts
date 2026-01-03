import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  // Use Turbopack (Next.js 16 default)
  // Use Turbopack (Next.js 16 default)
  // turbopack: {
  //   root: path.resolve(__dirname, '../../'),
  // },

  // Environment variable validation
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  },

  // ESM package handling
  transpilePackages: [
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets',
    '@solana/wallet-adapter-base',
    '@alleyboss/micropay-solana-x402-paywall',
  ],

};

export default nextConfig;
