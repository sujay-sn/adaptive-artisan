import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COLOR_ROLES, roleToCssVar } from './engine';

// Guards against index.css drifting from the engine: every role the engine
// emits must be mapped into Tailwind, or its utilities silently do nothing.
const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

describe('Tailwind color mapping', () => {
  it('maps every MD3 role from the engine', () => {
    const missing = COLOR_ROLES.filter((role) => {
      const sys = roleToCssVar(role);
      return !css.includes(`${sys.replace('--md-sys-color-', '--color-')}: var(${sys});`);
    });
    expect(missing).toEqual([]);
  });
});