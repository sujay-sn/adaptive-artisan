import { projects, type Project } from '@/content/projects';

/** Up to six projects for the home page: the ones marked featured, in order, or else the first six. */
export function featuredProjects(): Project[] {
  const flagged = projects.filter((project) => project.featured);
  return (flagged.length > 0 ? flagged : projects).slice(0, 6);
}
