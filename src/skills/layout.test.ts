import { describe, expect, it } from 'vitest';
import { SKILL_GRAPH } from './graph';
import { canvasHeight, createConstellation, hasQuietLabel, nodeRadius, QUIET_LABELS_BELOW } from './simulation';

// Solves the constellation headlessly and counts colliding label boxes, so a
// layout change that brings back clutter fails here instead of on screen.

function layout(width: number, height: number) {
  const positions = new Map<string, { x: number; y: number }>();
  const element = (id: string) =>
    ({
      setAttribute: (_name: string, value: string) => {
        const match = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(value);
        if (match) positions.set(id, { x: Number(match[1]), y: Number(match[2]) });
      },
    }) as unknown as SVGGElement;
  const constellation = createConstellation({ node: element, link: () => undefined, reducedMotion: true });
  constellation.resize(width, height);
  constellation.dispose();
  return positions;
}

function labelCollisions(width: number): number {
  const positions = layout(width, canvasHeight(width));
  const quiet = width < QUIET_LABELS_BELOW;
  const boxes = SKILL_GRAPH.nodes
    .filter((node) => !quiet || !hasQuietLabel(node))
    .map((node) => {
      const point = positions.get(node.id) ?? { x: 0, y: 0 };
      const half = (node.label.length * (node.kind === 'category' ? 7.6 : 6.4)) / 2;
      const top = point.y + nodeRadius(node) + (node.kind === 'category' ? 20 : 14) - 11;
      return { left: point.x - half, right: point.x + half, top, bottom: top + 14 };
    });
  let count = 0;
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i];
      const b = boxes[j];
      if (a && b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) count += 1;
    }
  }
  return count;
}

describe('constellation layout', () => {
  // Phone-ish, laptop, and 4K canvas widths.
  it.each([
    [620, 2],
    [964, 3],
    [1500, 6],
  ])('keeps visible labels apart at %ipx (at most %i collisions)', (width, limit) => {
    const collisions = labelCollisions(width);
    console.log(`label collisions at ${width}px: ${collisions}`);
    expect(collisions).toBeLessThanOrEqual(limit);
  });
});