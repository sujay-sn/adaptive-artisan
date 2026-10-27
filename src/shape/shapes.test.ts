import { describe, expect, it } from 'vitest';
import { morphRadii, SHAPE_NAMES, SHAPE_POINTS, shapeClipPath, shapeRadii } from './shapes';

describe('shape library', () => {
  it('samples every shape at the same number of points, so any two can morph', () => {
    for (const name of SHAPE_NAMES) {
      const radii = shapeRadii(name);
      expect(radii).toHaveLength(SHAPE_POINTS);
      expect(Math.max(...radii)).toBeCloseTo(1, 10);
      expect(Math.min(...radii)).toBeGreaterThan(0.3);
      expect(shapeClipPath(name).split(',')).toHaveLength(SHAPE_POINTS);
    }
  });

  it('morphs by interpolating radii, landing exactly on both ends', () => {
    const from = shapeRadii('circle');
    const to = shapeRadii('flower');
    const worst = (a: number[], b: number[]) => Math.max(...a.map((v, i) => Math.abs(v - (b[i] ?? 0))));
    expect(worst(morphRadii(from, to, 0), from)).toBeLessThan(1e-12);
    expect(worst(morphRadii(from, to, 1), to)).toBeLessThan(1e-12);
  });

  it('keeps every point inside its box', () => {
    for (const name of SHAPE_NAMES) {
      const values = [...shapeClipPath(name).matchAll(/(-?[\d.]+)%/g)].map((m) => Number(m[1]));
      expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...values)).toBeLessThanOrEqual(100);
    }
  });
});