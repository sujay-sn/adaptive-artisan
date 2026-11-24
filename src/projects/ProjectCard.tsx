// Lightweight motion elements; their animation features arrive through LazyMotion.
import * as m from 'motion/react-m';
import { useState } from 'react';
import type { Project } from '@/content/projects';
import { spring } from '@/motion/tokens';
import { projectPath } from '@/router';
import { projectMeta } from './meta';
import { MetricValue } from './MetricValue';
import { ProjectCover } from './ProjectCover';

const enter = spring('expressive', 'spatial', 'default');

/**
 * A project on the Projects page. Its position animates when filtering
 * reorders the grid, and its cover grows into the project's page when opened.
 * The whole card is one link (.md-card-link in index.css).
 */
export function ProjectCard({ project }: { project: Project }) {
  const [active, setActive] = useState(false);

  return (
    <m.article
      layout="position"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={enter}
      data-project-card={project.id}
      aria-labelledby={`${project.id}-title`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="md-project-card state-layer relative overflow-hidden rounded-xl bg-surface-container-highest text-on-surface transition-shadow hover:shadow-2"
    >
      <div data-morph>
        <ProjectCover project={project} playing={active} className="aspect-[16/9]" />
      </div>
      <div className="p-6 expanded:p-8">
        <h2 id={`${project.id}-title`} className="font-display text-headline-small">
          <a href={projectPath(project.id)} className="md-card-link">
            {project.title}
          </a>
        </h2>
        <p className="mt-1 text-label-large text-on-surface-variant">{projectMeta(project)}</p>
        <p className="mt-3 max-w-[60ch] text-body-large">{project.summary}</p>
        {project.headline && (
          <p className="mt-4 text-title-medium text-primary">
            <MetricValue value={project.headline.value} /> <span className="text-body-medium text-on-surface-variant">{project.headline.label}</span>
          </p>
        )}
        <p className="mt-4 text-label-medium text-on-surface-variant">{project.technologies.slice(0, 6).join(', ')}</p>
      </div>
    </m.article>
  );
}
