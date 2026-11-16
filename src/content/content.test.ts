import { describe, expect, it } from 'vitest';
import { experience, projects, routine } from '@/data';
import { validateContent } from './validate';

describe('content in src/data.ts', () => {
  it('passes every check', () => {
    expect(validateContent()).toEqual([]);
  });

  // Each of these makes a mistake on purpose, checks it is caught and named, then undoes it.
  it('catches a skill tag that does not exist', () => {
    const role = experience[0]!;
    role.skills.push('reactt');
    try {
      expect(validateContent()).toContainEqual(expect.stringContaining('"reactt"'));
    } finally {
      role.skills.pop();
    }
  });

  it('catches two projects with the same id', () => {
    projects.push({ ...projects[0]! });
    try {
      expect(validateContent()).toContainEqual(expect.stringContaining(`"${projects[0]!.id}" is used more than once`));
    } finally {
      projects.pop();
    }
  });

  it('catches routine hours out of order', () => {
    const block = routine.blocks[2]!;
    const was = block.from;
    block.from = 3;
    try {
      expect(validateContent()).toContainEqual(expect.stringContaining('List blocks in order of hour'));
    } finally {
      block.from = was;
    }
  });
});
