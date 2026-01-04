// Agent Balance API - Returns current agent wallet balance
import { NextRequest, NextResponse } from 'next/server';
import { getAgentKeypair, getConnection, validateAgentWallet } from '@/lib/agent-wallet';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function GET(request: NextRequest) {
    try {
        const walletStatus = await validateAgentWallet();

        if (!walletStatus.configured) {
            return NextResponse.json({
                configured: false,
                error: walletStatus.error,
                address: null,
                balance: 0,
                balanceSol: 0,
            });
        }

        const connection = getConnection();
        const keypair = getAgentKeypair();
        const balance = await connection.getBalance(keypair.publicKey);

        return NextResponse.json({
            configured: true,
            address: keypair.publicKey.toBase58(),
            balance: balance,
            balanceSol: balance / LAMPORTS_PER_SOL,
        });
    } catch (error) {
        return NextResponse.json({
            configured: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            address: null,
            balance: 0,
            balanceSol: 0,
        }, { status: 500 });
    }
}
