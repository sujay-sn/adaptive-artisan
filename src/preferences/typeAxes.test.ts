import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DEFAULT_TYPE_AXES, type TypeAxes } from './store';
import { isCustomType, TYPE_AXES_VARS, typeAxesVars } from './typeAxes';

// The pre-paint script in index.html repeats typeAxesVars so saved type shows
// before the app starts. Run it against fake browser globals and compare.
const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const prePaint = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? '';

function runPrePaint(typeAxes: Partial<TypeAxes> | undefined): Record<string, string> {
  const set: Record<string, string> = {};
  const saved = JSON.stringify({ state: { typeAxes } });
  const element = { content: '', setAttribute() {}, hasAttribute: () => true, removeAttribute() {} };
  const document = {
    querySelector: () => element,
    createElement: () => ({}),
    head: { appendChild() {} },
    documentElement: { ...element, style: { setProperty: (name: string, value: string) => (set[name] = value) } },
  };
  const localStorage = { getItem: (key: string) => (key === 'md-preferences' ? saved : null) };
  const sessionStorage = { getItem: () => '1' };
  new Function('document', 'localStorage', 'sessionStorage', 'location', 'matchMedia', 'setTimeout', prePaint)(
    document,
    localStorage,
    sessionStorage,
    { search: '' },
    () => ({ matches: true }),
    () => 0,
  );
  return set;
}

const SAMPLES: Array<Partial<TypeAxes>> = [
  { wght: 116, slnt: -10, opsz: 70 },
  { wdth: 73 },
  { ROND: 100, GRAD: 40 },
  { wght: 1000, wdth: 151, opsz: 6, slnt: -3, GRAD: 100, ROND: 55 },
];

describe('type axes', () => {
  it('sets nothing at the defaults, so the site keeps its small font cuts', () => {
    expect(isCustomType(DEFAULT_TYPE_AXES)).toBe(false);
    expect(typeAxesVars(DEFAULT_TYPE_AXES)).toBeNull();
    expect(runPrePaint(DEFAULT_TYPE_AXES)).toEqual({});
    expect(runPrePaint(undefined)).toEqual({});
  });

  it('pins optical size only once it moves', () => {
    expect(typeAxesVars({ ...DEFAULT_TYPE_AXES, wght: 500 })?.['--md-fvs']).not.toContain('opsz');
    expect(typeAxesVars({ ...DEFAULT_TYPE_AXES, opsz: 30 })?.['--md-fvs']).toContain('"opsz" 30');
  });

  it.each(SAMPLES)('matches the pre-paint script for %o', (sample) => {
    const vars = typeAxesVars({ ...DEFAULT_TYPE_AXES, ...sample });
    expect(vars).not.toBeNull();
    expect(Object.keys(vars!).sort()).toEqual([...TYPE_AXES_VARS].sort());
    expect(runPrePaint(sample)).toEqual(vars);
  });

  it('matches the pre-paint defaults', () => {
    for (const [key, value] of Object.entries(DEFAULT_TYPE_AXES)) {
      expect(prePaint).toContain(`${key}: ${value}`);
    }
  });
});
