// Tests for Priority Fee Utilities
import { describe, it, expect } from 'vitest';
import {
    createPriorityFeeInstructions,
    calculatePriorityFeeCost,
    type PriorityFeeConfig,
} from '../priority-fees';

describe('priority-fees', () => {
    describe('createPriorityFeeInstructions', () => {
        it('returns empty array when disabled (default)', () => {
            const instructions = createPriorityFeeInstructions();
            expect(instructions).toEqual([]);
        });

        it('returns empty array when explicitly disabled', () => {
            const instructions = createPriorityFeeInstructions({ enabled: false });
            expect(instructions).toEqual([]);
        });

        it('returns two instructions when enabled', () => {
            const instructions = createPriorityFeeInstructions({ enabled: true });
            expect(instructions).toHaveLength(2);
        });

        it('creates instructions with custom compute units', () => {
            const config: PriorityFeeConfig = {
                enabled: true,
                computeUnits: 150_000,
            };
            const instructions = createPriorityFeeInstructions(config);
            expect(instructions).toHaveLength(2);
            // First instruction should be SetComputeUnitLimit
            expect(instructions[0].programId.toBase58()).toBe(
                'ComputeBudget111111111111111111111111111111'
            );
        });

        it('creates instructions with custom micro-lamports', () => {
            const config: PriorityFeeConfig = {
                enabled: true,
                microLamports: 10_000,
            };
            const instructions = createPriorityFeeInstructions(config);
            expect(instructions).toHaveLength(2);
            // Second instruction should be SetComputeUnitPrice
            expect(instructions[1].programId.toBase58()).toBe(
                'ComputeBudget111111111111111111111111111111'
            );
        });

        it('creates instructions with both custom values', () => {
            const config: PriorityFeeConfig = {
                enabled: true,
                microLamports: 5_000,
                computeUnits: 100_000,
            };
            const instructions = createPriorityFeeInstructions(config);
            expect(instructions).toHaveLength(2);
        });
    });

    describe('calculatePriorityFeeCost', () => {
        it('calculates cost correctly for typical values', () => {
            // 1000 micro-lamports × 200,000 CU = 200,000,000 micro-lamports = 200 lamports
            const cost = calculatePriorityFeeCost(1_000, 200_000);
            expect(cost).toBe(200);
        });

        it('calculates cost for minimum values', () => {
            const cost = calculatePriorityFeeCost(1, 1);
            expect(cost).toBe(1); // Ceiling of micro-lamports
        });

        it('calculates cost for large values', () => {
            // 10,000 micro-lamports × 1,400,000 CU = 14,000 lamports
            const cost = calculatePriorityFeeCost(10_000, 1_400_000);
            expect(cost).toBe(14_000);
        });

        it('handles zero values', () => {
            const cost = calculatePriorityFeeCost(0, 200_000);
            expect(cost).toBe(0);
        });
    });
});
