import { describe, expect, it } from 'vitest';
import { experience } from './profile';
import { projects } from './projects';
import { skills } from './skills';

const skillIds = new Set(skills.map((skill) => skill.id));

describe('content integrity', () => {
  it('has unique skill ids', () => {
    expect(skillIds.size).toBe(skills.length);
  });

  it('only references skills that exist', () => {
    const unknown = [...experience, ...projects].flatMap((item) =>
      item.skills.filter((id) => !skillIds.has(id)).map((id) => `${item.id} -> ${id}`),
    );
    expect(unknown).toEqual([]);
  });
});