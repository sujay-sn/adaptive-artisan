import type { CSSProperties } from 'react';
import { experience } from '@/content/profile';
import { Section } from '@/layout/Section';
import { graphNode } from '@/skills/graph';
import { useSkillStore } from '@/skills/store';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';
import { Icon } from '@/ui/Icon';

/** Stagger index for the storytelling reveal (see .md-story in index.css). */
const story = (index: number) => ({ '--i': index }) as CSSProperties;

/**
 * A timeline of roles. As each card scrolls in, its parts arrive in reading
 * order, and the line draws itself down the page. Selecting a skill in the
 * constellation marks the roles that used it.
 */
export function Experience() {
  const selected = useSkillStore((state) => state.selected);
  const skillName = selected ? graphNode(selected)?.label : undefined;

  return (
    <Section id="experience">
      <ol className="md-timeline space-y-10 expanded:space-y-14">
        {experience.map((job) => {
          const match = selected !== null && job.skills.includes(selected);
          return (
            <li key={job.id} className="md-timeline-item relative grid gap-3 ps-8 expanded:grid-cols-[11rem_minmax(0,1fr)] expanded:gap-10 expanded:ps-0">
              <span className="md-timeline-dot" aria-hidden="true" />
              <p className="md-story pt-0.5 text-label-large text-on-surface-variant tabular-nums" style={story(0)}>
                {job.period}
              </p>
              <Card variant="outlined" className={`rounded-xl p-6 expanded:p-8 ${match ? 'ring-2 ring-primary' : ''}`}>
                <div className="md-story" style={story(1)}>
                  <h3 className="text-title-large text-on-surface">
                    {job.title}, {job.company}
                  </h3>
                  <p className="mt-1 text-body-medium text-on-surface-variant">
                    {job.type}, {job.location}
                  </p>
                </div>
                {match && skillName && (
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary-container py-1 ps-2 pe-3 text-label-medium text-on-secondary-container">
                    <Icon name="check" size={16} />
                    Uses {skillName}
                  </p>
                )}
                <p className="md-story mt-4 max-w-[65ch] text-body-large text-on-surface" style={story(2)}>
                  {job.summary}
                </p>
                <ul className="mt-4 max-w-[65ch] list-disc space-y-2 ps-5 text-body-medium text-on-surface-variant marker:text-primary">
                  {job.highlights.map((highlight, index) => (
                    <li key={highlight} className="md-story" style={story(3 + index)}>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <ul className="md-story mt-5 flex flex-wrap gap-2" aria-label="Technologies" style={story(3 + job.highlights.length)}>
                  {job.technologies.map((technology) => (
                    <li key={technology}>
                      <Chip label={technology} />
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}