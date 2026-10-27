import { describe, expect, it } from 'vitest';
import { SPRINGS, spring, springEasing, springStylesheet, toMotionSpring } from './tokens';

const samples = (easing: string) => easing.slice('linear('.length, -1).split(', ').map(Number);

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

describe('springs as CSS easings', () => {
  it('starts at 0, ends at 1, and overshoots for spatial springs', () => {
    const { easing, duration } = springEasing(SPRINGS.expressive.spatial.default);
    const values = samples(easing);
    expect(values[0]).toBe(0);
    expect(values.at(-1)).toBe(1);
    expect(Math.max(...values)).toBeGreaterThan(1);
    expect(duration).toBeGreaterThan(200);
    expect(duration).toBeLessThan(1000);
  });

  it('never overshoots for effects springs', () => {
    const values = samples(springEasing(SPRINGS.expressive.effects.default).easing);
    expect(Math.max(...values)).toBeLessThanOrEqual(1);
  });

  it('settles faster for fast springs than slow ones', () => {
    expect(springEasing(SPRINGS.expressive.spatial.fast).duration).toBeLessThan(springEasing(SPRINGS.expressive.spatial.slow).duration);
  });

  it('emits custom properties for both motion schemes', () => {
    const css = springStylesheet();
    expect(css).toContain('--md-spring-spatial-fast: linear(');
    expect(css).toContain('--md-spring-effects-slow-duration:');
    expect(css).toContain(':root[data-motion-scheme="standard"]');
  });
});