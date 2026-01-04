// Agent info endpoint - returns agent wallet balance and address

import { NextResponse } from 'next/server';
import { getAgentBalance, getAgentPublicKey } from '@/lib/agent-wallet';

export async function GET() {
    try {
        const address = getAgentPublicKey();

        if (address === 'Not configured') {
            return NextResponse.json({
                address: 'Not configured',
                balance: '0.00',
                configured: false,
            });
        }

        const { sol } = await getAgentBalance();

        return NextResponse.json({
            address,
            balance: sol.toFixed(4),
            configured: true,
        });
    } catch (error) {
        return NextResponse.json({
            address: 'Error',
            balance: '0.00',
            configured: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
