import { copy, profile } from '@/content/profile';
import { projects } from '@/content/projects';
import type { Route } from '@/router';

export interface PageHead {
  title: string;
  description: string;
  /** A path in public/ for the share card; the site's default card when absent. */
  image?: string;
}

/**
 * Each page's title, description, and share image. Used for the browser tab as
 * pages change, and by the prerender for each page's HTML and share card, so
 * the two always agree.
 */
export function pageHead(route: Route): PageHead {
  const site = `${profile.name} | ${profile.title}`;
  switch (route.name) {
    case 'home':
      return { title: site, description: copy.pageDescription };
    case 'projects':
      return { title: `Projects | ${profile.name}`, description: copy.projectsIntro };
    case 'project': {
      const project = projects.find((p) => p.id === route.id);
      if (!project) return { title: site, description: copy.pageDescription };
      return { title: `${project.title} | ${profile.name}`, description: project.summary, image: project.media?.poster };
    }
    case 'not-found':
      return { title: `Page not found | ${profile.name}`, description: copy.pageDescription };
  }
}
