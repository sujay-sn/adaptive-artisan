// Shapes from the Material 3 Expressive shape library, approximated as radial
// functions: each shape is its radius at every angle around the center.
//
// These are approximations, not exact ports of Android's shape definitions.
// The trade is deliberate: sampling every shape at the same angles gives every
// polygon the same number of points, which is what lets the browser (and
// Motion) interpolate smoothly between any two of them.

const TAU = Math.PI * 2;

/** Points per shape. Divisible by every lobe count used below. */
export const SHAPE_POINTS = 144;

type Radial = (angle: number) => number;

/** n smooth lobes around the outline. Sharpness above 1 points the tips; below 1 pinches the valleys. */
function lobes(count: number, depth: number, sharpness = 1): Radial {
  return (angle) => 1 - depth + depth * ((Math.cos(count * angle) + 1) / 2) ** sharpness;
}

/** A superellipse: a square with continuous, softly rounded corners. */
function superellipse(power: number): Radial {
  return (angle) => (Math.abs(Math.cos(angle)) ** power + Math.abs(Math.sin(angle)) ** power) ** (-1 / power);
}

export const SHAPES = {
  circle: () => 1,
  squircle: superellipse(4),
  cookie4: lobes(4, 0.12),
  cookie6: lobes(6, 0.1),
  cookie9: lobes(9, 0.08),
  cookie12: lobes(12, 0.07),
  sunny: lobes(8, 0.14, 1.6),
  verySunny: lobes(8, 0.24, 1.8),
  flower: lobes(8, 0.3, 0.55),
  clover4: lobes(4, 0.42, 0.5),
  clover8: lobes(8, 0.3, 0.5),
  softBurst: lobes(10, 0.18, 1.4),
  burst: lobes(12, 0.24, 2.2),
} satisfies Record<string, Radial>;

export type ShapeName = keyof typeof SHAPES;
export const SHAPE_NAMES = Object.keys(SHAPES) as ShapeName[];

const angleAt = (index: number) => (index / SHAPE_POINTS) * TAU - Math.PI / 2;

/** Radius at each sample angle, scaled so the shape just touches its box. */
export function shapeRadii(name: ShapeName, rotation = 0): number[] {
  const radial: Radial = SHAPES[name];
  const radii = Array.from({ length: SHAPE_POINTS }, (_, i) => radial(angleAt(i) + rotation));
  const max = Math.max(...radii);
  return radii.map((r) => r / max);
}

/** Interpolates between two shapes. t = 0 is `from`, t = 1 is `to`. */
export function morphRadii(from: number[], to: number[], t: number): number[] {
  return from.map((r, i) => r + ((to[i] ?? r) - r) * t);
}

const coordinate = (value: number) => `${Number(value.toFixed(2))}%`;

/** A CSS `polygon()` for clip-path, centered in its box. */
export function polygonFromRadii(radii: number[]): string {
  const points = radii.map((r, i) => {
    const angle = angleAt(i);
    return `${coordinate(50 + 50 * r * Math.cos(angle))} ${coordinate(50 + 50 * r * Math.sin(angle))}`;
  });
  return `polygon(${points.join(', ')})`;
}

export function shapeClipPath(name: ShapeName, rotation = 0): string {
  return polygonFromRadii(shapeRadii(name, rotation));
}