import { Switch } from '@/ui/Switch';
import { toggleColorScheme, useColorScheme } from './colorScheme';
import { SEEDS } from './engine';
import { useTheme } from './store';

// Seed swatches and the light/dark switch. The hero's designed version, with
// the circular reveal and image picker, replaces the swatches later.
export function ThemeControls() {
  const seed = useTheme((state) => state.seed);
  const setTheme = useTheme((state) => state.setTheme);
  const { resolved } = useColorScheme();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Color theme">
        {SEEDS.map((option) => {
          const active = option.hex.toLowerCase() === seed.toLowerCase();
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              aria-label={`${option.name} color theme`}
              onClick={() => setTheme({ seed: option.hex })}
              className="state-layer grid size-12 cursor-pointer place-items-center rounded-full text-on-surface"
            >
              <span
                className={`block size-8 rounded-full ${active ? 'outline-2 outline-offset-2 outline-on-surface' : ''}`}
                style={{ backgroundColor: option.hex }}
              />
            </button>
          );
        })}
      </div>
      <Switch label="Dark theme" checked={resolved === 'dark'} onChange={toggleColorScheme} onIcon="dark_mode" offIcon="light_mode" />
    </div>
  );
}