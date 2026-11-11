import { projects } from '@/content/projects';

/** Skills worth filtering projects by: the ones most projects share, most shared first. */
export function projectFilterSkills(limit = 8): string[] {
  const counts = new Map<string, number>();
  for (const project of projects) for (const skill of new Set(project.skills)) counts.set(skill, (counts.get(skill) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([skill]) => skill);
}