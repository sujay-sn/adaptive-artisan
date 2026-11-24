// Relative, with its extension: the build plugin loads this file outside the app's aliases.
import { SHAPE_POINTS, shapeRadii, type ShapeName } from '../shape/shapes.ts';

// The favicon: an MD3 shape that morphs through the Expressive library, with
// a small core shape inside, in the theme's primary colors. It is the site's
// signature move at the size of a browser tab.
//
// Two forms share this file. animatedFaviconSvg() is the static file the build
// writes (scripts/vite-plugin-md-foundation.ts); Firefox plays its SMIL morph,
// and other browsers show its first frame. faviconSvg() draws one frame, which
// src/theme/faviconMotion.ts swaps in while the page is open, so the icon moves
// in every browser and follows the visitor's theme.

export const FAVICON_OUTER: readonly ShapeName[] = ['cookie9', 'flower', 'sunny', 'clover4'];
export const FAVICON_CORE: readonly ShapeName[] = ['circle', 'cookie4', 'circle', 'squircle'];
/** Each shape holds this long before it morphs on. */
export const FAVICON_HOLD_MS = 6000;
export const FAVICON_MORPH_MS = 900;
/** A quarter turn per morph, so four morphs come back to the start with no jump. */
const TURN = 90;

export interface FaviconColors {
  shape: string;
  core: string;
}

// Every other sample point is plenty at 64 units and keeps the file small.
const STRIDE = 2;
const COUNT = SHAPE_POINTS / STRIDE;
const radii = new Map<ShapeName, number[]>();
function radiiOf(name: ShapeName): number[] {
  let r = radii.get(name);
  if (!r) {
    r = shapeRadii(name).filter((_, i) => i % STRIDE === 0);
    radii.set(name, r);
  }
  return r;
}

const round = (value: number) => Number(value.toFixed(1));

/** SVG points for a shape (or a blend of two) centered in the 64-unit box. */
function points(from: ShapeName, to: ShapeName, t: number, radius: number, degrees: number): string {
  const a = radiiOf(from);
  const b = radiiOf(to);
  const turn = (degrees * Math.PI) / 180;
  const out: string[] = [];
  for (let i = 0; i < COUNT; i++) {
    const r = radius * (a[i]! + (b[i]! - a[i]!) * t);
    const angle = (i / COUNT) * Math.PI * 2 - Math.PI / 2 + turn;
    out.push(`${round(32 + r * Math.cos(angle))},${round(32 + r * Math.sin(angle))}`);
  }
  return out.join(' ');
}

/** The expressive ease the morph follows: quick to start, long to settle. */
export const easeMorph = (t: number) => 1 - (1 - t) ** 3;

/** One frame: shape `step` on its way to the next, `t` of the way there (0 to 1). */
export function faviconSvg(step: number, t: number, colors: FaviconColors): string {
  const n = FAVICON_OUTER.length;
  const k = ((step % n) + n) % n;
  const next = (k + 1) % n;
  const eased = easeMorph(Math.min(1, Math.max(0, t)));
  const turn = (k + eased) * TURN;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<polygon fill="${colors.shape}" points="${points(FAVICON_OUTER[k]!, FAVICON_OUTER[next]!, eased, 31, turn)}"/>` +
    `<polygon fill="${colors.core}" points="${points(FAVICON_CORE[k]!, FAVICON_CORE[next]!, eased, 11, -turn)}"/>` +
    `</svg>`
  );
}

/** The static file: the whole loop as SMIL, in light and dark colors. */
export function animatedFaviconSvg(light: FaviconColors, dark: FaviconColors): string {
  const n = FAVICON_OUTER.length;
  const cycle = FAVICON_HOLD_MS + FAVICON_MORPH_MS;
  const total = cycle * n;
  // Per shape: hold, then morph into the next. Times as fractions of the loop.
  const keyTimes: number[] = [];
  for (let k = 0; k < n; k++) keyTimes.push((k * cycle) / total, (k * cycle + FAVICON_HOLD_MS) / total);
  keyTimes.push(1);
  const splines = Array.from({ length: n }, () => ['0 0 1 1', '0.2 0 0 1']).flat().join(';');
  const times = keyTimes.map((t) => Number(t.toFixed(4))).join(';');

  const frames = (shapes: readonly ShapeName[], radius: number, direction: 1 | -1) => {
    const values: string[] = [];
    const turns: string[] = [];
    for (let k = 0; k < n; k++) {
      const shape = points(shapes[k]!, shapes[k]!, 0, radius, 0);
      values.push(shape, shape);
      turns.push(`${direction * k * TURN} 32 32`, `${direction * k * TURN} 32 32`);
    }
    values.push(points(shapes[0]!, shapes[0]!, 0, radius, 0));
    turns.push(`${direction * n * TURN} 32 32`);
    return { first: values[0]!, values: values.join(';'), turns: turns.join(';') };
  };
  const outer = frames(FAVICON_OUTER, 31, 1);
  const core = frames(FAVICON_CORE, 11, -1);
  const animate = (values: string) =>
    `<animate attributeName="points" dur="${total}ms" repeatCount="indefinite" calcMode="spline" keyTimes="${times}" keySplines="${splines}" values="${values}"/>`;
  const rotate = (values: string) =>
    `<animateTransform attributeName="transform" type="rotate" dur="${total}ms" repeatCount="indefinite" calcMode="spline" keyTimes="${times}" keySplines="${splines}" values="${values}"/>`;

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
    `<style>.s{fill:${light.shape}}.c{fill:${light.core}}@media (prefers-color-scheme:dark){.s{fill:${dark.shape}}.c{fill:${dark.core}}}</style>`,
    `<polygon class="s" points="${outer.first}">${animate(outer.values)}${rotate(outer.turns)}</polygon>`,
    `<polygon class="c" points="${core.first}">${animate(core.values)}${rotate(core.turns)}</polygon>`,
    '</svg>',
  ].join('');
}
