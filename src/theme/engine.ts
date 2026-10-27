// MD3 dynamic color engine.
//
// Pure functions only (no DOM), because this module runs in two places: in the
// browser when a visitor changes the theme, and in Node at build time, where the
// Vite plugin bakes the default theme into index.html so first paint is correct.
//
// Colors come from Google's material-color-utilities on the 2025 color spec.
// Each role is emitted once as `light-dark(<light>, <dark>)`, so switching
// between light and dark is just a `color-scheme` change, with no recompute.

import {
  argbFromHex,
  hexFromArgb,
  Hct,
  type DynamicScheme,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
} from '@material/material-color-utilities';

export const SCHEME_VARIANTS = [
  'tonalSpot',
  'expressive',
  'vibrant',
  'fidelity',
  'content',
  'rainbow',
  'fruitSalad',
  'neutral',
  'monochrome',
] as const;

export type SchemeVariant = (typeof SCHEME_VARIANTS)[number];

export interface ThemeSpec {
  /** Seed color as #rrggbb. */
  seed: string;
  variant: SchemeVariant;
  /** -1 (reduced) to 1 (high). 0 is the standard spec. */
  contrast: number;
}

/** Named seeds offered in the hero. Lagoon is the site default. */
export const SEEDS = [
  { id: 'lagoon', name: 'Lagoon', hex: '#0B7A75' },
  { id: 'marigold', name: 'Marigold', hex: '#E3A008' },
  { id: 'ultramarine', name: 'Ultramarine', hex: '#3D4FD6' },
  { id: 'raspberry', name: 'Raspberry', hex: '#C2185B' },
  { id: 'moss', name: 'Moss', hex: '#5B7F3A' },
] as const;

export const DEFAULT_THEME: ThemeSpec = {
  seed: SEEDS[0].hex,
  variant: 'tonalSpot',
  contrast: 0,
};

/** Every MD3 color role this site exports as a CSS custom property. */
export const COLOR_ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant', 'inversePrimary',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'background', 'onBackground',
  'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
  'surfaceDim', 'surfaceBright', 'surfaceTint',
  'surfaceContainerLowest', 'surfaceContainerLow', 'surfaceContainer',
  'surfaceContainerHigh', 'surfaceContainerHighest',
  'inverseSurface', 'inverseOnSurface',
  'outline', 'outlineVariant', 'shadow', 'scrim',
] as const;

export type ColorRole = (typeof COLOR_ROLES)[number];
export type SchemeColors = Record<ColorRole, string>;

const SCHEMES = {
  tonalSpot: SchemeTonalSpot,
  expressive: SchemeExpressive,
  vibrant: SchemeVibrant,
  fidelity: SchemeFidelity,
  content: SchemeContent,
  rainbow: SchemeRainbow,
  fruitSalad: SchemeFruitSalad,
  neutral: SchemeNeutral,
  monochrome: SchemeMonochrome,
} satisfies Record<SchemeVariant, unknown>;

const HEX = /^#[0-9a-f]{6}$/i;

export function isHexColor(value: string): boolean {
  return HEX.test(value);
}

export function buildScheme(spec: ThemeSpec, isDark: boolean): DynamicScheme {
  if (!isHexColor(spec.seed)) throw new Error(`Seed must be #rrggbb, got "${spec.seed}"`);
  const contrast = Math.min(1, Math.max(-1, spec.contrast));
  const Scheme = SCHEMES[spec.variant];
  return new Scheme(Hct.fromInt(argbFromHex(spec.seed)), isDark, contrast, '2025');
}

export function schemeColors(scheme: DynamicScheme): SchemeColors {
  const colors = {} as SchemeColors;
  for (const role of COLOR_ROLES) colors[role] = hexFromArgb(scheme[role]);
  return colors;
}

/** `surfaceContainerHigh` becomes `--md-sys-color-surface-container-high`. */
export function roleToCssVar(role: ColorRole): string {
  return `--md-sys-color-${role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

/** CSS declarations for every role, each as light-dark(light, dark). */
export function themeDeclarations(spec: ThemeSpec): string {
  const light = schemeColors(buildScheme(spec, false));
  const dark = schemeColors(buildScheme(spec, true));
  return COLOR_ROLES.map((role) => `${roleToCssVar(role)}: light-dark(${light[role]}, ${dark[role]});`).join('\n');
}

/** A complete stylesheet for the theme, scoped to `:root`. */
export function themeStylesheet(spec: ThemeSpec): string {
  return `:root {\n${themeDeclarations(spec)}\n}`;
}

export function sameTheme(a: ThemeSpec, b: ThemeSpec): boolean {
  return a.seed.toLowerCase() === b.seed.toLowerCase() && a.variant === b.variant && a.contrast === b.contrast;
}
