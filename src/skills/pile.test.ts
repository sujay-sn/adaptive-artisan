import { describe, expect, it } from 'vitest';
import { scatterAbove, settle, step, type Body, type World } from './pile';

/** A seeded random number generator, so every run drops the same pile. */
function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A pile of bodies scaled to fill the given share of the jar, like the real one (56% on desktop). */
function world(count: number, width = 1100, height = 432, fill = 0.56): World {
  const random = seeded(7);
  const radii = Array.from({ length: count }, () => 27 + random() * 25);
  const area = radii.reduce((sum, r) => sum + Math.PI * r * r, 0);
  const scale = Math.sqrt((fill * width * height) / area);
  const bodies: Body[] = radii.map((raw, i) => {
    const r = raw * scale;
    return { id: `s${i}`, x: 0, y: 0, px: 0, py: 0, r, target: r, angle: 0, inside: false };
  });
  const w: World = { width, height, bodies, held: null, anchor: null };
  scatterAbove(w, random);
  return w;
}

const worstOverlap = (w: World) => {
  let worst = 0;
  for (let i = 0; i < w.bodies.length; i++)
    for (let j = i + 1; j < w.bodies.length; j++) {
      const a = w.bodies[i]!;
      const b = w.bodies[j]!;
      worst = Math.max(worst, a.r + b.r - Math.hypot(b.x - a.x, b.y - a.y));
    }
  return worst;
};

describe('skills pile physics', () => {
  it('settles well within its budget', () => {
    expect(settle(world(52))).toBeLessThan(1500);
  });

  it('keeps every body inside the jar once settled', () => {
    const w = world(52);
    settle(w);
    for (const b of w.bodies) {
      expect(b.x).toBeGreaterThanOrEqual(b.r - 0.5);
      expect(b.x).toBeLessThanOrEqual(w.width - b.r + 0.5);
      expect(b.y).toBeLessThanOrEqual(w.height - b.r + 0.5);
      expect(b.y).toBeGreaterThanOrEqual(b.r - 0.5);
    }
  });

  it('eases a body resting above the rim back into the jar', () => {
    // A tall stack against the left wall, with the top one sticking out above
    // the rim. Each sits a few pixels off the one below, as in a real pile; a
    // perfectly vertical column has no sideways give and can never topple.
    const r = 30;
    const stack: Body[] = Array.from({ length: 8 }, (_, i) => {
      const x = r + (i % 2) * 6;
      const y = 432 - r - i * 2 * r;
      return { id: `t${i}`, x, y, px: x, py: y, r, target: r, angle: 0, inside: y > -r };
    });
    const w: World = { width: 1100, height: 432, bodies: stack, held: null, anchor: null };
    settle(w);
    for (const b of w.bodies) expect(b.y).toBeGreaterThanOrEqual(b.r - 0.5);
  });

  it('keeps bodies from sinking into each other', () => {
    const w = world(52);
    settle(w);
    expect(worstOverlap(w)).toBeLessThan(3);
  });

  it('floats an anchored body to its point and settles the pile around it', () => {
    const w = world(52);
    settle(w);
    const chosen = w.bodies[10]!;
    const point = { x: w.width / 2, y: chosen.r + 24 };
    w.anchor = { body: chosen, ...point };
    settle(w);
    expect(Math.hypot(chosen.x - point.x, chosen.y - point.y)).toBeLessThan(1);
    for (const other of w.bodies) {
      if (other === chosen) continue;
      expect(Math.hypot(other.x - chosen.x, other.y - chosen.y)).toBeGreaterThan(other.r + chosen.r - 3);
    }
  });

  it('lets a held body shove others without being moved itself', () => {
    const w = world(20);
    settle(w);
    const held = w.bodies[0]!;
    w.held = held;
    const before = { x: held.x, y: held.y };
    for (let i = 0; i < 60; i++) step(w);
    expect(held.x).toBe(before.x);
    expect(held.y).toBe(before.y);
  });
});
