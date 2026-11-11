// Lightweight motion elements; their animation features arrive through LazyMotion.
import * as m from 'motion/react-m';
import { useRef, useState } from 'react';
import type { Project } from '@/content/projects';
import { spring } from '@/motion/tokens';
import { Button } from '@/ui/Button';
import { projectMeta } from './meta';
import { ProjectCover } from './ProjectCover';
import { openProject } from './store';

const enter = spring('expressive', 'spatial', 'default');

/**
 * A project card. Its position animates when filtering reorders the grid,
 * and it morphs into the project's dialog when opened. A click anywhere on
 * the card opens it; keyboard users have the Details button.
 */
export function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  const card = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const open = () => void openProject(project.id, card.current);

  return (
    <m.article
      ref={card}
      layout="position"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={enter}
      aria-labelledby={`${project.id}-title`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest('a, button')) open();
      }}
      className={`md-project-card state-layer cursor-pointer overflow-hidden transition-shadow hover:shadow-2 ${
        featured ? 'rounded-xl bg-primary-container text-on-primary-container expanded:col-span-2 expanded:rounded-2xl' : 'rounded-xl bg-surface-container-highest text-on-surface'
      }`}
    >
      <ProjectCover project={project} playing={active} className={featured ? 'aspect-[16/9] expanded:aspect-[21/8]' : 'aspect-[16/9]'} />
      <div className="p-6 expanded:p-8">
        <h3 id={`${project.id}-title`} className="font-display text-headline-small">
          {project.title}
        </h3>
        <p className="mt-1 text-label-large opacity-80">{projectMeta(project)}</p>
        <p className="mt-3 max-w-[60ch] text-body-large">{project.summary}</p>
        <p className="mt-3 text-label-medium opacity-80">{project.technologies.slice(0, 6).join(', ')}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant={featured ? 'filled' : 'tonal'} aria-haspopup="dialog" onClick={open}>
            Details
          </Button>
          {project.demoUrl && (
            <Button href={project.demoUrl} variant="outlined" icon="open_in_new">
              Live demo
            </Button>
          )}
          {project.repoUrl && (
            <Button href={project.repoUrl} variant="outlined" icon="code">
              Source
            </Button>
          )}
        </div>
      </div>
    </m.article>
  );
}