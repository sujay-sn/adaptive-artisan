import { describe, expect, it } from 'vitest';
import { experience } from '@/content/profile';
import { projects } from '@/content/projects';
import { skills } from '@/content/skills';
import { categoryNodeId, graphNode, neighborhood, SKILL_GRAPH } from './graph';

const everything = [...experience, ...projects];

describe('skills graph', () => {
  it('links every skill to its category', () => {
    for (const skill of skills) {
      const linked = SKILL_GRAPH.links.some((l) => l.kind === 'category' && l.source === categoryNodeId(skill.category) && l.target === skill.id);
      expect(linked, skill.id).toBe(true);
    }
  });

  it('weights a co-use link by how many roles and projects used both skills', () => {
    const expected = everything.filter((item) => item.skills.includes('react') && item.skills.includes('redux')).length;
    const link = SKILL_GRAPH.links.find((l) => l.kind === 'co-use' && [l.source, l.target].sort().join() === 'react,redux');
    expect(expected).toBeGreaterThan(0);
    expect(link?.weight).toBe(expected);
  });

  it('counts usage across roles and projects', () => {
    expect(graphNode('react')?.usage).toBe(everything.filter((item) => item.skills.includes('react')).length);
  });

  it('never links the same pair twice', () => {
    const keys = SKILL_GRAPH.links.map((l) => [l.source, l.target].sort().join('|'));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('has symmetric neighborhoods', () => {
    for (const node of SKILL_GRAPH.nodes) {
      for (const other of neighborhood(node.id)) expect(neighborhood(other).has(node.id)).toBe(true);
    }
  });
});