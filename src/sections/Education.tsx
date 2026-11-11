import type { CSSProperties } from 'react';
import { education } from '@/content/profile';
import { Section } from '@/layout/Section';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';

/** Degrees as cards, revealed in turn as they come into view (see .md-reveal). */
export function Education() {
  return (
    <Section id="education">
      <div className="grid items-start gap-6 large:grid-cols-2">
        {education.map((degree, index) => (
          <Card key={degree.id} as="article" variant="outlined" className="md-reveal rounded-xl p-6 expanded:p-8" style={{ '--i': index * 2 } as CSSProperties}>
            <p className="text-label-large text-on-surface-variant">{degree.period}</p>
            <h3 className="mt-2 text-title-large text-on-surface">{degree.degree}</h3>
            <p className="mt-1 text-body-medium text-on-surface-variant">
              {degree.school}, {degree.location}
            </p>
            <p className="mt-3 text-label-large text-primary">GPA {degree.gpa}</p>
            {degree.summary && <p className="mt-4 max-w-[65ch] text-body-large text-on-surface">{degree.summary}</p>}
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Coursework">
              {degree.coursework.map((course) => (
                <li key={course}>
                  <Chip label={course} />
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}