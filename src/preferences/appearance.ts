import { loadPlaygroundFont, PLAYGROUND_FONT } from '@/hub/playgroundFont';
import { DEFAULT_ICON_AXES, DEFAULT_TYPE_AXES, type IconAxes, type TypeAxes } from './store';

// The visitor's type and icon axes, carried by custom properties that index.css
// reads. The applied set goes on <html>; the Personalization Hub sets a draft
// set on its preview pane, an element marked [data-type-scope], so the draft
// shows there and nowhere else until it is applied.
//
// Type weight and width are relative: every rule keeps its own value and the
// visitor's choice shifts or scales it, so headings stay heavier than body
// text and the hero still swells under the cursor. Slant, grade, roundness,
// and a moved optical size form a shared variation base that rules with their
// own axes (the hero, the footer name, field notches) append to.
//
// Icons take the visitor's axes wherever an icon doesn't set its own; icons
// whose fill carries state (the current section, a selected toggle) keep it.

const TYPE_VARS = ['--md-wght-shift', '--md-wdth-scale', '--md-fvs', '--md-font-user'] as const;
const ICON_VARS = ['--md-user-icon-fill', '--md-user-icon-wght', '--md-user-icon-grad', '--md-user-icon-opsz'] as const;
export const APPEARANCE_VARS: readonly string[] = [...TYPE_VARS, ...ICON_VARS];

/** Read by the pre-paint script in index.html. Keep the key in sync. */
const CACHE_KEY = 'md-appearance';

export type AppearanceVars = Record<string, string>;

export function isCustomType(axes: TypeAxes): boolean {
  return (Object.keys(DEFAULT_TYPE_AXES) as Array<keyof TypeAxes>).some((key) => axes[key] !== DEFAULT_TYPE_AXES[key]);
}

export function sameIconAxes(a: IconAxes, b: IconAxes): boolean {
  return (Object.keys(DEFAULT_ICON_AXES) as Array<keyof IconAxes>).every((key) => a[key] === b[key]);
}

export function sameTypeAxes(a: TypeAxes, b: TypeAxes): boolean {
  return (Object.keys(DEFAULT_TYPE_AXES) as Array<keyof TypeAxes>).every((key) => a[key] === b[key]);
}

/** Type variables, or none at all when every axis is at its default. */
export function typeAxesVars(axes: TypeAxes): AppearanceVars {
  if (!isCustomType(axes)) return {};
  const fvs = [`"slnt" ${axes.slnt}`, `"GRAD" ${axes.GRAD}`, `"ROND" ${axes.ROND}`];
  // Left alone, optical size follows each element's font size, which beats any
  // single value. It is pinned only once the visitor moves it.
  if (axes.opsz !== DEFAULT_TYPE_AXES.opsz) fvs.push(`"opsz" ${axes.opsz}`);
  return {
    '--md-wght-shift': String(axes.wght - DEFAULT_TYPE_AXES.wght),
    '--md-wdth-scale': String(axes.wdth / DEFAULT_TYPE_AXES.wdth),
    '--md-fvs': fvs.join(', '),
    // The small cuts carry only weight, width, and roundness, so custom type
    // needs the full font, the one the Type tab already loads.
    '--md-font-user': `"${PLAYGROUND_FONT}"`,
  };
}

/** Icon variables, one per axis that differs from its default. */
export function iconAxesVars(axes: IconAxes): AppearanceVars {
  const vars: AppearanceVars = {};
  if (axes.fill !== DEFAULT_ICON_AXES.fill) vars['--md-user-icon-fill'] = axes.fill ? '1' : '0';
  if (axes.weight !== DEFAULT_ICON_AXES.weight) vars['--md-user-icon-wght'] = String(axes.weight);
  if (axes.grade !== DEFAULT_ICON_AXES.grade) vars['--md-user-icon-grad'] = String(axes.grade);
  // Left alone, optical size follows each icon's size, as with type.
  if (axes.opticalSize !== DEFAULT_ICON_AXES.opticalSize) vars['--md-user-icon-opsz'] = String(axes.opticalSize);
  return vars;
}

export function appearanceVars(type: TypeAxes, icon: IconAxes): AppearanceVars {
  return { ...typeAxesVars(type), ...iconAxesVars(icon) };
}

/**
 * Every variable, for a subtree that previews a draft: anything at its default
 * goes back to neutral, so the subtree never inherits the applied look. A
 * custom property set to `initial` is unset, so its var() fallbacks apply.
 */
export function scopedAppearanceVars(type: TypeAxes, icon: IconAxes): AppearanceVars {
  const neutral: AppearanceVars = { '--md-wght-shift': '0', '--md-wdth-scale': '1', '--md-fvs': '"GRAD" 0' };
  for (const name of APPEARANCE_VARS) neutral[name] ??= 'initial';
  return { ...neutral, ...appearanceVars(type, icon) };
}

/** Puts the applied axes on <html> and caches them for the next visit's pre-paint script. */
export function applyAppearance(type: TypeAxes, icon: IconAxes): void {
  const vars = appearanceVars(type, icon);
  const style = document.documentElement.style;
  for (const name of APPEARANCE_VARS) style.removeProperty(name);
  for (const [name, value] of Object.entries(vars)) style.setProperty(name, value);
  if (isCustomType(type)) loadPlaygroundFont();
  try {
    if (Object.keys(vars).length > 0) localStorage.setItem(CACHE_KEY, JSON.stringify(vars));
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // Storage blocked: the look still applies for this visit.
  }
}
