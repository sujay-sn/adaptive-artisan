import { loadPlaygroundFont, PLAYGROUND_FONT } from '@/hub/playgroundFont';
import { DEFAULT_TYPE_AXES, type TypeAxes } from './store';

// The Type tab's axes, applied to the whole site through custom properties on
// <html> that index.css reads. Weight and width are relative: every rule keeps
// its own value and the visitor's choice shifts or scales it, so headings stay
// heavier than body text and the hero still swells under the cursor. Slant,
// grade, roundness, and optical size are a shared base that rules with their
// own axes (the hero, the footer name, field notches) append to.
//
// The pre-paint script in index.html mirrors typeAxesVars so a returning
// visitor never sees the defaults first. typeAxes.test.ts keeps the two in sync.

export const TYPE_AXES_VARS = ['--md-wght-shift', '--md-wdth-scale', '--md-fvs', '--md-font-user'] as const;

export function isCustomType(axes: TypeAxes): boolean {
  return (Object.keys(DEFAULT_TYPE_AXES) as Array<keyof TypeAxes>).some((key) => axes[key] !== DEFAULT_TYPE_AXES[key]);
}

/** The custom properties for a set of axes, or null when they are all at their defaults. */
export function typeAxesVars(axes: TypeAxes): Record<(typeof TYPE_AXES_VARS)[number], string> | null {
  if (!isCustomType(axes)) return null;
  const fvs = [`"slnt" ${axes.slnt}`, `"GRAD" ${axes.GRAD}`, `"ROND" ${axes.ROND}`];
  // Left alone, optical size follows each element's font size, which beats any
  // single value. It is pinned only once the visitor moves it.
  if (axes.opsz !== DEFAULT_TYPE_AXES.opsz) fvs.push(`"opsz" ${axes.opsz}`);
  return {
    '--md-wght-shift': String(axes.wght - DEFAULT_TYPE_AXES.wght),
    '--md-wdth-scale': String(axes.wdth / DEFAULT_TYPE_AXES.wdth),
    '--md-fvs': fvs.join(', '),
    // The small cuts carry only weight, width, and roundness, so custom type
    // needs the full font. It is the one the Type tab already loads.
    '--md-font-user': `"${PLAYGROUND_FONT}"`,
  };
}

export function applyTypeAxes(axes: TypeAxes): void {
  const style = document.documentElement.style;
  const vars = typeAxesVars(axes);
  if (!vars) {
    for (const name of TYPE_AXES_VARS) style.removeProperty(name);
    return;
  }
  loadPlaygroundFont();
  for (const name of TYPE_AXES_VARS) style.setProperty(name, vars[name]);
}
