import { describe, expect, it } from 'vitest';
import { degreeProgress } from './degreeProgress';

describe('degreeProgress', () => {
  it('is zero on the first day and not before', () => {
    expect(degreeProgress('2024-09', '2026-12', new Date(2024, 8, 1)).fraction).toBe(0);
    expect(degreeProgress('2024-09', '2026-12', new Date(2023, 0, 1)).fraction).toBe(0);
  });

  it('counts the end month as part of the program', () => {
    const lastDay = degreeProgress('2024-09', '2026-12', new Date(2026, 11, 31));
    expect(lastDay.complete).toBe(false);
    expect(lastDay.fraction).toBeGreaterThan(0.99);
    expect(degreeProgress('2024-09', '2026-12', new Date(2027, 0, 1)).complete).toBe(true);
  });

  it('measures partway through by month', () => {
    // 26 of 28 months, plus 10 of November's 30 days.
    expect(degreeProgress('2024-09', '2026-12', new Date(2026, 10, 11)).fraction).toBeCloseTo((26 + 10 / 30) / 28, 5);
  });

  it('spells out the final month', () => {
    expect(degreeProgress('2024-09', '2026-12').endLabel).toBe('December 2026');
  });
});
