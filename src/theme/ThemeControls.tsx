import { Icon } from '@/ui/Icon';
import { toggleColorScheme, useColorScheme } from './colorScheme';
import { SEEDS } from './engine';
import { useTheme } from './store';

// Day 1 controls: plain, honest buttons that exercise the theme engine.
// The designed versions (hero swatches, MD3 Switch, circular reveal) replace
// these on Days 2 to 4.
export function ThemeControls() {
  const seed = useTheme((state) => state.seed);
  const setTheme = useTheme((state) => state.setTheme);
  const { resolved } = useColorScheme();
  const next = resolved === 'dark' ? 'light' : 'dark';

  return (
    <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Site theme">
      {SEEDS.map((option) => {
        const active = option.hex.toLowerCase() === seed.toLowerCase();
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            aria-label={`${option.name} color theme`}
            onClick={() => setTheme({ seed: option.hex })}
            className="grid size-12 place-items-center rounded-full hover:bg-on-surface/8"
          >
            <span
              className={`block size-8 rounded-full ${active ? 'outline-2 outline-offset-2 outline-on-surface' : ''}`}
              style={{ backgroundColor: option.hex }}
            />
          </button>
        );
      })}
      <button
        type="button"
        onClick={toggleColorScheme}
        className="ms-2 grid size-12 place-items-center rounded-full text-on-surface-variant hover:bg-on-surface/8"
      >
        <Icon name={resolved === 'dark' ? 'dark_mode' : 'light_mode'} />
        <span className="sr-only">Switch to {next} mode</span>
      </button>
    </div>
  );
}