import { DEFAULT_ICON_AXES } from '@/preferences/store';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import type { IconName } from '@/ui/icons';
import { Slider } from '@/ui/Slider';
import { Switch } from '@/ui/Switch';
import { useDraft } from './draft';

const SAMPLES: IconName[] = ['home', 'palette', 'favorite', 'mail', 'work', 'school', 'code', 'hub'];

export function IconPanel() {
  const axes = useDraft((state) => state.iconAxes);
  const setIconAxes = useDraft((state) => state.setIconAxes);
  const resetIconAxes = () => setIconAxes(DEFAULT_ICON_AXES);
  const changed = (Object.keys(DEFAULT_ICON_AXES) as Array<keyof typeof DEFAULT_ICON_AXES>).some((key) => axes[key] !== DEFAULT_ICON_AXES[key]);

  return (
    <div className="space-y-8">
      <p className="max-w-[60ch] text-body-medium text-on-surface-variant">
        Material Symbols is a variable icon font, so fill, weight, grade, and optical size all change without swapping a single image. Icons that show a state, like the current section, keep their own fill.
      </p>
      <ul className="flex flex-wrap gap-3 text-on-surface" aria-label="Sample icons">
        {SAMPLES.map((name) => (
          <li key={name} className="grid size-16 place-items-center rounded-lg bg-surface-container-highest">
            <Icon name={name} size={40} fill={axes.fill} weight={axes.weight} grade={axes.grade} opticalSize={axes.opticalSize} />
          </li>
        ))}
      </ul>
      <Switch label="Fill" checked={axes.fill} onChange={(event) => setIconAxes({ fill: event.currentTarget.checked })} />
      <div className="grid gap-6 medium:grid-cols-3">
        <Slider label="Weight" value={axes.weight} min={100} max={700} onValueChange={(weight) => setIconAxes({ weight })} />
        <Slider label="Grade" value={axes.grade} min={-50} max={200} onValueChange={(grade) => setIconAxes({ grade })} />
        <Slider label="Optical size" value={axes.opticalSize} min={20} max={48} onValueChange={(opticalSize) => setIconAxes({ opticalSize })} />
      </div>
      <Button variant="text" disabled={!changed} onClick={resetIconAxes}>
        Reset icons
      </Button>
    </div>
  );
}