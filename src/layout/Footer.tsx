import { profile } from '@/content/profile';
import { Button } from '@/ui/Button';
import { container } from './container';

export function Footer() {
  return (
    <footer className="border-t border-outline-variant py-12">
      <div className={`${container} grid gap-8 medium:grid-cols-[minmax(0,1fr)_auto] medium:items-end`}>
        <div>
          <p className="font-display text-headline-small text-on-surface">{profile.name}</p>
          <p className="mt-1 text-body-medium text-on-surface-variant">
            {profile.role} in {profile.location}
          </p>
          <div className="mt-4 -ms-3 flex flex-wrap gap-1">
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
        <div className="flex flex-col items-start gap-3 medium:items-end">
          <Button href="#home" variant="tonal" icon="arrow_upward">
            Back to top
          </Button>
          <p className="text-body-small text-on-surface-variant">
            &copy; {new Date().getFullYear()} {profile.name}. Built as a working Material 3 Expressive system.
          </p>
        </div>
      </div>
    </footer>
  );
}