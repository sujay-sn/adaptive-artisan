import { describe, expect, it } from 'vitest';
import { animatedFaviconSvg, faviconSvg, FAVICON_OUTER } from './favicon';

const LIGHT = { shape: '#1C6A65', core: '#A8F0EA' };
const DARK = { shape: '#9BD0CC', core: '#265B57' };
const pointLists = (svg: string) => [...svg.matchAll(/points="([^"]+)"/g)].map((m) => m[1]!.split(' ').length);

describe('favicon', () => {
  it('draws two shapes with the same number of points, so they can morph', () => {
    const counts = pointLists(faviconSvg(0, 0.4, LIGHT));
    expect(counts).toHaveLength(2);
    expect(counts[0]).toBe(counts[1]);
  });

  it('ends each morph exactly where the next shape begins', () => {
    for (let step = 0; step < FAVICON_OUTER.length; step++) {
      expect(faviconSvg(step, 1, LIGHT)).toBe(faviconSvg(step + 1, 0, LIGHT));
    }
  });

  it('loops in the static file with every frame on the same point count', () => {
    const svg = animatedFaviconSvg(LIGHT, DARK);
    const values = [...svg.matchAll(/attributeName="points"[^>]*values="([^"]+)"/g)].map((m) => m[1]!.split(';'));
    expect(values).toHaveLength(2);
    for (const frames of values) {
      expect(frames[0]).toBe(frames.at(-1));
      expect(new Set(frames.map((f) => f.split(' ').length)).size).toBe(1);
    }
    // A full turn over the loop, so it restarts without a jump.
    const turns = [...svg.matchAll(/type="rotate"[^>]*values="([^"]+)"/g)].map((m) => m[1]!.split(';'));
    expect(turns[0]![0]).toBe('0 32 32');
    expect(turns[0]!.at(-1)).toBe('360 32 32');
  });

  it('carries light and dark colors and stays small', () => {
    const svg = animatedFaviconSvg(LIGHT, DARK);
    expect(svg).toContain(LIGHT.shape);
    expect(svg).toContain(DARK.shape);
    expect(svg).toContain('prefers-color-scheme:dark');
    expect(svg.length).toBeLessThan(16_000);
  });
});
