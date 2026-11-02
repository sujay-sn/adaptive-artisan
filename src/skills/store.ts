import { create } from 'zustand';

interface SkillState {
  /** Under the pointer or keyboard focus. */
  hovered: string | null;
  selected: string | null;
  /** The skill the Projects section is filtered to, set by "See projects". */
  projectSkill: string | null;
  hover: (id: string | null) => void;
  select: (id: string | null) => void;
  clearProjectSkill: () => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  hovered: null,
  selected: null,
  projectSkill: null,
  hover: (hovered) => set({ hovered }),
  select: (selected) => set({ selected }),
  clearProjectSkill: () => set({ projectSkill: null }),
}));

/** Filters Projects to one skill and glides there, moving focus with it. */
export function showProjectsFor(skillId: string): void {
  useSkillStore.setState({ projectSkill: skillId });
  requestAnimationFrame(() => {
    const target = document.getElementById('projects');
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  });
}