import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { toggleColorScheme, useColorScheme } from '@/theme/colorScheme';
import { DEFAULT_THEME, normalizeHex, PALETTE_NAMES, PALETTE_TONES, SEEDS, tonalPalettes, type PaletteName, type SchemeVariant, type ThemeSpec } from '@/theme/engine';
import { originFromElement, withThemeReveal } from '@/theme/reveal';
import { SeedSwatch } from '@/theme/SeedSwatch';
import { useTheme } from '@/theme/store';
import { extractWallpaper, forgetWallpaper, loadWallpaper, saveWallpaper } from '@/theme/wallpaper';
import { Button } from '@/ui/Button';
import { ChoiceChips } from '@/ui/ChoiceChips';
import { IconButton } from '@/ui/IconButton';
import { Switch } from '@/ui/Switch';
import { TextField } from '@/ui/TextField';

const VARIANTS: ReadonlyArray<{ value: SchemeVariant; label: string }> = [
  { value: 'tonalSpot', label: 'Tonal spot' },
  { value: 'expressive', label: 'Expressive' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'fidelity', label: 'Fidelity' },
  { value: 'content', label: 'Content' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'fruitSalad', label: 'Fruit salad' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'monochrome', label: 'Monochrome' },
];

// The three levels Android offers, and the three the contrast tests cover.
const CONTRAST = [
  { value: '0', label: 'Standard' },
  { value: '0.5', label: 'Medium' },
  { value: '1', label: 'High' },
] as const;

const PALETTE_LABELS: Record<PaletteName, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  neutralVariant: 'Neutral variant',
  error: 'Error',
};

function Heading({ id, children }: { id: string; children: string }) {
  return (
    <h3 id={id} className="text-title-medium text-on-surface">
      {children}
    </h3>
  );
}

export function ColorPanel() {
  const seed = useTheme((state) => state.seed);
  const variant = useTheme((state) => state.variant);
  const contrast = useTheme((state) => state.contrast);
  const setTheme = useTheme((state) => state.setTheme);
  const { resolved } = useColorScheme();

  // Text in the hex field while it is being edited; null shows the current seed.
  const [draft, setDraft] = useState<string | null>(null);
  const [wallpaper, setWallpaper] = useState<{ url: string; seeds: string[] } | null>(null);
  const [status, setStatus] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);

  const palettes = tonalPalettes({ seed, variant, contrast });

  const choose = (element: Element | null, patch: Partial<ThemeSpec>) => withThemeReveal(originFromElement(element), () => setTheme(patch));

  const showWallpaper = (thumbnail: Blob, seeds: string[]) => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(thumbnail);
    setWallpaper({ url: objectUrl.current, seeds });
  };

  useEffect(() => {
    let cancelled = false;
    loadWallpaper()
      .then((saved) => {
        if (!saved || cancelled) return;
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = URL.createObjectURL(saved.thumbnail);
        setWallpaper({ url: objectUrl.current, seeds: saved.seeds });
      })
      .catch(() => {
        // No saved image, or IndexedDB is unavailable. Nothing to show.
      });
    return () => {
      cancelled = true;
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    setStatus('Reading colors from the image.');
    try {
      const extracted = await extractWallpaper(file);
      showWallpaper(extracted.thumbnail, extracted.seeds);
      const best = extracted.seeds[0];
      if (best) setTheme({ seed: best });
      const count = extracted.seeds.length;
      setStatus(`Found ${count} ${count === 1 ? 'color' : 'colors'}. Using the first.`);
      await saveWallpaper(extracted).catch(() => setStatus('Using the image, but it could not be saved for next time.'));
    } catch {
      setStatus('That image could not be read. Try a JPEG, PNG, or WebP.');
    }
  };

  const forget = async () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setWallpaper(null);
    setStatus('Image removed.');
    await forgetWallpaper().catch(() => undefined);
  };

  const draftInvalid = draft !== null && draft.trim() !== '' && normalizeHex(draft) === null;

  return (
    <div className="space-y-10">
      <section aria-labelledby="hub-seed" className="space-y-4">
        <Heading id="hub-seed">Seed color</Heading>
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Suggested colors">
          {SEEDS.map((option) => (
            <SeedSwatch
              key={option.id}
              hex={option.hex}
              label={`${option.name} color theme`}
              selected={option.hex.toLowerCase() === seed.toLowerCase()}
              onSelect={(element) => choose(element, { seed: option.hex })}
            />
          ))}
        </div>
        <div className="flex items-start gap-4">
          <input
            type="color"
            aria-label="Pick any color"
            value={seed.toLowerCase()}
            onChange={(event) => setTheme({ seed: event.currentTarget.value })}
            className="md-color-input"
          />
          <TextField
            className="min-w-0 flex-1"
            label="Hex"
            variant="outlined"
            value={draft ?? seed}
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
            supportingText="Any color, as #RGB or #RRGGBB"
            errorText="Use #RGB or #RRGGBB"
            invalid={draftInvalid}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setDraft(value);
              const hex = normalizeHex(value);
              if (hex) setTheme({ seed: hex });
            }}
            onBlur={() => setDraft(null)}
          />
        </div>
        <Switch
          label="Dark theme"
          checked={resolved === 'dark'}
          onChange={(event) => withThemeReveal(originFromElement(event.currentTarget), toggleColorScheme)}
          onIcon="dark_mode"
          offIcon="light_mode"
        />
      </section>

      <section aria-labelledby="hub-image" className="space-y-4">
        <Heading id="hub-image">From an image</Heading>
        <p className="max-w-[60ch] text-body-medium text-on-surface-variant">
          Pick a photo and the theme takes its colors, the way Android themes itself from your wallpaper. The image stays on this device.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => void handleFile(event)}
        />
        <Button variant="tonal" icon="add" onClick={() => fileInput.current?.click()}>
          Choose an image
        </Button>
        {wallpaper && (
          <div className="flex flex-wrap items-center gap-4">
            <img src={wallpaper.url} alt="The image you chose" className="size-24 rounded-lg object-cover" />
            <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Colors from your image">
              {wallpaper.seeds.map((hex, index) => (
                <SeedSwatch
                  key={hex}
                  hex={hex}
                  label={`Image color ${index + 1}, ${hex}`}
                  selected={hex.toLowerCase() === seed.toLowerCase()}
                  onSelect={(element) => choose(element, { seed: hex })}
                />
              ))}
            </div>
            <IconButton icon="close" label="Remove the image" onClick={() => void forget()} />
          </div>
        )}
        <p role="status" className="text-body-small text-on-surface-variant">
          {status}
        </p>
      </section>

      <ChoiceChips
        legend="Scheme"
        name="hub-variant"
        value={variant}
        options={VARIANTS}
        onChange={(value, event) => choose(event.currentTarget.closest('label'), { variant: value })}
      />

      <ChoiceChips
        legend="Contrast"
        name="hub-contrast"
        value={String(contrast)}
        options={CONTRAST}
        onChange={(value, event) => choose(event.currentTarget.closest('label'), { contrast: Number(value) })}
      />

      <section aria-labelledby="hub-palettes" className="space-y-4">
        <Heading id="hub-palettes">Tonal palettes</Heading>
        <p className="max-w-[60ch] text-body-medium text-on-surface-variant">
          Every color on the site is one tone from one of these six palettes, all generated from the seed.
        </p>
        <div className="space-y-3">
          {PALETTE_NAMES.map((name) => (
            <div key={name}>
              <p className="mb-1 text-label-medium text-on-surface-variant">{PALETTE_LABELS[name]}</p>
              <div role="img" aria-label={`${PALETTE_LABELS[name]} palette, tones 0 to 100`} className="grid grid-cols-13 overflow-hidden rounded-md">
                {palettes[name].map((hex, index) => (
                  <span key={PALETTE_TONES[index]} className="h-9" style={{ backgroundColor: hex }} title={`Tone ${PALETTE_TONES[index]}: ${hex}`} />
                ))}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-13 text-center text-label-small text-on-surface-variant tabular-nums" aria-hidden="true">
            {PALETTE_TONES.map((tone) => (
              <span key={tone}>{tone}</span>
            ))}
          </div>
        </div>
      </section>

      <Button variant="text" onClick={(event) => choose(event.currentTarget, DEFAULT_THEME)}>
        Reset to Lagoon
      </Button>
    </div>
  );
}
