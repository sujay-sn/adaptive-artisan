// The skills graph, derived entirely from content: nothing here is drawn by hand.
// Every skill hangs off its category, and two skills are linked when a role or
// project used both; the link's weight is how many did.

import { experience } from '@/content/profile';
import { projects } from '@/content/projects';
import { SKILL_CATEGORIES, skills, type SkillCategory } from '@/content/skills';

export interface SkillUse {
  id: string;
  label: string;
  kind: 'role' | 'project';
}

export interface GraphNode {
  id: string;
  label: string;
  kind: 'category' | 'skill';
  category: SkillCategory;
  /** Roles and projects that list this skill. */
  usage: number;
}

export interface GraphLink {
  source: string;
  target: string;
  kind: 'category' | 'co-use';
  weight: number;
}

export const categoryNodeId = (category: SkillCategory) => `category:${category}`;

const USES: Array<SkillUse & { skills: string[] }> = [
  ...experience.map((role) => ({ id: role.id, label: `${role.title} at ${role.company}`, kind: 'role' as const, skills: role.skills })),
  ...projects.map((project) => ({ id: project.id, label: project.title, kind: 'project' as const, skills: project.skills })),
];

function build(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  for (const category of SKILL_CATEGORIES) {
    const categoryId = categoryNodeId(category.id);
    nodes.push({ id: categoryId, label: category.label, kind: 'category', category: category.id, usage: 0 });
    for (const skill of skills.filter((s) => s.category === category.id)) {
      nodes.push({ id: skill.id, label: skill.name, kind: 'skill', category: category.id, usage: USES.filter((use) => use.skills.includes(skill.id)).length });
      links.push({ source: categoryId, target: skill.id, kind: 'category', weight: 1 });
    }
  }
  const pairs = new Map<string, number>();
  for (const use of USES) {
    const ids = [...new Set(use.skills)].sort();
    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const key = `${ids[i]}|${ids[j]}`;
        pairs.set(key, (pairs.get(key) ?? 0) + 1);
      }
    }
  }
  for (const [key, weight] of pairs) {
    const [source, target] = key.split('|') as [string, string];
    links.push({ source, target, kind: 'co-use', weight });
  }
  return { nodes, links };
}

/** Nodes are in reading order (each category, then its skills), which keyboard focus follows. */
export const SKILL_GRAPH = build();

const byId = new Map(SKILL_GRAPH.nodes.map((node) => [node.id, node]));

export const graphNode = (id: string) => byId.get(id);

export const categoryLabel = (category: SkillCategory) => SKILL_CATEGORIES.find((c) => c.id === category)?.label ?? category;

export function usesOf(skillId: string): SkillUse[] {
  return USES.filter((use) => use.skills.includes(skillId)).map(({ id, label, kind }) => ({ id, label, kind }));
}

/** Skills used alongside this one, most often first. For a category, its skills. */
export function relatedTo(id: string): GraphNode[] {
  const node = byId.get(id);
  if (!node) return [];
  if (node.kind === 'category') return SKILL_GRAPH.nodes.filter((n) => n.kind === 'skill' && n.category === node.category);
  return SKILL_GRAPH.links
    .filter((link) => link.kind === 'co-use' && (link.source === id || link.target === id))
    .sort((a, b) => b.weight - a.weight)
    .map((link) => byId.get(link.source === id ? link.target : link.source))
    .filter((n): n is GraphNode => n !== undefined);
}

/** Everything one hop from `id`, including itself: what stays lit while it is active. */
export function neighborhood(id: string): Set<string> {
  const ids = new Set([id]);
  for (const link of SKILL_GRAPH.links) {
    if (link.source === id) ids.add(link.target);
    if (link.target === id) ids.add(link.source);
  }
  return ids;
}