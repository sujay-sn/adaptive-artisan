import { SHAPE_POINTS, shapeRadii, type ShapeName } from '@/shape/shapes';

// The hero's shape field: a few hundred small MD3 shapes on a hex grid,
// together forming one large shape that slowly morphs. The cursor sends
// ripples through it, a tap drops a bigger one, and a theme change rolls the
// new colors across it as a wave from wherever the change came from.
//
// Every cell's response runs on a spring (the site's motion scheme decides
// how much it overshoots), so a ripple swells, overshoots, and settles. The
// loop reports when nothing is moving, so its owner can stop asking for frames.

const TAU = Math.PI * 2;

export const FIELD_ROLES = [
  'primary',
  'secondary',
  'tertiary',
  'primary-container',
  'secondary-container',
  'tertiary-container',
] as const;
export type FieldRole = (typeof FIELD_ROLES)[number];
export type Rgb = readonly [number, number, number];
export type Palette = Record<FieldRole, Rgb>;

/** The color a cell moves toward as a ripple lifts it. */
const LIFT: Record<FieldRole, FieldRole> = {
  'primary-container': 'primary',
  // Secondary is close to gray in most schemes, so its container lifts to primary.
  'secondary-container': 'primary',
  'tertiary-container': 'tertiary',
  primary: 'primary-container',
  secondary: 'secondary-container',
  tertiary: 'tertiary-container',
};

const REST_SHAPES: ShapeName[] = ['circle', 'squircle', 'cookie4', 'cookie6', 'cookie9', 'cookie12', 'clover4'];
const LIT_SHAPES: ShapeName[] = ['flower', 'sunny', 'softBurst', 'clover8', 'burst', 'verySunny'];
/** The large shape the whole field forms, in the order it morphs through. */
const SILHOUETTES: ShapeName[] = ['flower', 'cookie6', 'clover4', 'sunny'];
const SILHOUETTE_HOLD = 7000;

const COS = Float64Array.from({ length: SHAPE_POINTS }, (_, i) => Math.cos((i / SHAPE_POINTS) * TAU - Math.PI / 2));
const SIN = Float64Array.from({ length: SHAPE_POINTS }, (_, i) => Math.sin((i / SHAPE_POINTS) * TAU - Math.PI / 2));
const RADII = new Map<ShapeName, Float64Array>();
function radiiOf(name: ShapeName): Float64Array {
  let radii = RADII.get(name);
  if (!radii) {
    radii = Float64Array.from(shapeRadii(name));
    RADII.set(name, radii);
  }
  return radii;
}

/** A small deterministic hash to [0, 1), so the layout is the same on every visit. */
export function hash(a: number, b: number, salt = 0): number {
  let h = (Math.imul((a | 0) + 4096, 0x8000) ^ ((b | 0) + 4096)) ^ Math.imul(salt + 1, 0x9e3779b9);
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export interface Cell {
  x: number;
  y: number;
  /** Distance from the field's center, in px. */
  dist: number;
  angle: number;
  rest: Float64Array;
  lit: Float64Array;
  role: FieldRole;
  size: number;
  rotation: number;
  spin: 1 | -1;
  /** Milliseconds after the start before this cell pops in. */
  delay: number;
  energy: number;
  velocity: number;
  appear: number;
  appearVelocity: number;
}

export interface FieldLayout {
  cells: Cell[];
  cx: number;
  cy: number;
  radius: number;
  pitch: number;
}

/** Cells on a hex grid inside the largest circle the box holds. */
export function layoutField(width: number, height: number): FieldLayout {
  const radius = Math.min(width, height) / 2;
  const pitch = Math.min(52, Math.max(24, (radius * 2) / 15));
  const rowStep = (pitch * Math.sqrt(3)) / 2;
  const cx = width / 2;
  const cy = height / 2;
  const rows = Math.ceil(radius / rowStep) + 1;
  const cols = Math.ceil(radius / pitch) + 1;
  const cells: Cell[] = [];
  for (let j = -rows; j <= rows; j++) {
    for (let i = -cols; i <= cols; i++) {
      const x = cx + i * pitch + (j & 1 ? pitch / 2 : 0);
      const y = cy + j * rowStep;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius - pitch * 0.4) continue;
      const r1 = hash(i, j, 1);
      const r2 = hash(i, j, 2);
      const r3 = hash(i, j, 3);
      // Soft regions of color, with a sprinkle of strong accents.
      const u = dx / radius;
      const v = dy / radius;
      const band = Math.sin(u * 2.6 + v * 1.1) + Math.sin(v * 3.1 - u * 1.4 + 1.7);
      const role: FieldRole =
        r3 < 0.13 ? (r1 < 0.6 ? 'primary' : 'tertiary') : band > 0.55 ? 'primary-container' : band < -0.55 ? 'tertiary-container' : 'secondary-container';
      cells.push({
        x,
        y,
        dist,
        angle: Math.atan2(dy, dx),
        rest: radiiOf(REST_SHAPES[Math.floor(r1 * REST_SHAPES.length)]!),
        lit: radiiOf(LIT_SHAPES[Math.floor(r2 * LIT_SHAPES.length)]!),
        role,
        size: 0.84 + 0.16 * r2,
        rotation: r3 * TAU,
        spin: r1 < 0.5 ? -1 : 1,
        delay: (dist / radius) * 520 + r1 * 140,
        energy: 0,
        velocity: 0,
        appear: 0,
        appearVelocity: 0,
      });
    }
  }
  return { cells, cx, cy, radius, pitch };
}

export interface Wave {
  x: number;
  y: number;
  start: number;
  amplitude: number;
  /** px per ms. */
  speed: number;
  /** Thickness of the ring, in px. */
  width: number;
  /** ms for the ring to fade by about two thirds. */
  life: number;
}

/** How strongly a ring lifts a point: a gaussian band around the expanding radius, fading with age. */
export function waveEnergy(wave: Wave, x: number, y: number, now: number): number {
  const age = now - wave.start;
  if (age < 0) return 0;
  const offset = (Math.hypot(x - wave.x, y - wave.y) - wave.speed * age) / wave.width;
  return wave.amplitude * Math.exp(-offset * offset) * Math.exp(-age / wave.life);
}

/** A ring is done once it has faded, or once it has passed every cell of the field. */
function waveAlive(wave: Wave, now: number, layout: FieldLayout): boolean {
  const age = now - wave.start;
  if (age > wave.life * 4) return false;
  const farthest = Math.hypot(Math.abs(wave.x - layout.cx) + layout.radius, Math.abs(wave.y - layout.cy) + layout.radius);
  return wave.speed * age - wave.width * 3 < farthest;
}

function samePalette(a: Palette, b: Palette): boolean {
  return FIELD_ROLES.every((role) => a[role].every((channel, i) => Math.abs(channel - b[role][i]!) < 0.5));
}

const mix = (a: Rgb, b: Rgb, t: number): [number, number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** Springs per motion scheme: Expressive overshoots, Standard barely does. */
const SPRING = {
  expressive: { stiffness: 520, damping: 24 },
  standard: { stiffness: 600, damping: 44 },
};

const PALETTE_SPEED = 1.6;
const AT_REST = 0.002;

export interface StepOptions {
  /** Ambient motion: the slow breathing and the silhouette's morph. Off while paused. */
  ambient: boolean;
  expressive: boolean;
}

export class ShapeField {
  layout: FieldLayout;
  private palette: Palette;
  private fromPalette: Palette | null = null;
  private paletteChange: { start: number; x: number; y: number; reach: number; lead: number } | null = null;
  private waves: Wave[] = [];
  private pointer: { x: number; y: number } | null = null;
  private lastEmit: { x: number; y: number } | null = null;
  private clock = 0;
  private last: number;
  private readonly start: number;
  private appearing: boolean;
  private readonly motion: boolean;

  /** `motion` false is reduced motion: the field is drawn still and every change lands at once. */
  constructor(
    width: number,
    height: number,
    palette: Palette,
    motion: boolean,
    now: number,
  ) {
    this.motion = motion;
    this.layout = layoutField(width, height);
    this.palette = palette;
    this.start = now;
    this.last = now;
    this.appearing = motion;
    if (!motion) for (const cell of this.layout.cells) cell.appear = 1;
  }

  resize(width: number, height: number): void {
    const appeared = !this.appearing;
    this.layout = layoutField(width, height);
    if (appeared || !this.motion) for (const cell of this.layout.cells) cell.appear = 1;
  }

  /** Rolls a new palette across the field from (x, y), in field coordinates. Returns false if nothing changed. */
  setPalette(next: Palette, origin: { x: number; y: number } | null, now: number): boolean {
    if (samePalette(next, this.palette)) return false;
    if (!this.motion) {
      this.palette = next;
      return true;
    }
    const { cx, cy, cells } = this.layout;
    const x = origin?.x ?? cx;
    const y = origin?.y ?? cy;
    let reach = 0;
    let near = Infinity;
    for (const cell of cells) {
      const d = Math.hypot(cell.x - x, cell.y - y);
      reach = Math.max(reach, d);
      near = Math.min(near, d);
    }
    // The front starts at the nearest cell, so the field changes with the page instead of after it.
    const lead = near === Infinity ? 0 : near;
    this.fromPalette = this.currentFromPalette(now);
    this.palette = next;
    this.paletteChange = { start: now, x, y, reach, lead };
    this.waves.push({ x, y, start: now - lead / PALETTE_SPEED, amplitude: 0.75, speed: PALETTE_SPEED, width: this.layout.pitch * 1.2, life: 1400 });
    return true;
  }

  /** A change mid-transition starts from the old palette: close enough, and never a flash of a third one. */
  private currentFromPalette(now: number): Palette {
    if (!this.fromPalette || !this.paletteChange) return this.palette;
    const front = this.paletteChange.lead + PALETTE_SPEED * (now - this.paletteChange.start);
    return front > this.paletteChange.reach / 2 ? this.palette : this.fromPalette;
  }

  pointerMove(x: number, y: number, now: number): void {
    if (!this.motion) return;
    this.pointer = { x, y };
    const { pitch } = this.layout;
    if (!this.lastEmit || Math.hypot(x - this.lastEmit.x, y - this.lastEmit.y) > pitch * 2) {
      this.lastEmit = { x, y };
      this.waves.push({ x, y, start: now, amplitude: 0.28, speed: 0.5, width: pitch * 0.7, life: 600 });
    }
  }

  pointerLeave(): void {
    this.pointer = null;
    this.lastEmit = null;
  }

  tap(x: number, y: number, now: number): void {
    if (!this.motion) return;
    this.waves.push({ x, y, start: now, amplitude: 1.1, speed: 0.6, width: this.layout.pitch * 0.8, life: 1000 });
  }

  /** Advances the simulation. Returns true while anything is still moving. */
  step(now: number, { ambient, expressive }: StepOptions): boolean {
    const dt = Math.min(32, Math.max(0, now - this.last)) / 1000;
    this.last = now;
    if (!this.motion) return false;
    if (ambient) this.clock += dt * 1000;

    this.waves = this.waves.filter((wave) => waveAlive(wave, now, this.layout));
    const { stiffness, damping } = expressive ? SPRING.expressive : SPRING.standard;
    const lensReach = this.layout.pitch * 2.2;
    const elapsed = now - this.start;
    let moving = ambient || this.waves.length > 0;
    let appearing = false;

    for (const cell of this.layout.cells) {
      let target = 0;
      for (const wave of this.waves) target += waveEnergy(wave, cell.x, cell.y, now);
      if (this.pointer) {
        const reach = 1 - Math.hypot(cell.x - this.pointer.x, cell.y - this.pointer.y) / lensReach;
        if (reach > 0) target += 0.6 * reach * reach;
      }
      target = Math.min(1.4, target);
      cell.velocity += (stiffness * (target - cell.energy) - damping * cell.velocity) * dt;
      cell.energy += cell.velocity * dt;
      if (Math.abs(cell.energy - target) > AT_REST || Math.abs(cell.velocity) > AT_REST) moving = true;

      if (this.appearing && cell.appear < 1) {
        if (elapsed >= cell.delay) {
          cell.appearVelocity += (120 * (1 - cell.appear) - (expressive ? 12 : 22) * cell.appearVelocity) * dt;
          cell.appear += cell.appearVelocity * dt;
          if (Math.abs(1 - cell.appear) < AT_REST && Math.abs(cell.appearVelocity) < AT_REST) cell.appear = 1;
        }
        if (cell.appear !== 1) appearing = true;
      }
    }
    if (this.appearing && !appearing) this.appearing = false;
    if (appearing) moving = true;

    if (this.paletteChange) {
      const front = this.paletteChange.lead + PALETTE_SPEED * (now - this.paletteChange.start);
      if (front > this.paletteChange.reach + this.layout.pitch * 3) {
        this.paletteChange = null;
        this.fromPalette = null;
      } else moving = true;
    }
    return moving;
  }

  /** Radius of the large silhouette at an angle, as a fraction of the field's radius. */
  private silhouette(angle: number): number {
    const phase = this.clock / SILHOUETTE_HOLD;
    const index = Math.floor(phase);
    const t = smoothstep(0.55, 1, phase - index);
    const from = radiiOf(SILHOUETTES[index % SILHOUETTES.length]!);
    const to = radiiOf(SILHOUETTES[(index + 1) % SILHOUETTES.length]!);
    const turned = angle - this.clock * 0.000025 + Math.PI / 2;
    const k = ((Math.round((turned / TAU) * SHAPE_POINTS) % SHAPE_POINTS) + SHAPE_POINTS) % SHAPE_POINTS;
    return from[k]! + (to[k]! - from[k]!) * t;
  }

  draw(context: CanvasRenderingContext2D, width: number, height: number): void {
    context.clearRect(0, 0, width, height);
    const { cells, radius, pitch } = this.layout;
    const now = this.last;
    const change = this.paletteChange;
    const feather = pitch * 3;

    for (const cell of cells) {
      const edge = 1 - smoothstep(0.86, 1, cell.dist / (radius * 0.98 * this.silhouette(cell.angle)));
      if (edge <= 0.01 || cell.appear <= 0.01) continue;
      const energy = Math.max(0, cell.energy);
      const breath = this.motion ? Math.sin(this.clock * 0.0011 - cell.dist * 0.012 + cell.rotation) : 0;
      const scale = cell.size * edge * cell.appear * (1 + 0.06 * breath + 0.5 * energy);
      if (scale < 0.02) continue;

      // Colors: the old palette until the change's front passes, then the new.
      let progress = 1;
      if (change && this.fromPalette) {
        const front = change.lead + PALETTE_SPEED * (now - change.start);
        progress = 1 - smoothstep(front - feather, front, Math.hypot(cell.x - change.x, cell.y - change.y));
      }
      const restColor = this.fromPalette && progress < 1 ? mix(this.fromPalette[cell.role], this.palette[cell.role], progress) : this.palette[cell.role];
      const lift = LIFT[cell.role];
      const litColor = this.fromPalette && progress < 1 ? mix(this.fromPalette[lift], this.palette[lift], progress) : this.palette[lift];
      const [r, g, b] = mix(restColor, litColor, Math.min(1, energy * 0.9));
      context.fillStyle = `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;

      const morph = Math.min(1, energy);
      const eased = morph * morph * (3 - 2 * morph);
      const rotation = cell.rotation + this.clock * 0.00012 * cell.spin + 0.6 * energy * cell.spin;
      const cr = Math.cos(rotation);
      const sr = Math.sin(rotation);
      const size = pitch * 0.5 * scale;
      context.beginPath();
      for (let k = 0; k < SHAPE_POINTS; k++) {
        const rest = cell.rest[k]!;
        const rr = size * (eased > 0.001 ? rest + (cell.lit[k]! - rest) * eased : rest);
        const px = cell.x + rr * (COS[k]! * cr - SIN[k]! * sr);
        const py = cell.y + rr * (SIN[k]! * cr + COS[k]! * sr);
        if (k === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fill();
    }
  }
}
