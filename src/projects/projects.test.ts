import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { projectFilterSkills } from './filters';
import { projectIdFromSearch } from './store';

describe('project deep links', () => {
  it('reads a known project from the query string', () => {
    const id = projects[0]?.id ?? '';
    expect(projectIdFromSearch(`?project=${id}`)).toBe(id);
  });

  it('ignores unknown or missing projects', () => {
    expect(projectIdFromSearch('?project=not-a-project')).toBeNull();
    expect(projectIdFromSearch('')).toBeNull();
  });
});

describe('project filters', () => {
  it('offers only skills that some project uses, most shared first', () => {
    const skills = projectFilterSkills();
    const count = (skill: string) => projects.filter((project) => project.skills.includes(skill)).length;
    expect(skills.length).toBeGreaterThan(0);
    for (const skill of skills) expect(count(skill)).toBeGreaterThan(0);
    for (let i = 1; i < skills.length; i += 1) expect(count(skills[i - 1] ?? '')).toBeGreaterThanOrEqual(count(skills[i] ?? ''));
  });
});