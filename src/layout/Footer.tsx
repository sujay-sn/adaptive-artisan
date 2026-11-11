import { useRef } from 'react';
import { profile, SECTIONS } from '@/content/profile';
import { RoomArt, RoomLights } from '@/footer/Room';
import { clockLabel, POSES, routineAt, skyAt, STATIONS } from '@/footer/routine';
import { useBostonTime } from '@/footer/useBostonTime';
import { WalkingPerson } from '@/footer/WalkingPerson';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useNearViewport } from '@/lib/useNearViewport';
import { usePreferences } from '@/preferences/store';
import { Button } from '@/ui/Button';
import { IconButton } from '@/ui/IconButton';
import { container } from './container';

const LINK =
  'text-title-medium text-on-surface decoration-2 underline-offset-[0.3em] transition-colors hover:text-primary hover:underline focus-visible:underline';
const HEADING = 'text-label-large text-on-surface-variant';

/**
 * The footer is Sujay's room, drawn edge to edge, with the content layered on
 * its wall. The window and the lights follow the actual time in Boston. On a
 * phone the room is cropped around wherever he is at the moment.
 */
export function Footer() {
  const time = useBostonTime();
  const block = routineAt(time);
  const sky = skyAt(time);

  const footer = useRef<HTMLElement>(null);
  const room = useRef<HTMLDivElement>(null);
  // He walks in once the footer is a good way onto the screen, not as it peeks in.
  const started = useNearViewport(footer, '0px 0px -30% 0px');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const paused = usePreferences((state) => state.ambientPaused);
  const setPaused = usePreferences((state) => state.setAmbientPaused);

  return (
    <footer
      ref={footer}
      className="md-footer relative isolate mx-3 mb-24 grid overflow-hidden rounded-[2rem] bg-surface-container text-on-surface expanded:mx-6 expanded:mb-6"
      data-sky={sky}
      data-block={block.id}
      data-paused={paused ? '' : undefined}
    >
      <div ref={room} className="md-room" aria-hidden="true">
        <div className="md-room-camera">
          <svg viewBox="0 0 1600 620" className="block size-full">
            <RoomArt time={time} sky={sky} block={block.id} />
            <WalkingPerson station={STATIONS[block.id]} pose={POSES[block.id]} started={started} still={reducedMotion} paused={paused} room={room} />
          </svg>
          <svg viewBox="0 0 1600 620" className="md-room-lights absolute inset-0 size-full">
            <RoomLights />
          </svg>
        </div>
        <div className="md-footer-dim pointer-events-none absolute inset-0" />
      </div>

      <div className={`md-footer-content ${container} relative grid gap-10 pt-10 expanded:grid-cols-[minmax(0,1fr)_auto] expanded:pt-14`}>
        <div className="max-w-[28rem]">
          {/* The same voice as the hero headline, so the page opens and closes on it. */}
          <p className="md-footer-name font-display text-display-small text-on-surface expanded:text-display-medium">{profile.name}</p>
          <p className="mt-2 font-display text-title-large text-on-surface-variant">
            {profile.role} in {profile.location}
          </p>
          <p className="mt-6 text-body-medium text-on-surface-variant">
            &copy; {new Date().getFullYear()}. Built as a working Material 3 Expressive system.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-8 large:gap-x-24">
          <div>
            <h2 className={HEADING}>Sections</h2>
            <ul className="mt-4 space-y-3">
              {SECTIONS.filter((section) => section.id !== 'home').map((section) => (
                <li key={section.id}>
                  <a className={LINK} href={`#${section.id}`}>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={HEADING}>Elsewhere</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a className={LINK} href={`mailto:${profile.email}`}>
                  Email
                </a>
              </li>
              <li>
                <a className={LINK} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a className={LINK} href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={`md-footer-bar ${container} relative pb-4 expanded:pb-6`}>
        <div className="flex items-center justify-between gap-4 rounded-full bg-surface-bright py-2 ps-6 pe-2 shadow-2">
          <p className="min-w-0 text-body-medium text-on-surface">
            <span className="text-label-large text-on-surface-variant tabular-nums">{clockLabel(time)} in Boston.</span>{' '}
            <span className="text-title-small">{block.caption}</span>
          </p>
          <div className="flex shrink-0 items-center gap-1">
            {!reducedMotion && (
              <IconButton
                icon={paused ? 'play_arrow' : 'pause'}
                label={paused ? 'Play animations' : 'Pause animations'}
                onClick={() => setPaused(!paused)}
              />
            )}
            {/* On a phone the label would squeeze the caption, so it becomes an icon. */}
            <IconButton
              icon="arrow_upward"
              label="Back to top"
              variant="tonal"
              className="medium:hidden"
              onClick={() => (window.location.hash = 'home')}
            />
            <Button href="#home" variant="tonal" icon="arrow_upward" className="max-medium:hidden">
              Back to top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
