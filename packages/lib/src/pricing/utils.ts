export function lamportsToSol(lamports: bigint | number): number {
    return Number(lamports) / 1_000_000_000;
}
