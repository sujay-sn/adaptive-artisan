// A small 2D physics world for the skills pile: circles under gravity in an
// open-topped jar. No DOM and no React, so it can be tested on its own. One
// step is one 60 Hz tick; the component runs as many as real time calls for,
// so the pile behaves the same on any refresh rate.
//
// Verlet integration: a body keeps its previous position instead of a
// velocity, and every constraint (collisions, walls) moves positions
// directly. Stacks stay stable and come to rest, where velocity-and-impulse
// physics with a few solver passes jitters forever and lets piles compress.

export interface Body {
  id: string;
  x: number;
  y: number;
  /** Position one tick ago; (x - px, y - py) is the velocity. */
  px: number;
  py: number;
  /** Current collision radius; eases toward `target` so size changes push neighbors gently. */
  r: number;
  target: number;
  /** Turned by rolling, for the shape drawn on top. */
  angle: number;
  /** True once any part of the body has reached the jar's rim; from then on the lid eases it down inside. */
  inside: boolean;
}

export interface World {
  width: number;
  height: number;
  bodies: Body[];
  /** The body under the pointer, if any: the caller moves it, and nothing else does. */
  held: Body | null;
  /** A body floating to a point, as a selected skill rises to the top of the jar. It shoves others on the way, and they can't move it. */
  anchor: { body: Body; x: number; y: number } | null;
}

/** Pixels per tick squared. */
export const GRAVITY = 0.38;
const AIR = 0.995;
const FLOOR_FRICTION = 0.9;
const SOLVER_PASSES = 8;
const GROW = 0.18;
/** How firmly the lid eases a body that is partly above the rim back down, per tick. */
const LID = 0.2;
/** How quickly an anchored body closes on its point each tick. */
const FLOAT = 0.12;
/** Below this, a tick counts as still. */
export const STILL = 0.06;

export const velocity = (body: Body) => ({ vx: body.x - body.px, vy: body.y - body.py });

/** Gives a body a velocity in pixels per tick, as for a throw or a hop. */
export function push(body: Body, vx: number, vy: number): void {
  body.px = body.x - vx;
  body.py = body.y - vy;
}

/** Moves a body somewhere outright, keeping a chosen velocity (zero by default). */
export function moveTo(body: Body, x: number, y: number, vx = 0, vy = 0): void {
  body.x = x;
  body.y = y;
  push(body, vx, vy);
}

/** Drops bodies in from above the jar, spread across its width and staggered in height. */
export function scatterAbove(world: World, random: () => number = Math.random): void {
  for (const body of world.bodies) {
    const span = Math.max(0, world.width - 2 * body.r);
    moveTo(body, body.r + random() * span, -body.r - random() * world.height * 1.6, (random() - 0.5) * 2, 0);
    body.inside = false;
  }
}

function keepInJar(world: World, body: Body): void {
  if (body.x < body.r) body.x = body.r;
  else if (body.x > world.width - body.r) body.x = world.width - body.r;
  if (body.y > world.height - body.r) body.y = world.height - body.r;
}

/** Advances one tick and returns the largest movement in it, so callers can tell when the pile has settled. */
export function step(world: World): number {
  const { bodies, held, anchor } = world;
  const floating = anchor && anchor.body !== held ? anchor.body : null;
  const fixed = (body: Body) => body === held || body === floating;

  let motion = 0;
  if (floating && anchor) {
    const dx = (anchor.x - floating.x) * FLOAT;
    const dy = (anchor.y - floating.y) * FLOAT;
    floating.px = floating.x;
    floating.py = floating.y;
    floating.x += dx;
    floating.y += dy;
    floating.angle += dx * 0.012;
    floating.inside = true;
    motion = Math.abs(dx) + Math.abs(dy);
  }

  for (const body of bodies) {
    body.r += (body.target - body.r) * GROW;
    if (fixed(body)) continue;
    const vx = (body.x - body.px) * AIR;
    const vy = (body.y - body.py) * AIR;
    body.px = body.x;
    body.py = body.y;
    body.x += vx;
    body.y += vy + GRAVITY;
    body.angle += vx * 0.012;
    // Touching the rim counts. A body that comes to rest on a tall stack with
    // part of it above the jar would otherwise never be pushed back in.
    if (body.y > -body.r) body.inside = true;
  }

  for (let pass = 0; pass < SOLVER_PASSES; pass++) {
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i]!;
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const reach = a.r + b.r;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared >= reach * reach || distanceSquared === 0) continue;
        const distance = Math.sqrt(distanceSquared);
        const overlap = (reach - distance) / distance;
        // Held and floating bodies are immovable; they shove everything else out of the way.
        const aFixed = fixed(a);
        const bFixed = fixed(b);
        if (aFixed && bFixed) continue;
        const shareA = aFixed ? 0 : bFixed ? 1 : 0.5;
        const shareB = 1 - shareA;
        a.x -= dx * overlap * shareA;
        a.y -= dy * overlap * shareA;
        b.x += dx * overlap * shareB;
        b.y += dy * overlap * shareB;
      }
    }
    for (const body of bodies) if (!fixed(body)) keepInJar(world, body);
  }

  for (const body of bodies) {
    if (body === floating) continue;
    // The lid: ease anything poking above the rim back down, gently rather than
    // snapping, so the pile makes room for it.
    if (!fixed(body) && body.inside && body.y < body.r) body.y += (body.r - body.y) * LID;
    // Rolling along the floor slows down.
    if (body !== held && body.y >= world.height - body.r - 0.5) body.px = body.x - (body.x - body.px) * FLOOR_FRICTION;
    motion = Math.max(motion, Math.abs(body.x - body.px) + Math.abs(body.y - body.py), Math.abs(body.target - body.r));
  }
  return motion;
}

/** Runs the world until it settles (or the tick budget runs out), for reduced motion and tests. Returns the ticks used. */
export function settle(world: World, maxTicks = 1500): number {
  let quiet = 0;
  let ticks = 0;
  while (ticks < maxTicks && quiet < 45) {
    quiet = step(world) < STILL ? quiet + 1 : 0;
    ticks++;
  }
  return ticks;
}
