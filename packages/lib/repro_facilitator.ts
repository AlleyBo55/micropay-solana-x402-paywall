
import { LocalSvmFacilitator } from './src/svm/LocalSvmFacilitator';
import { x402ResourceServer } from '@x402/core/server';
import { registerExactSvmScheme } from '@x402/svm/exact/server';

async function run() {
    console.log('Instantiating Facilitator...');
    const facilitator = new LocalSvmFacilitator('https://api.devnet.solana.com');

    console.log('Fetching Supported...');
    const supported = await facilitator.getSupported();
    console.log('Supported:', JSON.stringify(supported, null, 2));

    console.log('Instantiating Server...');
    const server = new x402ResourceServer(facilitator);
    registerExactSvmScheme(server);

    console.log('Checking Server Support...');
    const devnetId = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';

    try {
        // Mock a route config check
        // The server usually validates this internally during request handling
        // We can simulate the check by calling internal methods if accessible, or just observing

        // Actually, let's see if the server exposes 'supports'
        // Type definition might hide it, but at runtime it might exist
        // Or we can try to verify a payload with that config

        // But the error "Facilitator does not support scheme" comes from configuration validation phase?
        // Or request handling? "Route *: Facilitator does not support..." suggests initialization/middleware time.

        // In @x402/next, validation happens in `withX402`.

        console.log('Simulation complete. Check logs.');
    } catch (e) {
        console.error(e);
    }
}

run();
