import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { Project } from '@/content/projects';
import { Button } from '@/ui/Button';
import { Chip } from '@/ui/Chip';
import { IconButton } from '@/ui/IconButton';
import { projectMeta } from './meta';
import { ProjectCover } from './ProjectCover';
import { projectUrl } from './store';

/** Stagger index: dialog content arrives in reading order (see .md-stagger). */
const order = (index: number) => ({ '--i': index }) as CSSProperties;

function List({ title, items, index }: { title: string; items: string[]; index: number }) {
  if (items.length === 0) return null;
  return (
    <section className="md-stagger" style={order(index)}>
      <h3 className="text-title-medium text-on-surface">{title}</h3>
      <ul className="mt-3 max-w-[65ch] list-disc space-y-2 ps-5 text-body-medium text-on-surface-variant marker:text-primary">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

/**
 * A project in full: cover on one side, the story on the other. Opened by
 * the card's container transform; Esc, a click outside, the close button, and
 * the browser's back button all close it.
 */
export function ProjectDialog({ project, onRequestClose }: { project: Project | null; onRequestClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [shareStatus, setShareStatus] = useState('');
  const open = project !== null;

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const share = async () => {
    if (!project) return;
    const url = projectUrl(project.id);
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
    <dialog
      ref={ref}
      closedby="any"
      aria-labelledby="project-dialog-title"
      className="md-dialog md-project-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onRequestClose();
      }}
      onClose={() => setShareStatus('')}
    >
      {project && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto expanded:grid expanded:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] expanded:overflow-hidden">
          <ProjectCover project={project} playing className="aspect-[16/9] shrink-0 expanded:aspect-auto expanded:h-full" />
          <div className="expanded:min-h-0 expanded:overflow-y-auto">
            <header className="md-stagger sticky top-0 z-10 flex items-start gap-1 bg-surface-container-high ps-6 pe-3 pt-5 pb-3" style={order(0)}>
              <div className="min-w-0 flex-1 pt-1">
                <h2 id="project-dialog-title" className="font-display text-headline-small text-on-surface">
                  {project.title}
                </h2>
                <p className="mt-1 text-label-large text-on-surface-variant">{projectMeta(project)}</p>
              </div>
              <IconButton icon="share" label={`Share a link to ${project.title}`} onClick={() => void share()} />
              <IconButton icon="close" label="Close" onClick={onRequestClose} />
            </header>
            <p role="status" className="px-6 text-body-small text-primary">
              {shareStatus}
            </p>
            <div className="space-y-8 px-6 pt-2 pb-8">
              <p className="md-stagger max-w-[65ch] text-body-large text-on-surface" style={order(1)}>
                {project.description}
              </p>
              <List title="Results" items={project.results} index={2} />
              <List title="What it does" items={project.features} index={3} />
              <List title="Challenges" items={project.challenges} index={4} />
              <section className="md-stagger" style={order(5)}>
                <h3 className="text-title-medium text-on-surface">Built with</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <li key={technology}>
                      <Chip label={technology} />
                    </li>
                  ))}
                </ul>
              </section>
              {(project.demoUrl || project.repoUrl) && (
                <div className="md-stagger flex flex-wrap gap-3" style={order(6)}>
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}