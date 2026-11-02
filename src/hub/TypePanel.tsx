import { DEFAULT_TYPE_AXES, usePreferences, type TypeAxes } from '@/preferences/store';
import { Button } from '@/ui/Button';
import { Slider } from '@/ui/Slider';
import { PLAYGROUND_FONT, usePlaygroundFont } from './playgroundFont';

const AXES: ReadonlyArray<{ key: keyof TypeAxes; label: string; min: number; max: number }> = [
  { key: 'wght', label: 'Weight', min: 1, max: 1000 },
  { key: 'wdth', label: 'Width', min: 25, max: 151 },
  { key: 'opsz', label: 'Optical size', min: 6, max: 144 },
  { key: 'slnt', label: 'Slant', min: -10, max: 0 },
  { key: 'GRAD', label: 'Grade', min: 0, max: 100 },
  { key: 'ROND', label: 'Roundness', min: 0, max: 100 },
];

export function TypePanel() {
  const axes = usePreferences((state) => state.typeAxes);
  const setTypeAxes = usePreferences((state) => state.setTypeAxes);
  const resetTypeAxes = usePreferences((state) => state.resetTypeAxes);
  const font = usePlaygroundFont();
  const style = {
    fontFamily: `"${PLAYGROUND_FONT}", var(--font-display)`,
    fontVariationSettings: AXES.map(({ key }) => `"${key}" ${axes[key]}`).join(', '),
  };
  const changed = AXES.some(({ key }) => axes[key] !== DEFAULT_TYPE_AXES[key]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="max-w-[60ch] text-body-medium text-on-surface-variant">
          Google Sans Flex is the typeface of Material 3 Expressive. Every axis below is live.
        </p>
        <p role="status" className="text-body-small text-on-surface-variant">
          {font === 'loading' && 'Loading the full font with all six axes (about 1.4 MB).'}
          {font === 'error' && 'The full font did not load, so some axes have no effect.'}
        </p>
      </div>
      <div className="space-y-4 overflow-hidden text-on-surface">
        <p className="text-[clamp(3rem,7vw,5.5rem)] leading-none break-words" style={style}>
          Adaptive Artisan
        </p>
        <p className="text-[1.25rem] leading-8" style={style}>
          The quick brown fox jumps over the lazy dog. 0123456789
        </p>
      </div>
      <div className="grid gap-6 medium:grid-cols-2">
        {AXES.map((axis) => (
          <Slider
            key={axis.key}
            label={`${axis.label} (${axis.key})`}
            value={axes[axis.key]}
            min={axis.min}
            max={axis.max}
            onValueChange={(value) => setTypeAxes({ [axis.key]: value } as Partial<TypeAxes>)}
          />
        ))}
      </div>
      <Button variant="text" disabled={!changed} onClick={resetTypeAxes}>
        Reset axes
      </Button>
    </div>
  );
}