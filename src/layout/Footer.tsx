import { useRef } from 'react';
import { profile } from '@/content/profile';
import { RoutineScene } from '@/footer/RoutineScene';
import { useReveal } from '@/lib/useReveal';
import { Button } from '@/ui/Button';
import { container } from './container';

export function Footer() {
  const footer = useRef<HTMLElement>(null);
  useReveal(footer);

  return (
    <footer ref={footer} className="border-t border-outline-variant py-12 expanded:py-16">
      <div className={`${container} grid gap-10 expanded:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] expanded:items-center expanded:gap-16`}>
        <div>
          <p className="font-display text-headline-medium text-on-surface">{profile.name}</p>
          <p className="mt-1 text-body-large text-on-surface-variant">
            {profile.role} in {profile.location}
          </p>
          <div className="mt-5 -ms-3 flex flex-wrap gap-1">
            <Button href={`mailto:${profile.email}`} variant="text" icon="mail">
              Email
            </Button>
            <Button href={profile.linkedin} variant="text" icon="person">
              LinkedIn
            </Button>
            <Button href={profile.github} variant="text" icon="code">
              GitHub
            </Button>
          </div>
        </div>
        <RoutineScene />
      </div>

      <div className={`${container} mt-12 flex flex-wrap items-center justify-between gap-4`}>
        <p className="text-body-small text-on-surface-variant">
          &copy; {new Date().getFullYear()} {profile.name}. Built as a working Material 3 Expressive system.
        </p>
        <Button href="#home" variant="tonal" icon="arrow_upward">
          Back to top
        </Button>
      </div>
    </footer>
  );
}
