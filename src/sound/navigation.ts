import { SECTIONS } from '@/content/profile';
import { playCue } from './cues';

const sectionIds = new Set<string>(SECTIONS.map((section) => section.id));

/**
 * The section-jump cue. Every way of jumping to a section (the rail, the
 * phone menu, footer links, Back to top, the skip link) changes the hash, so
 * one listener covers them all; plain scrolling never does. Hashes that
 * aren't sections are ignored.
 */
export function listenForSectionJumps(): void {
  window.addEventListener('hashchange', () => {
    if (sectionIds.has(window.location.hash.slice(1))) playCue('navigate');
  });
}