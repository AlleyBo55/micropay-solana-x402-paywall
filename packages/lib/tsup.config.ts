import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'agent/index': 'src/agent/index.ts',
        'pricing/index': 'src/pricing/index.ts',
        'client/index': 'src/client/index.ts',
        'session/index': 'src/session/index.ts',
        'express/index': 'src/express/index.ts',
        'next/index': 'src/next/index.ts',
    },

    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    treeshake: true,
    minify: false,
    target: 'node18',
    outDir: 'dist',
    external: ['@solana/web3.js', '@x402/core', '@x402/svm', 'react', 'react-dom'],
});
