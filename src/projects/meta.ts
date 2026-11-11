import type { Project } from '@/content/projects';

/** "2025, 4 months, solo project", skipping whatever a project leaves out. */
export function projectMeta(project: Project): string {
  return [project.year, project.duration, project.team, project.status === 'in-progress' ? 'in progress' : undefined].filter(Boolean).join(', ');
}