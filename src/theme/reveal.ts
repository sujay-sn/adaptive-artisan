import { flushSync } from 'react-dom';
import { playCue } from '@/sound/cues';

export interface RevealOrigin {
  x: number;
  y: number;
}

export interface RevealOptions {
  /** Milliseconds for the circle to cover the page. */
  duration?: number;
  /** Play the theme sound cue, if sound is on. */
  sound?: boolean;
}

export function originFromElement(element: Element | null): RevealOrigin | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Applies a theme change behind a circle that grows from `origin`, using a
 * same-document view transition. Without view transitions, or with reduced
 * motion, the change just applies.
 */
export function withThemeReveal(origin: RevealOrigin | null, apply: () => void, { duration = 650, sound = true }: RevealOptions = {}): void {
  if (sound) playCue('theme');
  if (!origin || typeof document.startViewTransition !== 'function' || reducedMotion()) {
    apply();
    return;
  }
  const root = document.documentElement;
  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  // Scopes the "no crossfade" root styling in index.css to this transition only.
  root.dataset.themeReveal = '';
  const transition = document.startViewTransition(() => flushSync(apply));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration, easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {
      // Skipped, usually because another transition started. The change still applied.
    });
  void transition.finished.finally(() => {
    delete root.dataset.themeReveal;
  });
}