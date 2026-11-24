import { describe, expect, it } from 'vitest';
import { appearanceVars, iconAxesVars, scopedAppearanceVars, typeAxesVars, APPEARANCE_VARS } from './appearance';
import { DEFAULT_ICON_AXES, DEFAULT_TYPE_AXES } from './store';

describe('appearance variables', () => {
  it('sets nothing at the defaults, so the site keeps its small font cuts', () => {
    expect(appearanceVars(DEFAULT_TYPE_AXES, DEFAULT_ICON_AXES)).toEqual({});
  });

  it('makes weight a shift and width a scale, so hierarchy holds', () => {
    const vars = typeAxesVars({ ...DEFAULT_TYPE_AXES, wght: 116, wdth: 75 });
    expect(vars['--md-wght-shift']).toBe('-284');
    expect(vars['--md-wdth-scale']).toBe('0.75');
    expect(vars['--md-font-user']).toContain('Playground');
  });

  it('pins optical size only once it moves', () => {
    expect(typeAxesVars({ ...DEFAULT_TYPE_AXES, wght: 500 })['--md-fvs']).not.toContain('opsz');
    expect(typeAxesVars({ ...DEFAULT_TYPE_AXES, opsz: 30 })['--md-fvs']).toContain('"opsz" 30');
    expect(iconAxesVars({ ...DEFAULT_ICON_AXES, weight: 600 })).toEqual({ '--md-user-icon-wght': '600' });
    expect(iconAxesVars({ ...DEFAULT_ICON_AXES, opticalSize: 40 })).toEqual({ '--md-user-icon-opsz': '40' });
  });

  it('resets every variable in a draft scope, so it never inherits the applied look', () => {
    const scoped = scopedAppearanceVars(DEFAULT_TYPE_AXES, DEFAULT_ICON_AXES);
    expect(Object.keys(scoped).sort()).toEqual([...APPEARANCE_VARS].sort());
    expect(scoped['--md-wght-shift']).toBe('0');
    expect(scoped['--md-font-user']).toBe('initial');
    expect(scoped['--md-user-icon-fill']).toBe('initial');
  });

  it('carries the draft in a scope where it differs from the defaults', () => {
    const scoped = scopedAppearanceVars({ ...DEFAULT_TYPE_AXES, slnt: -10 }, { ...DEFAULT_ICON_AXES, fill: true });
    expect(scoped['--md-fvs']).toContain('"slnt" -10');
    expect(scoped['--md-user-icon-fill']).toBe('1');
    expect(scoped['--md-user-icon-wght']).toBe('initial');
  });
});
