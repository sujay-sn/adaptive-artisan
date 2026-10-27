// MD3 Expressive motion tokens.
//
// Springs are specified by Material as a damping ratio plus stiffness.
// Spatial springs (position, size, shape) may overshoot; effects springs
// (color, opacity) are critically damped and never bounce.

export type MotionScheme = 'expressive' | 'standard';
export type SpringKind = 'spatial' | 'effects';
export type SpringSpeed = 'fast' | 'default' | 'slow';

export interface SpringToken {
  stiffness: number;
  dampingRatio: number;
}

type SpringTable = Record<SpringKind, Record<SpringSpeed, SpringToken>>;

const EFFECTS: SpringTable['effects'] = {
  fast: { stiffness: 3800, dampingRatio: 1 },
  default: { stiffness: 1600, dampingRatio: 1 },
  slow: { stiffness: 800, dampingRatio: 1 },
};

export const SPRINGS: Record<MotionScheme, SpringTable> = {
  expressive: {
    spatial: {
      fast: { stiffness: 800, dampingRatio: 0.6 },
      default: { stiffness: 380, dampingRatio: 0.8 },
      slow: { stiffness: 200, dampingRatio: 0.8 },
    },
    effects: EFFECTS,
  },
  standard: {
    spatial: {
      fast: { stiffness: 1400, dampingRatio: 0.9 },
      default: { stiffness: 700, dampingRatio: 0.9 },
      slow: { stiffness: 300, dampingRatio: 0.9 },
    },
    effects: EFFECTS,
  },
};

/** Motion takes a damping coefficient. With mass 1, c = ratio * 2 * sqrt(stiffness). */
export function toMotionSpring({ stiffness, dampingRatio }: SpringToken) {
  return { type: 'spring' as const, stiffness, damping: dampingRatio * 2 * Math.sqrt(stiffness), mass: 1 };
}

export function spring(scheme: MotionScheme, kind: SpringKind, speed: SpringSpeed = 'default') {
  return toMotionSpring(SPRINGS[scheme][kind][speed]);
}

/** Cubic-bezier easings, for CSS transitions and keyframes. */
export const EASING = {
  emphasized: [0.2, 0, 0, 1],
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1],
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15],
  standard: [0.2, 0, 0, 1],
  standardDecelerate: [0, 0, 0, 1],
  standardAccelerate: [0.3, 0, 1, 1],
} as const;

/** Durations in ms. */
export const DURATION = {
  short1: 50, short2: 100, short3: 150, short4: 200,
  medium1: 250, medium2: 300, medium3: 350, medium4: 400,
  long1: 450, long2: 500, long3: 550, long4: 600,
  extraLong1: 700, extraLong2: 800, extraLong3: 900, extraLong4: 1000,
} as const;