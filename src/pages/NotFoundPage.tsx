import { container } from '@/layout/container';
import { projectsPath } from '@/router';
import { Button } from '@/ui/Button';

/** For addresses that don't lead anywhere: prerendered as 404.html. */
export function NotFoundPage() {
  return (
    <div className={`${container} flex min-h-[60dvh] flex-col justify-center py-24`}>
      <p className="text-label-large text-on-surface-variant">404</p>
      <h1 data-page-heading tabIndex={-1} className="mt-3 font-display text-display-small text-on-surface outline-none expanded:text-display-medium">
        This page doesn&rsquo;t exist
      </h1>
      <p className="mt-4 max-w-[50ch] text-body-large text-on-surface-variant">The link may be old, or the address may have a typo.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/" icon="home">
          Home
        </Button>
        <Button href={projectsPath()} variant="outlined" icon="folder">
          Projects
        </Button>
      </div>
    </div>
  );
}
