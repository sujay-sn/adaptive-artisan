import { useState, type CSSProperties } from 'react';
import { projects } from '@/content/projects';
import { container } from '@/layout/container';
import { Gallery } from '@/projects/Gallery';
import { projectMeta } from '@/projects/meta';
import { ProjectCover } from '@/projects/ProjectCover';
import { projectPath, projectsPath } from '@/router';
import { Button } from '@/ui/Button';
import { Chip } from '@/ui/Chip';
import { Icon } from '@/ui/Icon';

/** Stagger index: the page arrives in reading order (see .md-stagger). */
const order = (index: number) => ({ '--i': index }) as CSSProperties;

function List({ title, items, index }: { title: string; items: string[]; index: number }) {
  if (items.length === 0) return null;
  return (
    <section className="md-stagger" style={order(index)}>
      <h2 className="text-title-large text-on-surface">{title}</h2>
      <ul className="mt-4 max-w-[65ch] list-disc space-y-3 ps-5 text-body-large text-on-surface-variant marker:text-primary">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

/**
 * A project's own page: the cover (which its card grows into), the story,
 * its gallery, and a way on to the next project.
 */
export function ProjectPage({ id }: { id: string }) {
  const index = projects.findIndex((project) => project.id === id);
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const [shareStatus, setShareStatus] = useState('');
  if (!project) return null;

  const share = async () => {
    const url = new URL(projectPath(project.id), window.location.origin).toString();
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: project.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareStatus('Link copied');
    } catch {
      // The share sheet was dismissed, or the clipboard is unavailable.
    }
  };

  return (
    <article className={`${container} pt-6 pb-24 expanded:pt-10`} aria-labelledby="project-title">
      <Button href={projectsPath()} variant="text" icon="arrow_back">
        All projects
      </Button>

      <div data-project-hero className="md-project-hero mt-4 aspect-[16/9] overflow-hidden rounded-2xl expanded:aspect-[21/9] expanded:rounded-[2.5rem]">
        <ProjectCover project={project} playing className="size-full" />
      </div>

      <header className="mt-10 grid gap-10 large:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] large:items-end">
        <div className="md-stagger" style={order(0)}>
          <h1 id="project-title" data-page-heading tabIndex={-1} className="font-display text-display-small text-on-surface outline-none expanded:text-display-medium">
            {project.title}
          </h1>
          <p className="mt-3 text-title-medium text-on-surface-variant">{[project.role, projectMeta(project)].filter(Boolean).join(', ')}</p>
          <p className="mt-6 max-w-[65ch] text-body-large text-on-surface">{project.description}</p>
        </div>
        {project.headline && (
          <div className="md-stagger rounded-2xl bg-primary-container p-6 text-on-primary-container" style={order(1)}>
            <p className="font-display text-display-small">{project.headline.value}</p>
            <p className="mt-2 text-body-medium">{project.headline.label}</p>
          </div>
        )}
      </header>

      <div className="md-stagger mt-8 flex flex-wrap items-center gap-3" style={order(2)}>
        {project.demoUrl && (
          <Button href={project.demoUrl} icon="open_in_new">
            Live demo
          </Button>
        )}
        {project.repoUrl && (
          <Button href={project.repoUrl} variant="outlined" icon="code">
            Source
          </Button>
        )}
        <Button variant="text" icon="share" onClick={() => void share()}>
          Share
        </Button>
        <p role="status" className="text-body-small text-primary">
          {shareStatus}
        </p>
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="md-stagger mt-16" style={order(3)}>
          <h2 id="gallery-title" className="text-title-large text-on-surface">
            Gallery
          </h2>
          <div className="mt-4">
            <Gallery items={project.gallery} />
          </div>
        </section>
      )}

      <div className="mt-16 grid gap-12 expanded:grid-cols-2">
        <List title="Results" items={project.results} index={4} />
        <List title="What it does" items={project.features} index={5} />
        <List title="Challenges" items={project.challenges} index={6} />
        <section className="md-stagger" style={order(7)}>
          <h2 className="text-title-large text-on-surface">Built with</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <li key={technology}>
                <Chip label={technology} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {next && next.id !== project.id && (
        <nav aria-label="More projects" className="mt-20 border-t border-outline-variant pt-8">
          <a href={projectPath(next.id)} className="group inline-flex flex-col gap-1 rounded-xl">
            <span className="text-label-large text-on-surface-variant">Next project</span>
            <span className="inline-flex items-center gap-3 font-display text-headline-medium text-on-surface group-hover:text-primary">
              {next.title} <Icon name="arrow_forward" />
            </span>
          </a>
        </nav>
      )}
    </article>
  );
}
