import type { ReactNode } from 'react';
import { sectionLabel, type SectionId } from '@/content/profile';
import { container } from './container';

/** A page section and its heading. The id comes from SECTIONS, so navigation always matches. */
export function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className="py-16 expanded:py-24">
      <div className={container}>
        <h2 id={`${id}-title`} className="font-display text-headline-large text-on-surface expanded:text-display-small">
          {sectionLabel(id)}
        </h2>
        <div className="mt-8 expanded:mt-12">{children}</div>
      </div>
    </section>
  );
}