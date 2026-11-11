import type { CSSProperties } from 'react';
import { education, type Degree } from '@/content/profile';
import { Section } from '@/layout/Section';
import { degreeProgress } from '@/lib/degreeProgress';
import { shapeClipPath, type ShapeName } from '@/shape/shapes';
import { Chip } from '@/ui/Chip';
import { Icon } from '@/ui/Icon';

// Full class names, so Tailwind can see them. The degree in progress leads in
// primary; finished ones step back to secondary. Not tertiary: the 2025 color
// spec makes tertiary-container a bright accent in dark mode, which would let
// a finished degree outshine the current one.
const LOOKS = {
  current: { rest: 'softBurst', hover: 'verySunny', medallion: 'bg-primary-container text-on-primary-container' },
  complete: { rest: 'cookie6', hover: 'cookie12', medallion: 'bg-secondary-container text-on-secondary-container' },
} as const satisfies Record<string, { rest: ShapeName; hover: ShapeName; medallion: string }>;

/**
 * Degrees as rows: a shape medallion holding the GPA, the degree and its
 * status, and the coursework. The degree in progress shows how far along it
 * is, and turns into a completed one on its own once its last month ends.
 */
export function Education() {
  return (
    <Section id="education">
      <ol className="space-y-6">
        {education.map((degree, index) => (
          <DegreeRow key={degree.id} degree={degree} index={index} />
        ))}
      </ol>
    </Section>
  );
}

function DegreeRow({ degree, index }: { degree: Degree; index: number }) {
  const progress = degreeProgress(degree.start, degree.end);
  const look = progress.complete ? LOOKS.complete : LOOKS.current;
  const [score, scale = '4.0'] = degree.gpa.split('/').map((part) => part.trim());
  const shapes = {
    '--i': index * 2,
    '--degree-rest': shapeClipPath(look.rest),
    '--degree-hover': shapeClipPath(look.hover, Math.PI / 10),
  } as CSSProperties;

  return (
    <li
      className="md-reveal md-degree grid grid-cols-[5rem_minmax(0,1fr)] gap-x-5 gap-y-6 rounded-2xl bg-surface-container-low p-6 text-on-surface expanded:grid-cols-[8rem_minmax(0,1fr)] expanded:gap-x-8 expanded:p-8 large:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] large:gap-x-10"
      style={shapes}
    >
      <div className={`md-degree-shape grid aspect-square place-content-center text-center ${look.medallion}`}>
        <p className="text-label-small expanded:text-label-medium">GPA</p>
        <p className="font-display text-title-large tabular-nums expanded:text-headline-large">{score}</p>
        <p className="text-label-small expanded:text-label-medium">of {scale}</p>
      </div>

      <div className="min-w-0">
        <Status complete={progress.complete} />
        <h3 className="mt-3 text-title-large text-on-surface expanded:text-headline-small">{degree.degree}</h3>
        <p className="mt-1 text-body-medium text-on-surface-variant">
          {degree.school}, {degree.location}
        </p>
        <p className="mt-1 text-body-medium text-on-surface-variant tabular-nums">{degree.period}</p>
        {degree.summary && <p className="mt-4 max-w-[65ch] text-body-large text-on-surface">{degree.summary}</p>}
        {!progress.complete && (
          <div className="mt-6 max-w-md">
            <WavyProgress fraction={progress.fraction} />
            <p className="mt-2 text-label-large text-on-surface-variant">Graduating {progress.endLabel}</p>
          </div>
        )}
      </div>

      <div className="col-span-2 expanded:col-span-1 expanded:col-start-2 large:col-start-3 large:row-start-1">
        <h4 className="text-label-large text-on-surface-variant">Coursework</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {degree.coursework.map((course) => (
            <li key={course}>
              <Chip label={course} />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function Status({ complete }: { complete: boolean }) {
  if (complete) {
    return (
      <p className="inline-flex h-7 items-center gap-1.5 rounded-full ps-2 pe-3 text-label-large text-on-surface-variant shadow-[inset_0_0_0_1px_var(--md-sys-color-outline-variant)]">
        <Icon name="check" size={18} />
        Completed
      </p>
    );
  }
  return (
    <p className="inline-flex h-7 items-center gap-2 rounded-full bg-secondary-container px-3 text-label-large text-on-secondary-container">
      <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
      In progress
    </p>
  );
}

/**
 * MD3 Expressive linear progress: a wavy active indicator, a gap, then a flat
 * track ending in a stop dot. Decorative, since the line under it gives the
 * graduation date, so it stays out of the accessibility tree.
 */
function WavyProgress({ fraction }: { fraction: number }) {
  return (
    <div className="md-wavy-progress" style={{ '--value': fraction } as CSSProperties} aria-hidden="true">
      <span className="md-wavy-progress-active" />
      <span className="md-wavy-progress-track" />
    </div>
  );
}
