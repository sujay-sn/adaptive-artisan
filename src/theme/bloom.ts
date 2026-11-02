import { originFromElement, withThemeReveal } from './reveal';

/** Read by the pre-paint script in index.html, which sets data-bloom on first visits. Keep in sync. */
const BLOOMED_KEY = 'md-bloomed';

/**
 * The first-visit bloom. The pre-paint script sets data-bloom, which paints
 * the page in the monochrome scheme; this removes it behind the same circular
 * reveal as a theme change, so color floods out from `from` while the hero's
 * shapes and headline spring into place. Once per session.
 */
export function bloom(from: Element | null): void {
  const root = document.documentElement;
  if (!root.hasAttribute('data-bloom')) return;
  try {
    sessionStorage.setItem(BLOOMED_KEY, '1');
  } catch {
    // Storage blocked: the bloom may play again on the next visit.
  }
  withThemeReveal(originFromElement(from), () => root.removeAttribute('data-bloom'), { duration: 1100, sound: false });
}