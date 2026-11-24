import { usePreferences } from '@/preferences/store';
import { resolvedColorScheme, subscribeToColorScheme } from './colorScheme';
import { buildScheme, schemeColors } from './engine';
import { FAVICON_HOLD_MS, FAVICON_MORPH_MS, faviconSvg, type FaviconColors } from './favicon';
import { useTheme } from './store';

/** About 15 frames a second is smooth at favicon size and light on the tab strip. */
const FRAME_MS = 66;

function currentColors(): FaviconColors {
  const { seed, variant, contrast } = useTheme.getState();
  const colors = schemeColors(buildScheme({ seed, variant, contrast }, resolvedColorScheme() === 'dark'));
  return { shape: colors.primary, core: colors.primaryContainer };
}

/**
 * Keeps the tab's icon in the visitor's theme and moving. Chrome and Safari
 * don't play an animated SVG favicon, so the morph is drawn here a frame at a
 * time: about a second of motion, then a few seconds' hold. A new theme
 * recolors the icon at once, and a theme chosen by hand (a swatch, the hub)
 * also morphs it, so the tab answers the choice too. Reduced motion and the
 * site's pause control hold it still. Timers, not animation frames, drive it,
 * since a background tab is where a favicon is most often seen and animation
 * frames stop there; browsers slow those timers, which only shortens the morph.
 */
export function startFaviconMotion(): void {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const still = () => reducedMotion.matches || usePreferences.getState().ambientPaused;

  let colors = currentColors();
  let step = 0;
  let timer = 0;
  let drawn = '';

  const draw = (t: number) => {
    const svg = faviconSvg(step, t, colors);
    if (svg === drawn) return;
    drawn = svg;
    link.type = 'image/svg+xml';
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };

  const morph = () => {
    window.clearTimeout(timer);
    const start = performance.now();
    const frame = () => {
      const t = Math.min(1, (performance.now() - start) / FAVICON_MORPH_MS);
      draw(t);
      if (t < 1) timer = window.setTimeout(frame, FRAME_MS);
      else {
        step += 1;
        schedule();
      }
    };
    frame();
  };

  const schedule = () => {
    window.clearTimeout(timer);
    if (!still()) timer = window.setTimeout(morph, FAVICON_HOLD_MS);
  };

  const recolor = () => {
    const next = currentColors();
    if (next.shape === colors.shape && next.core === colors.core) return;
    colors = next;
    draw(0);
  };

  draw(0);
  schedule();

  useTheme.subscribe(recolor);
  subscribeToColorScheme(recolor);
  usePreferences.subscribe((state, previous) => {
    if (state.ambientPaused !== previous.ambientPaused) schedule();
  });
  reducedMotion.addEventListener('change', schedule);
  // withThemeReveal announces choices made by hand; the store change that follows recolors.
  window.addEventListener('md:theme-change', () => {
    if (still()) return;
    window.setTimeout(() => {
      recolor();
      morph();
    }, 0);
  });
}
