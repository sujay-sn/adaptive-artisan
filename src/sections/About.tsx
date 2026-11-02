import { profile } from '@/content/profile';
import { Section } from '@/layout/Section';
import { Button } from '@/ui/Button';
import { Avatar } from './Avatar';

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-10 expanded:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] expanded:gap-16">
        <Avatar className="w-full max-w-[18rem] expanded:max-w-[24rem] expanded:justify-self-center" />
        <div className="max-w-[65ch] space-y-5 text-body-large text-on-surface">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {profile.resumeUrl && (
            <div className="pt-3">
              <Button href={profile.resumeUrl} variant="tonal" icon="description">
                Read my resume
              </Button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}