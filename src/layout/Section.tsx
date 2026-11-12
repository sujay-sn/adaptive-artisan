import { useRef, type ReactNode } from 'react';
import { sectionLabel, type SectionId } from '@/content/profile';
import { useReveal } from '@/lib/useReveal';
import { container } from './container';

/**
 * A page section and its heading. The id comes from SECTIONS, so navigation
 * always matches, and any .md-reveal inside it animates in on arrival. The
 * heading leads: it arrives light and condensed and springs out to its
 * resting weight and width (.md-section-title in index.css).
 */
export function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  useReveal(section);
  return (
    <section ref={section} id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className="py-16 expanded:py-24">
      <div className={container}>
        <h2 id={`${id}-title`} className="md-reveal md-section-title font-display text-headline-large text-on-surface expanded:text-display-small">
          {sectionLabel(id)}
        </h2>
        <div className="mt-8 expanded:mt-12">{children}</div>
      </div>
    </section>
  );
}