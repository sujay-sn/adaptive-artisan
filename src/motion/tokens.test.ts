import { describe, expect, it } from 'vitest';
import { SPRINGS, spring, toMotionSpring } from './tokens';

describe('spring tokens', () => {
  it('converts an MD3 damping ratio into a Motion damping coefficient', () => {
    expect(toMotionSpring({ stiffness: 380, dampingRatio: 0.8 }).damping).toBeCloseTo(31.19, 2);
  });

  it('keeps every effects spring critically damped', () => {
    for (const scheme of ['expressive', 'standard'] as const) {
      for (const speed of ['fast', 'default', 'slow'] as const) {
        const s = spring(scheme, 'effects', speed);
        expect(s.damping).toBeCloseTo(2 * Math.sqrt(s.stiffness), 6);
      }
    }
  });

  it('lets expressive spatial springs overshoot more than standard ones', () => {
    expect(SPRINGS.expressive.spatial.default.dampingRatio).toBeLessThan(SPRINGS.standard.spatial.default.dampingRatio);
  });
});