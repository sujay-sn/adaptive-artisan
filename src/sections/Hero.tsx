import { useEffect, useRef, type PointerEvent } from 'react';
import { profile } from '@/content/profile';
import { container } from '@/layout/container';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { usePreferences } from '@/preferences/store';
import { bloom } from '@/theme/bloom';
import { ThemeControls } from '@/theme/ThemeControls';
import { Button } from '@/ui/Button';
import { IconButton } from '@/ui/IconButton';
import { HeroName } from './HeroName';
import { HeroShapes } from './HeroShapes';

/** Distance in px within which a headline letter responds to the cursor. */
const LETTER_REACH = 280;

/**
 * The hero: the name set large, live color controls beneath it, and the
 * shape cluster beside it. On fine pointers, the cursor drives parallax on
 * the shapes and the axes of each letter. First visits open with the bloom.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const paused = usePreferences((state) => state.ambientPaused);
  const setPaused = usePreferences((state) => state.setAmbientPaused);
  const interactive = finePointer && !reducedMotion;

  useEffect(() => {
    let cancelled = false;
    // Wait for the display font, so the headline springs into its final shape
    // rather than swapping mid-bloom, but never more than about a second.
    const fontsOrTimeout = Promise.race([document.fonts.ready, new Promise((resolve) => window.setTimeout(resolve, 1200))]);
    void fontsOrTimeout.then(() => {
      if (!cancelled) window.setTimeout(() => bloom(art.current), 250);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!interactive) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const root = section.current;
      if (!root) return;
      const box = root.getBoundingClientRect();
      root.style.setProperty('--px', (((clientX - box.left) / box.width) * 2 - 1).toFixed(3));
      root.style.setProperty('--py', (((clientY - box.top) / box.height) * 2 - 1).toFixed(3));
      for (const letter of root.querySelectorAll<HTMLElement>('.hero-letter')) {
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2));
        const reach = Math.max(0, 1 - distance / LETTER_REACH);
        letter.style.setProperty('--hover', (reach * reach * (3 - 2 * reach)).toFixed(3));
      }
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    const root = section.current;
    if (!root) return;
    root.style.setProperty('--px', '0');
    root.style.setProperty('--py', '0');
    for (const letter of root.querySelectorAll<HTMLElement>('.hero-letter')) letter.style.setProperty('--hover', '0');
  };

  return (
    <section
      ref={section}
      id="home"
      tabIndex={-1}
      aria-labelledby="home-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="hero relative isolate overflow-clip"
    >
      <div
        className={`${container} grid min-h-[90svh] items-end gap-y-10 pt-12 pb-16 expanded:min-h-svh expanded:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] expanded:items-center expanded:gap-x-12 expanded:py-16`}
      >
        <div className="relative z-10">
          <HeroName id="home-title" />
          <p className="mt-8 text-title-large text-on-surface">
            {profile.role} in {profile.location}
          </p>
          <p className="mt-3 max-w-[60ch] text-body-large text-on-surface-variant">{profile.summary}</p>
          <div className="mt-10">
            <ThemeControls />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.resumeUrl && (
              <Button href={profile.resumeUrl} icon="description">
                Resume
              </Button>
            )}
            <Button href={profile.github} variant="outlined" icon="code">
              GitHub
            </Button>
            <Button href={profile.linkedin} variant="outlined" icon="person">
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Behind the name on small screens, its own column from expanded up. */}
        <div
          ref={art}
          className="hero-art pointer-events-none absolute end-[-18%] top-6 -z-10 w-[80vw] max-w-[34rem] opacity-50 medium:opacity-70 expanded:relative expanded:end-auto expanded:top-auto expanded:z-0 expanded:w-full expanded:max-w-[44rem] expanded:justify-self-end expanded:opacity-100"
        >
          <HeroShapes paused={paused} animate={!reducedMotion} />
        </div>
      </div>

      {/* Anything that moves on its own for more than five seconds needs a way to stop it (WCAG 2.2.2). */}
      {!reducedMotion && (
        <div className="absolute end-3 top-3 z-10 expanded:top-auto expanded:end-6 expanded:bottom-6">
          <IconButton
            icon={paused ? 'play_arrow' : 'pause'}
            label={paused ? 'Play background animation' : 'Pause background animation'}
            onClick={() => setPaused(!paused)}
          />
        </div>
      )}
    </section>
  );
}
