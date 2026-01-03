import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'solana/index': 'src/solana/index.ts',
        'session/index': 'src/session/index.ts',
        'x402/index': 'src/x402/index.ts',
        'store/index': 'src/store/index.ts',
        'middleware/index': 'src/middleware/index.ts',
        'utils/index': 'src/utils/index.ts',
        'client/index': 'src/client/index.ts',
        'pricing/index': 'src/pricing/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    target: 'node18',
    outDir: 'dist',
    external: ['@solana/web3.js'],
});
