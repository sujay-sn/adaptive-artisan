import { describe, expect, it } from 'vitest';
import {
  buildScheme,
  COLOR_ROLES,
  DEFAULT_THEME,
  roleToCssVar,
  SCHEME_VARIANTS,
  schemeColors,
  SEEDS,
  themeStylesheet,
  type ColorRole,
  type SchemeColors,
} from './engine';

// WCAG 2.x contrast, computed independently of material-color-utilities so the
// test checks the library's output instead of trusting its own math.
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// Text and icons drawn on a container must reach 4.5:1 (WCAG AA, normal text).
const TEXT_PAIRS: Array<[ColorRole, ColorRole]> = [
  ['primary', 'onPrimary'],
  ['primaryContainer', 'onPrimaryContainer'],
  ['secondary', 'onSecondary'],
  ['secondaryContainer', 'onSecondaryContainer'],
  ['tertiary', 'onTertiary'],
  ['tertiaryContainer', 'onTertiaryContainer'],
  ['error', 'onError'],
  ['errorContainer', 'onErrorContainer'],
  ['surface', 'onSurface'],
  ['surfaceContainerLowest', 'onSurface'],
  ['surfaceContainerHighest', 'onSurface'],
  ['surface', 'onSurfaceVariant'],
  ['surfaceContainerHighest', 'onSurfaceVariant'],
  ['inverseSurface', 'inverseOnSurface'],
  ['primaryFixed', 'onPrimaryFixed'],
  ['primaryFixed', 'onPrimaryFixedVariant'],
];

// Boundaries of interactive controls need 3:1 (WCAG 1.4.11, non-text contrast).
const UI_PAIRS: Array<[ColorRole, ColorRole]> = [['surface', 'outline']];

// The five site seeds plus deliberately hostile ones: pure primaries, a
// screaming yellow, and seeds with no chroma at all.
const SEED_HEXES = [
  ...SEEDS.map((s) => s.hex),
  '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000',
  '#FFFFFF', '#000000', '#808080',
];

const CONTRAST_LEVELS = [0, 0.5, 1];

describe('color roles', () => {
  it('maps camelCase roles to MD3 custom property names', () => {
    expect(roleToCssVar('surfaceContainerHigh')).toBe('--md-sys-color-surface-container-high');
    expect(roleToCssVar('onPrimaryFixedVariant')).toBe('--md-sys-color-on-primary-fixed-variant');
  });

  it('emits every role as a light-dark() pair', () => {
    const css = themeStylesheet(DEFAULT_THEME);
    for (const role of COLOR_ROLES) {
      expect(css).toMatch(new RegExp(`${roleToCssVar(role)}: light-dark\\(#[0-9a-f]{6}, #[0-9a-f]{6}\\);`));
    }
  });

  it('rejects malformed seeds', () => {
    expect(() => buildScheme({ ...DEFAULT_THEME, seed: 'teal' }, false)).toThrow();
  });
});

describe('accessible contrast across seeds, variants, modes, and contrast levels', () => {
  const failures: string[] = [];
  let checked = 0;

  for (const seed of SEED_HEXES) {
    for (const variant of SCHEME_VARIANTS) {
      for (const level of CONTRAST_LEVELS) {
        for (const isDark of [false, true]) {
          const colors: SchemeColors = schemeColors(buildScheme({ seed, variant, contrast: level }, isDark));
          const label = `${seed} ${variant} contrast=${level} ${isDark ? 'dark' : 'light'}`;
          for (const [bg, fg] of TEXT_PAIRS) {
            checked++;
            const ratio = contrast(colors[bg], colors[fg]);
            if (ratio < 4.5) failures.push(`${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}`);
          }
          for (const [bg, fg] of UI_PAIRS) {
            checked++;
            const ratio = contrast(colors[bg], colors[fg]);
            if (ratio < 3) failures.push(`${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}`);
          }
        }
      }
    }
  }

  it(`meets WCAG AA for text and 3:1 for outlines`, () => {
    expect(checked).toBeGreaterThan(10_000);
    expect(failures, failures.slice(0, 20).join('\n')).toEqual([]);
  });
});
