import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_THEME, isHexColor, SCHEME_VARIANTS, sameTheme, themeStylesheet, type ThemeSpec } from './engine';

const STYLE_ID = 'md-theme';
const SPEC_KEY = 'md-theme-spec';
/** Read by the pre-paint script in index.html. Keep the key in sync. */
const CSS_KEY = 'md-theme-css';

function safeStorage(write: () => void): void {
  try {
    write();
  } catch {
    // Storage can be blocked. The theme still applies for this visit.
  }
}

/**
 * Writes a theme to the page and caches its CSS so the next visit paints in
 * the right colors before any JavaScript runs. The default theme is already
 * baked into index.html, so choosing it just removes the override.
 */
export function applyTheme(spec: ThemeSpec): void {
  const existing = document.getElementById(STYLE_ID);
  if (sameTheme(spec, DEFAULT_THEME)) {
    existing?.remove();
    safeStorage(() => localStorage.removeItem(CSS_KEY));
    return;
  }
  const css = themeStylesheet(spec);
  let style = existing instanceof HTMLStyleElement ? existing : null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
  safeStorage(() => localStorage.setItem(CSS_KEY, css));
}

function sanitize(spec: Partial<ThemeSpec>): ThemeSpec {
  const seed = typeof spec.seed === 'string' && isHexColor(spec.seed) ? spec.seed.toUpperCase() : DEFAULT_THEME.seed;
  const variant = SCHEME_VARIANTS.find((v) => v === spec.variant) ?? DEFAULT_THEME.variant;
  const contrast = typeof spec.contrast === 'number' && Number.isFinite(spec.contrast) ? Math.min(1, Math.max(-1, spec.contrast)) : 0;
  return { seed, variant, contrast };
}

function specOf(state: ThemeSpec): ThemeSpec {
  return { seed: state.seed, variant: state.variant, contrast: state.contrast };
}

interface ThemeState extends ThemeSpec {
  setTheme: (patch: Partial<ThemeSpec>) => void;
  resetTheme: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_THEME,
      setTheme: (patch) => {
        const next = sanitize({ ...specOf(get()), ...patch });
        applyTheme(next);
        set(next);
      },
      resetTheme: () => {
        applyTheme(DEFAULT_THEME);
        set(DEFAULT_THEME);
      },
    }),
    {
      name: SPEC_KEY,
      partialize: (state) => specOf(state),
      merge: (persisted, current) => ({ ...current, ...sanitize((persisted ?? {}) as Partial<ThemeSpec>) }),
      onRehydrateStorage: () => (state) => {
        // If the cached CSS was cleared but the choice survived, re-apply it.
        if (state && !document.getElementById(STYLE_ID)) applyTheme(specOf(state));
      },
    },
  ),
);

/** Keeps every open tab on the same theme. */
export function syncThemeAcrossTabs(): void {
  window.addEventListener('storage', (event) => {
    if (event.key !== SPEC_KEY) return;
    void Promise.resolve(useTheme.persist.rehydrate()).then(() => applyTheme(specOf(useTheme.getState())));
  });
}