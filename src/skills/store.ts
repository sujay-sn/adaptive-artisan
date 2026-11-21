import { create } from 'zustand';
import { navigate, projectsPath } from '@/router';

interface SkillState {
  /** Under the pointer or keyboard focus. */
  hovered: string | null;
  selected: string | null;
  hover: (id: string | null) => void;
  select: (id: string | null) => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  hovered: null,
  selected: null,
  hover: (hovered) => set({ hovered }),
  select: (selected) => set({ selected }),
}));

/** Opens the Projects page filtered to one skill. */
export function showProjectsFor(skillId: string): void {
  void navigate(projectsPath(skillId));
}
