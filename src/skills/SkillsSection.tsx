import { lazy, Suspense, useRef, useState, type CSSProperties } from 'react';
import { SKILL_CATEGORIES, type SkillCategory } from '@/content/skills';
import { Section } from '@/layout/Section';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useNearViewport } from '@/lib/useNearViewport';
import { ChoiceChips } from '@/ui/ChoiceChips';
import { SkillDetail } from './SkillDetail';
import { SkillList } from './SkillList';

// The pile and its physics load only as the section nears the viewport.
const SkillPile = lazy(() => import('./SkillPile'));

/** Holds the pile's place, at its size, until its code arrives. */
function EmptyJar() {
  return <div className="md-pile" aria-hidden="true" />;
}

type View = 'pile' | 'list';

const VIEWS: ReadonlyArray<{ value: View; label: string }> = [
  { value: 'pile', label: 'Pile' },
  { value: 'list', label: 'List' },
];

/** One word each, so the row stays a single line of large type. The full names stay in the evidence panel. */
const SHORT: Record<SkillCategory, string> = {
  languages: 'Languages',
  frontend: 'Frontend',
  backend: 'Backend',
  data: 'Data',
  ai: 'AI',
  tools: 'Tools',
  fundamentals: 'Fundamentals',
};

/**
 * The categories as large type. The chosen one stretches out to full width and
 * weight while the rest pull in, and the pile below follows it.
 */
function CategoryFilter({ value, onChange, everything }: { value: SkillCategory | null; onChange: (value: SkillCategory | null) => void; everything: boolean }) {
  const options: ReadonlyArray<{ id: SkillCategory | null; label: string }> = [
    ...(everything ? [{ id: null, label: 'Everything' }] : []),
    ...SKILL_CATEGORIES.map((category) => ({ id: category.id, label: SHORT[category.id] })),
  ];
  return (
    <div role="group" aria-label="Show skills by category" className="md-kinetic-filter font-display text-title-large expanded:text-headline-small">
      {options.map((option) => (
        <button key={option.label} type="button" aria-pressed={value === option.id} onClick={() => onChange(option.id)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function SkillsSection() {
  const [view, setView] = useState<View>('pile');
  const [category, setCategory] = useState<SkillCategory | null>(null);
  // A phone-sized jar holds one category at a time; wider ones hold everything.
  const narrow = useMediaQuery('(width < 40rem)');
  const shown = narrow ? (category ?? SKILL_CATEGORIES[0]!.id) : category;
  const holder = useRef<HTMLDivElement>(null);
  const near = useNearViewport(holder, '800px');

  return (
    <Section id="skills">
      <div className="md-reveal flex flex-wrap items-end justify-between gap-x-10 gap-y-6" style={{ '--i': 1 } as CSSProperties}>
        <p className="max-w-[60ch] text-body-large text-on-surface-variant">
          Everything I work with, in one jar, drawn from the roles and projects on this page. Pick one up and throw it, or tap it to see where I used it.
        </p>
        <ChoiceChips legend="View" name="skills-view" value={view} options={VIEWS} onChange={(value) => setView(value)} />
      </div>
      <div className="md-reveal mt-8 grid items-start gap-6 xlarge:grid-cols-[minmax(0,1fr)_20rem]" style={{ '--i': 2 } as CSSProperties}>
        <div ref={holder} className="min-w-0">
          {view === 'pile' ? (
            <>
              <CategoryFilter value={shown} onChange={setCategory} everything={!narrow} />
              {near ? (
                <Suspense fallback={<EmptyJar />}>
                  {narrow ? <SkillPile key={shown ?? 'all'} category={null} only={shown} /> : <SkillPile category={category} />}
                </Suspense>
              ) : (
                <EmptyJar />
              )}
            </>
          ) : (
            <SkillList />
          )}
        </div>
        {/* Beside the pile on extra-large screens, above it on tablets, and below it on phones, where a
            panel stuck to the top of the screen would cover the categories. */}
        <SkillDetail className="z-10 expanded:max-xlarge:order-first xlarge:sticky xlarge:top-6" />
      </div>
    </Section>
  );
}
