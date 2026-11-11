import { profile, SECTIONS } from '@/content/profile';
import { RoomArt, RoomLights } from '@/footer/Room';
import { clockLabel, routineAt, skyAt, STATIONS } from '@/footer/routine';
import { useBostonTime } from '@/footer/useBostonTime';
import { Button } from '@/ui/Button';
import type { CSSProperties } from 'react';
import { container } from './container';

const LINK = 'text-body-large text-on-surface underline-offset-4 hover:underline focus-visible:underline';

/**
 * The footer is Sujay's room, drawn edge to edge, with the content layered on
 * its wall. The window and the lights follow the actual time in Boston. On a
 * phone the room is cropped around wherever he is at the moment.
 */
export function Footer() {
  const time = useBostonTime();
  const block = routineAt(time);
  const sky = skyAt(time);

  return (
    <footer
      className="md-footer relative isolate mx-3 mb-24 grid overflow-hidden rounded-[2rem] bg-surface-container text-on-surface expanded:mx-6 expanded:mb-6"
      data-sky={sky}
      data-block={block.id}
    >
      <div className="md-room" style={{ '--cam': STATIONS[block.id] / 1600 } as CSSProperties} aria-hidden="true">
        <div className="md-room-camera">
          <svg viewBox="0 0 1600 620" className="block size-full">
            <RoomArt time={time} sky={sky} />
          </svg>
          <svg viewBox="0 0 1600 620" className="md-room-lights absolute inset-0 size-full">
            <RoomLights />
          </svg>
        </div>
        <div className="md-footer-dim pointer-events-none absolute inset-0" />
      </div>

      <div className={`md-footer-content ${container} relative grid gap-10 pt-10 expanded:grid-cols-[minmax(0,1fr)_auto] expanded:pt-14`}>
        <div>
          <p className="font-display text-headline-large text-on-surface">{profile.name}</p>
          <p className="mt-1 text-body-large text-on-surface-variant">
            {profile.role} in {profile.location}
          </p>
          <p className="mt-6 text-body-small text-on-surface-variant">
            &copy; {new Date().getFullYear()} {profile.name}. Built as a working Material 3 Expressive system.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-8">
          <div>
            <h2 className="text-title-small text-on-surface-variant">Sections</h2>
            <ul className="mt-3 space-y-2">
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
            <h2 className="text-title-small text-on-surface-variant">Elsewhere</h2>
            <ul className="mt-3 space-y-2">
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
            <span className="text-label-large text-on-surface-variant tabular-nums">{clockLabel(time)} in Boston.</span> {block.caption}
          </p>
          <Button href="#home" variant="tonal" icon="arrow_upward" className="shrink-0">
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}
