import type { CSSProperties } from 'react';
import { profile } from '@/content/profile';
import { usePreferences } from '@/preferences/store';
import { shapeClipPath } from '@/shape/shapes';

const FRAME = {
  '--avatar-rest': shapeClipPath('cookie9'),
  '--avatar-hover': shapeClipPath('sunny', Math.PI / 8),
} as CSSProperties;

/**
 * A portrait in an MD3 shape that breathes at rest and morphs on hover.
 * A monogram fills the frame until a photo exists.
 */
export function Avatar({ className = '' }: { className?: string }) {
  const paused = usePreferences((state) => state.ambientPaused);
  return (
    <div className={`md-avatar ${className}`} data-paused={paused ? '' : undefined}>
      <div className="md-avatar-frame" style={FRAME}>
        {profile.photo ? (
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center bg-primary-container text-on-primary-container" aria-hidden="true">
            <span className="font-display text-[clamp(4rem,10vw,7.5rem)] leading-none [font-stretch:80%]">SN</span>
          </div>
        )}
      </div>
    </div>
  );
}