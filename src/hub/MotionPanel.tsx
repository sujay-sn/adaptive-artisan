import { useState } from 'react';
import { SPRINGS, springEasing, type MotionScheme } from '@/motion/tokens';
import { usePreferences } from '@/preferences/store';
import { playCue } from '@/sound/cues';
import { Button } from '@/ui/Button';
import { ChoiceChips } from '@/ui/ChoiceChips';
import { Switch } from '@/ui/Switch';

const SCHEMES: ReadonlyArray<{ value: MotionScheme; label: string }> = [
  { value: 'expressive', label: 'Expressive' },
  { value: 'standard', label: 'Standard' },
];

// The chart's y range leaves room above 1 for overshoot.
const Y_MAX = 1.25;
const toY = (value: number) => 110 - (value / Y_MAX) * 100;

export function MotionPanel() {
  const scheme = usePreferences((state) => state.motionScheme);
  const setMotionScheme = usePreferences((state) => state.setMotionScheme);
  const sound = usePreferences((state) => state.sound);
  const setSound = usePreferences((state) => state.setSound);
  const [moved, setMoved] = useState(false);

  const curve = springEasing(SPRINGS[scheme].spatial.default);
  const samples = curve.easing.slice('linear('.length, -1).split(', ').map(Number);
  const points = samples.map((value, index) => `${((index / (samples.length - 1)) * 200).toFixed(1)},${toY(value).toFixed(1)}`).join(' ');

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <ChoiceChips legend="Motion scheme" name="hub-motion" value={scheme} options={SCHEMES} onChange={(value) => setMotionScheme(value)} />
        <p className="max-w-[60ch] text-body-medium text-on-surface-variant">
          Expressive springs overshoot and settle with a little bounce. Standard springs are calmer. Every component on the site switches with you.
        </p>
      </div>

      <figure className="space-y-2">
        <svg viewBox="0 0 200 120" role="img" aria-label={`Spatial spring, settling in ${curve.duration} milliseconds`} className="w-full max-w-md overflow-visible">
          <line x1="0" x2="200" y1={toY(1)} y2={toY(1)} className="stroke-outline-variant" strokeDasharray="4 4" />
          <polyline points={points} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <figcaption className="text-body-small text-on-surface-variant">
          Default spatial spring: position over time, settling in {curve.duration} ms. The dashed line is the target.
        </figcaption>
      </figure>

      <div className="space-y-4">
        <div className="md-motion-track relative h-14 rounded-full bg-surface-container-highest">
          <span className="md-motion-puck absolute top-2 left-2 size-10 rounded-full bg-primary" data-moved={moved || undefined} />
        </div>
        <Button variant="tonal" onClick={() => setMoved((value) => !value)}>
          Play the spring
        </Button>
      </div>

      <div className="space-y-2">
        <Switch
          label="Sound effects"
          checked={sound}
          onChange={(event) => {
            const on = event.currentTarget.checked;
            setSound(on);
            if (on) playCue('success');
          }}
        />
        <p className="text-body-small text-on-surface-variant">Short tones when the theme changes and when this panel opens or closes. Off unless you turn them on.</p>
      </div>
    </div>
  );
}