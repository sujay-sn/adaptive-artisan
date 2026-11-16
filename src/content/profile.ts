// Your content lives in src/data.ts. This module keeps the page's section list,
// which is structure rather than content, and passes the rest through, so the
// components that import from here don't depend on where the data is kept.

import type { IconName } from '@/ui/icons';

export type { Degree, Profile, Role } from './types';
export { copy, education, experience, profile, routine } from '@/data';

/** The single list of page sections. Navigation and section ids both come from here. */
export const SECTIONS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'person' },
  { id: 'skills', label: 'Skills', icon: 'hub' },
  { id: 'experience', label: 'Experience', icon: 'work' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'education', label: 'Education', icon: 'school' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName }>;

export type SectionId = (typeof SECTIONS)[number]['id'];

export function sectionLabel(id: SectionId): string {
  return SECTIONS.find((section) => section.id === id)?.label ?? id;
}
