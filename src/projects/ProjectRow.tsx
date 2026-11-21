import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Project } from '@/content/projects';
import { projectPath } from '@/router';
import { panelClipPath, shapeClipPath, type ShapeName } from '@/shape/shapes';
import { Icon } from '@/ui/Icon';
import { projectMeta } from './meta';
import { ProjectCover } from './ProjectCover';

// Each row's cover rests in its own shape, tilted alternately, and opens out
// into the panel when the row is hovered or focused.
const RESTING: readonly ShapeName[] = ['cookie9', 'softBurst', 'cookie12', 'sunny', 'cookie6', 'flower'];
const OPEN = panelClipPath();

/**
 * A featured project on the home page: an editorial row with the cover on one
 * side (alternating) and the story on the other, leading with its headline
 * result. The whole row is one link to the project's page, which the cover
 * grows into.
 */
export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [active, setActive] = useState(false);
  const tilt = index % 2 === 0 ? '-4deg' : '4deg';
  const media = {
    '--rest': shapeClipPath(RESTING[index % RESTING.length] ?? 'cookie9', index * 0.4),
    '--open': OPEN,
    '--tilt': tilt,
    '--i': index + 1,
  } as CSSProperties;

  return (
    <article
      data-project-card={project.id}
      aria-labelledby={`${project.id}-row-title`}
      className="md-reveal md-project-row relative grid items-center gap-8 expanded:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] expanded:gap-12"
      style={media}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <div className="md-row-media relative aspect-[4/3]">
        <div data-morph className="md-row-mask absolute inset-0 overflow-hidden">
          <ProjectCover project={project} playing={active} className="size-full" />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-label-large text-on-surface-variant tabular-nums">{String(index + 1).padStart(2, '0')}</p>
        <h3 id={`${project.id}-row-title`} className="mt-2 font-display text-headline-medium text-on-surface expanded:text-display-small">
          {/* Stretched over the whole row (.md-row-link in index.css), so the row is one link. */}
          <a href={projectPath(project.id)} className="md-row-link">
            {project.title}
          </a>
        </h3>
        <p className="mt-3 max-w-[50ch] text-body-large text-on-surface-variant">{project.summary}</p>
        {project.headline ? (
          <div className="mt-6">
            <p className="md-row-metric font-display text-display-small text-primary">{project.headline.value}</p>
            <p className="mt-1 max-w-[40ch] text-label-large text-on-surface-variant">{project.headline.label}</p>
          </div>
        ) : (
          <p className="mt-6 text-label-large text-on-surface-variant">{[project.role, projectMeta(project)].filter(Boolean).join(', ')}</p>
        )}
        <p className="mt-6 text-label-medium text-on-surface-variant">{project.technologies.slice(0, 5).join(', ')}</p>
        <p aria-hidden="true" className="mt-6 inline-flex items-center gap-2 text-label-large text-primary">
          View project <Icon name="arrow_forward" size={18} />
        </p>
      </div>
    </article>
  );
}
