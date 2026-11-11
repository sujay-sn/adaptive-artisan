import { useEffect, useRef, useState, type ComponentType } from 'react';
import { usePreferences } from '@/preferences/store';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useMinuteClock } from '@/lib/useMinuteClock';
import { IconButton } from '@/ui/IconButton';
import { bostonClock, routineAt, type RoutineId } from './routine';
import { ProjectsScene } from './scenes';

// Scenes drawn so far. A block without its own scene borrows the projects one
// and its caption, so the picture and the words never disagree.
const SCENES: Partial<Record<RoutineId, ComponentType>> = {
  projects: ProjectsScene,
};

const WAVE_MS = 1800;

/**
 * What Sujay is probably doing right now, on Boston time. Pressing the scene
 * makes him wave. Two small loops (a blink, code typing in) follow the
 * site-wide pause, and reduced motion shows the scene still.
 */
export function RoutineScene() {
  const now = useMinuteClock();
  const block = routineAt(now);
  const Scene = SCENES[block.id] ?? ProjectsScene;
  const caption = SCENES[block.id] ? block.caption : 'Working on a project.';

  const paused = usePreferences((state) => state.ambientPaused);
  const setPaused = usePreferences((state) => state.setAmbientPaused);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [waving, setWaving] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const wave = () => {
    window.clearTimeout(timer.current);
    // Restart the wave from the top if it's pressed again mid-wave.
    setWaving(false);
    requestAnimationFrame(() => {
      setWaving(true);
      timer.current = window.setTimeout(() => setWaving(false), WAVE_MS);
    });
  };

  return (
    <figure className="md-reveal md-routine relative" data-paused={paused ? '' : undefined} data-waving={waving ? '' : undefined}>
      <button type="button" onClick={wave} aria-label="Wave hello" className="md-routine-button block w-full cursor-pointer rounded-[1.75rem]">
        <div className="md-routine-scene">
          <svg viewBox="0 0 360 200" className="block h-auto w-full" aria-hidden="true">
            <Scene />
          </svg>
        </div>
      </button>
      <figcaption className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-label-large text-on-surface-variant tabular-nums">{bostonClock(now)} in Boston</p>
          <p className="mt-1 text-body-large text-on-surface">{caption}</p>
        </div>
        {!reducedMotion && (
          <IconButton
            icon={paused ? 'play_arrow' : 'pause'}
            label={paused ? 'Play animations' : 'Pause animations'}
            onClick={() => setPaused(!paused)}
          />
        )}
      </figcaption>
    </figure>
  );
}
