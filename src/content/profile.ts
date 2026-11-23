// Your content lives in src/data.ts. This module keeps the page's section list,
// which is structure rather than content, and passes the rest through, so the
// components that import from here don't depend on where the data is kept.

import type { IconName } from '@/ui/icons';
import { awards, certifications } from '@/data';

export type { Degree, Profile, Role } from './types';
export { awards, certifications, copy, education, experience, profile, routine } from '@/data';

/** Every page section in order. Navigation and section ids both come from here. */
const ALL_SECTIONS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'person' },
  { id: 'skills', label: 'Skills', icon: 'hub' },
  { id: 'experience', label: 'Experience', icon: 'work' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'education', label: 'Education', icon: 'school' },
  { id: 'recognition', label: 'Recognition', icon: 'workspace_premium' },
  { id: 'contact', label: 'Contact', icon: 'mail' },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName }>;

export type SectionId = (typeof ALL_SECTIONS)[number]['id'];

/** The sections on the page: Recognition only when there is an award or certification to show. */
export const SECTIONS = ALL_SECTIONS.filter((section) => section.id !== 'recognition' || awards.length + certifications.length > 0);

export function sectionLabel(id: SectionId): string {
  return ALL_SECTIONS.find((section) => section.id === id)?.label ?? id;
}
