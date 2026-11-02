import { useRef, useState, type ChangeEvent } from 'react';
import { AssistChip } from '@/ui/Chip';
import { Switch } from '@/ui/Switch';
import { toggleColorScheme, useColorScheme } from './colorScheme';
import { SEEDS } from './engine';
import { originFromElement, withThemeReveal } from './reveal';
import { SeedSwatch } from './SeedSwatch';
import { useTheme } from './store';
import { extractWallpaper, saveWallpaper } from './wallpaper';

/** Seed swatches, theming from an image, and the light/dark switch. Every change plays the circular reveal. */
export function ThemeControls() {
  const seed = useTheme((state) => state.seed);
  const setTheme = useTheme((state) => state.setTheme);
  const { resolved } = useColorScheme();
  const imageButton = useRef<HTMLButtonElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('');

  const themeFromImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    setStatus('Reading colors from your image.');
    try {
      const extracted = await extractWallpaper(file);
      const best = extracted.seeds[0];
      if (best) withThemeReveal(originFromElement(imageButton.current), () => setTheme({ seed: best }));
      setStatus('Themed from your image. Personalize has more of its colors.');
      await saveWallpaper(extracted).catch(() => undefined);
    } catch {
      setStatus('That image could not be read. Try a JPEG, PNG, or WebP.');
    }
  };

  return (
    <div className="space-y-2">
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
          <AssistChip ref={imageButton} className="ms-2" label="From an image" icon="image" onClick={() => fileInput.current?.click()} />
          <input ref={fileInput} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(event) => void themeFromImage(event)} />
        </div>
        <Switch
          label="Dark theme"
          checked={resolved === 'dark'}
          onChange={(event) => withThemeReveal(originFromElement(event.currentTarget), toggleColorScheme)}
          onIcon="dark_mode"
          offIcon="light_mode"
        />
      </div>
      <p role="status" className="min-h-4 text-body-small text-on-surface-variant">
        {status}
      </p>
    </div>
  );
}