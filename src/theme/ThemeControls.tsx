import { Switch } from '@/ui/Switch';
import { toggleColorScheme, useColorScheme } from './colorScheme';
import { SEEDS } from './engine';
import { originFromElement, withThemeReveal } from './reveal';
import { SeedSwatch } from './SeedSwatch';
import { useTheme } from './store';

/** Seed swatches and the light/dark switch. Every change plays the circular reveal. */
export function ThemeControls() {
  const seed = useTheme((state) => state.seed);
  const setTheme = useTheme((state) => state.setTheme);
  const { resolved } = useColorScheme();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Color theme">
        {SEEDS.map((option) => (
          <SeedSwatch
            key={option.id}
            hex={option.hex}
            label={`${option.name} color theme`}
            selected={option.hex.toLowerCase() === seed.toLowerCase()}
            onSelect={(element) => withThemeReveal(originFromElement(element), () => setTheme({ seed: option.hex }))}
          />
        ))}
      </div>
      <Switch
        label="Dark theme"
        checked={resolved === 'dark'}
        onChange={(event) => withThemeReveal(originFromElement(event.currentTarget), toggleColorScheme)}
        onIcon="dark_mode"
        offIcon="light_mode"
      />
    </div>
  );
}