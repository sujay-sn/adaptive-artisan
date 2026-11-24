import { describe, expect, it } from 'vitest';
import { FIELD_ROLES, layoutField, ShapeField, waveEnergy, type Palette, type Rgb } from './shapeField';

const flat = (rgb: Rgb): Palette => Object.fromEntries(FIELD_ROLES.map((role) => [role, rgb])) as Palette;
const BLUE = flat([40, 60, 200]);
const RED = flat([200, 40, 60]);

function run(field: ShapeField, from: number, to: number, ambient = false): boolean {
  let moving = true;
  for (let now = from; now <= to; now += 16) moving = field.step(now, { ambient, expressive: true });
  return moving;
}

describe('shape field layout', () => {
  it('is the same on every run and stays inside its circle', () => {
    const a = layoutField(600, 600);
    const b = layoutField(600, 600);
    expect(a.cells.length).toBe(b.cells.length);
    expect(a.cells.map((cell) => cell.role)).toEqual(b.cells.map((cell) => cell.role));
    for (const cell of a.cells) expect(cell.dist).toBeLessThanOrEqual(a.radius);
  });

  it('keeps the cell count reasonable from a phone to a wide screen', () => {
    for (const side of [280, 480, 704]) {
      const { cells } = layoutField(side, side);
      expect(cells.length).toBeGreaterThan(100);
      expect(cells.length).toBeLessThan(260);
    }
  });
});

describe('ripples', () => {
  it('peak on the expanding ring and fade with age', () => {
    const wave = { x: 0, y: 0, start: 0, amplitude: 1, speed: 1, width: 20, life: 500 };
    expect(waveEnergy(wave, 100, 0, 100)).toBeGreaterThan(waveEnergy(wave, 40, 0, 100));
    expect(waveEnergy(wave, 300, 0, 300)).toBeLessThan(waveEnergy(wave, 100, 0, 100));
    expect(waveEnergy(wave, 0, 0, -10)).toBe(0);
  });

  it('settle back to rest, so the loop can sleep', () => {
    const field = new ShapeField(500, 500, BLUE, true, 0);
    field.tap(250, 250, 0);
    expect(run(field, 0, 400)).toBe(true);
    expect(run(field, 400, 8000)).toBe(false);
  });

  it('never sleeps while ambient motion runs', () => {
    const field = new ShapeField(500, 500, BLUE, true, 0);
    expect(run(field, 0, 6000, true)).toBe(true);
  });
});

describe('palette changes', () => {
  it('ignore a palette that did not change', () => {
    const field = new ShapeField(500, 500, BLUE, true, 0);
    run(field, 0, 3000);
    expect(field.setPalette(flat([40, 60, 200]), null, 3000)).toBe(false);
    expect(field.step(3016, { ambient: false, expressive: true })).toBe(false);
  });

  it('roll a new palette across the field, then finish', () => {
    const field = new ShapeField(500, 500, BLUE, true, 0);
    run(field, 0, 3000);
    expect(field.setPalette(RED, { x: 0, y: 0 }, 3000)).toBe(true);
    expect(field.step(3016, { ambient: false, expressive: true })).toBe(true);
    expect(run(field, 3016, 9000)).toBe(false);
  });

  it('land at once under reduced motion', () => {
    const field = new ShapeField(500, 500, BLUE, false, 0);
    expect(field.setPalette(RED, null, 0)).toBe(true);
    expect(field.step(16, { ambient: false, expressive: true })).toBe(false);
  });
});
