// MD3 Expressive motion tokens.
//
// Springs are specified by Material as a damping ratio plus stiffness.
// Spatial springs (position, size, shape) may overshoot; effects springs
// (color, opacity) are critically damped and never bounce.
//
// The same tokens drive two runtimes. Motion uses `spring()` for layout
// animations. CSS uses `springStylesheet()`, which turns each spring into a
// `linear()` easing plus a duration; the build plugin writes it into
// index.html, so components animate with plain CSS transitions.

export type MotionScheme = 'expressive' | 'standard';
export type SpringKind = 'spatial' | 'effects';
export type SpringSpeed = 'fast' | 'default' | 'slow';

export const SPRING_KINDS: readonly SpringKind[] = ['spatial', 'effects'];
export const SPRING_SPEEDS: readonly SpringSpeed[] = ['fast', 'default', 'slow'];

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

/** Position over time of a unit-mass spring released from 0 toward 1. */
function springPosition({ stiffness, dampingRatio }: SpringToken): (t: number) => number {
  const natural = Math.sqrt(stiffness);
  if (dampingRatio < 1) {
    const decay = dampingRatio * natural;
    const damped = natural * Math.sqrt(1 - dampingRatio * dampingRatio);
    return (t) => 1 - Math.exp(-decay * t) * (Math.cos(damped * t) + (decay / damped) * Math.sin(damped * t));
  }
  // Critically damped. MD3 defines no overdamped springs.
  return (t) => 1 - Math.exp(-natural * t) * (1 + natural * t);
}

/**
 * A spring as a CSS easing: one `linear()` sample per frame at 60fps, over the
 * time the spring takes to settle within 0.1% of its target.
 */
export function springEasing(token: SpringToken): { duration: number; easing: string } {
  const position = springPosition(token);
  const step = 0.001;
  let settle = step;
  for (let t = 0; t <= 5; t += step) {
    if (Math.abs(1 - position(t)) >= 0.001) settle = t + step;
  }
  const frames = Math.max(2, Math.round(settle * 60));
  const points = Array.from({ length: frames + 1 }, (_, i) => (i === frames ? 1 : position((settle * i) / frames)));
  return {
    duration: Math.round(settle * 1000),
    easing: `linear(${points.map((p) => Number(p.toFixed(4))).join(', ')})`,
  };
}

/** Custom properties for every spring. The Standard scheme applies under data-motion-scheme="standard". */
export function springStylesheet(): string {
  const declarations = (scheme: MotionScheme) =>
    SPRING_KINDS.flatMap((kind) =>
      SPRING_SPEEDS.map((speed) => {
        const { duration, easing } = springEasing(SPRINGS[scheme][kind][speed]);
        return `--md-spring-${kind}-${speed}: ${easing};\n--md-spring-${kind}-${speed}-duration: ${duration}ms;`;
      }),
    ).join('\n');
  return `:root {\n${declarations('expressive')}\n}\n:root[data-motion-scheme="standard"] {\n${declarations('standard')}\n}`;
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