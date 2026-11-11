import { useEffect, useRef, type CSSProperties } from 'react';
import type { Project } from '@/content/projects';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { SHAPE_NAMES, shapeClipPath } from '@/shape/shapes';

// Full class names, so Tailwind can see them.
const TONES = [
  { surface: 'bg-primary-container text-on-primary-container', shape: 'bg-primary', accent: 'bg-tertiary-container' },
  { surface: 'bg-secondary-container text-on-secondary-container', shape: 'bg-secondary', accent: 'bg-primary-container' },
  { surface: 'bg-tertiary-container text-on-tertiary-container', shape: 'bg-tertiary', accent: 'bg-secondary-container' },
] as const;

function hash(text: string): number {
  let value = 0;
  for (const character of text) value = (value * 31 + character.charCodeAt(0)) >>> 0;
  return value;
}

interface ProjectCoverProps {
  project: Project;
  /** Plays the cover's video, if it has one, unless motion is reduced. */
  playing?: boolean;
  className?: string;
}

/**
 * A project's cover. With media, its screenshot, plus a short loop that plays
 * while `playing`. Without, generated art: two MD3 shapes in theme colors,
 * chosen from the project's id, which morph when the card is hovered.
 */
export function ProjectCover({ project, playing = false, className = '' }: ProjectCoverProps) {
  const video = useRef<HTMLVideoElement>(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shouldPlay = playing && !reducedMotion;

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (shouldPlay) void element.play().catch(() => undefined);
    else element.pause();
  }, [shouldPlay]);

  if (project.media) {
    return (
      <div className={`relative overflow-hidden bg-surface-container ${className}`}>
        <img src={project.media.poster} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
        {project.media.video && (
          <video ref={video} src={project.media.video} poster={project.media.poster} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
        )}
      </div>
    );
  }

  const seed = hash(project.id);
  const tone = TONES[seed % TONES.length] ?? TONES[0];
  const shape = (offset: number) => SHAPE_NAMES[(seed + offset) % SHAPE_NAMES.length] ?? 'circle';
  const initials = project.title
    .split(/\s+/)
    .map((word) => word[0] ?? '')
    .join('')
    .slice(0, 2);

  return (
    <div
      aria-hidden="true"
      className={`md-cover relative overflow-hidden ${tone.surface} ${className}`}
      style={
        {
          '--cover-a': shapeClipPath(shape(0)),
          '--cover-a-hover': shapeClipPath(shape(5)),
          '--cover-b': shapeClipPath(shape(2)),
          '--cover-b-hover': shapeClipPath(shape(9)),
        } as CSSProperties
      }
    >
      <span className={`md-cover-shape md-cover-shape-a ${tone.shape}`} />
      <span className={`md-cover-shape md-cover-shape-b ${tone.accent}`} />
      <span className="md-cover-initials font-display">{initials}</span>
    </div>
  );
}