import { profile } from '@/content/profile';

// One span per letter, so each letter can respond to the cursor on its own
// weight, width, and roundness (see .hero-letter in index.css). The heading
// carries the real name for assistive tech; the letters are presentation.
const LINES = ['Sujay', 'S N'];

export function HeroName({ id }: { id: string }) {
  return (
    <h1 id={id} aria-label={profile.name} className="hero-name font-display text-hero text-primary">
      {LINES.map((line) => (
        <span key={line} className="block" aria-hidden="true">
          {[...line].map((character, index) =>
            character === ' ' ? (
              ' '
            ) : (
              <span key={index} className="hero-letter inline-block">
                {character}
              </span>
            ),
          )}
        </span>
      ))}
    </h1>
  );
}