import { describe, expect, it } from 'vitest';
import { projects } from '@/content/projects';
import { featuredProjects } from '@/projects/featured';
import { legacyProjectId, projectPath, projectsPath, routeOf } from './router';

describe('routes', () => {
  it('reads the home page, with or without a trailing slash', () => {
    expect(routeOf('/')).toEqual({ name: 'home' });
    expect(routeOf('')).toEqual({ name: 'home' });
  });

  it('reads the Projects page and its skill filter', () => {
    expect(routeOf('/projects/')).toEqual({ name: 'projects', skill: null });
    expect(routeOf('/projects', '?skill=react')).toEqual({ name: 'projects', skill: 'react' });
  });

  it('reads a project page only for a project that exists', () => {
    const id = projects[0]!.id;
    expect(routeOf(projectPath(id))).toEqual({ name: 'project', id });
    expect(routeOf(`/projects/${id}`)).toEqual({ name: 'project', id });
    expect(routeOf('/projects/not-a-project/')).toEqual({ name: 'not-found' });
  });

  it('calls anything else not found', () => {
    expect(routeOf('/about')).toEqual({ name: 'not-found' });
    expect(routeOf('/404')).toEqual({ name: 'not-found' });
  });

  it('builds the addresses it reads', () => {
    expect(projectsPath()).toBe('/projects/');
    expect(projectsPath('node.js')).toBe('/projects/?skill=node.js');
    expect(routeOf('/projects/', new URL(projectsPath('a b'), 'https://x.dev').search)).toEqual({ name: 'projects', skill: 'a b' });
  });
});

describe('old project links', () => {
  it('finds the project an old ?project= link names, and nothing else', () => {
    const id = projects[0]!.id;
    expect(legacyProjectId(`?project=${id}`)).toBe(id);
    expect(legacyProjectId('?project=not-a-project')).toBeNull();
    expect(legacyProjectId('')).toBeNull();
  });
});

describe('featured projects', () => {
  it('shows the ones marked featured, in order, at most six', () => {
    const shown = featuredProjects();
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.length).toBeLessThanOrEqual(6);
    const flagged = projects.filter((project) => project.featured);
    if (flagged.length > 0) expect(shown.map((p) => p.id)).toEqual(flagged.slice(0, 6).map((p) => p.id));
  });
});
