import { describe, expect, it } from 'vitest';
import { awards, certifications, experience, projects, routine } from '@/data';
import { contentWarnings, validateContent } from './validate';

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

  it('catches an award tied to a role that does not exist', () => {
    awards.push({ id: 'trial-award', title: 'Trial', from: 'Somewhere', date: '2024-01', reason: 'For testing.', role: 'not-a-role' });
    try {
      expect(validateContent()).toContainEqual(expect.stringContaining('role "not-a-role"'));
    } finally {
      awards.pop();
    }
  });

  it('catches a certification that expires before it was issued', () => {
    certifications.push({ id: 'trial-cert', name: 'Trial', issuer: 'Somewhere', issued: '2025-06', expires: '2025-01', verifyUrl: 'https://example.com/', skills: [] });
    try {
      expect(validateContent()).toContainEqual(expect.stringContaining('must be after issued'));
    } finally {
      certifications.pop();
    }
  });

  it('names every example placeholder still in the data', () => {
    const examples = [...awards, ...certifications].filter((entry) => entry.example).length;
    expect(contentWarnings()).toHaveLength(examples);
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
