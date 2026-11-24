import { create } from 'zustand';
import type { MotionScheme } from '@/motion/tokens';
import { applyAppearance, sameIconAxes, sameTypeAxes } from '@/preferences/appearance';
import { usePreferences, type IconAxes, type TypeAxes } from '@/preferences/store';
import { getPreference, setPreference, systemColorScheme, type ColorSchemePreference, type ResolvedColorScheme } from '@/theme/colorScheme';
import { DEFAULT_THEME, sameTheme, type ThemeSpec } from '@/theme/engine';
import { useTheme } from '@/theme/store';

// The look being tried in the Personalization Hub. Opening the hub copies the
// applied look in; every panel edits this copy, and the page changes only when
// it is applied. Sound is not here: it turns on and off at once, since hearing
// a cue is how you decide.

export interface Look {
  theme: ThemeSpec;
  colorScheme: ColorSchemePreference;
  motionScheme: MotionScheme;
  typeAxes: TypeAxes;
  iconAxes: IconAxes;
}

/** What the page shows right now. */
export function appliedLook(): Look {
  const { seed, variant, contrast } = useTheme.getState();
  const { motionScheme, typeAxes, iconAxes } = usePreferences.getState();
  return { theme: { seed, variant, contrast }, colorScheme: getPreference(), motionScheme, typeAxes, iconAxes };
}

export function resolveScheme(preference: ColorSchemePreference): ResolvedColorScheme {
  return preference === 'system' ? systemColorScheme() : preference;
}

/** Whether applying `look` would change anything you can see, as opposed to only the motion scheme. */
export function changesAppearance(look: Look, applied: Look = appliedLook()): boolean {
  return (
    !sameTheme(look.theme, applied.theme) ||
    resolveScheme(look.colorScheme) !== resolveScheme(applied.colorScheme) ||
    !sameTypeAxes(look.typeAxes, applied.typeAxes) ||
    !sameIconAxes(look.iconAxes, applied.iconAxes)
  );
}

export function differsFromApplied(look: Look, applied: Look = appliedLook()): boolean {
  return changesAppearance(look, applied) || look.colorScheme !== applied.colorScheme || look.motionScheme !== applied.motionScheme;
}

/** Writes a look to the stores and the page, all at once, so a reveal captures every part of it. */
export function applyLook(look: Look): void {
  useTheme.getState().setTheme(look.theme);
  if (look.colorScheme !== getPreference()) setPreference(look.colorScheme);
  const preferences = usePreferences.getState();
  preferences.setMotionScheme(look.motionScheme);
  preferences.setTypeAxes(look.typeAxes);
  preferences.setIconAxes(look.iconAxes);
  // The stores apply the axes on the next frame; a reveal snapshots this one.
  applyAppearance(look.typeAxes, look.iconAxes);
}

interface DraftState extends Look {
  /** Starts over from the applied look. */
  reset: () => void;
  setTheme: (patch: Partial<ThemeSpec>) => void;
  toggleColorScheme: () => void;
  setMotionScheme: (scheme: MotionScheme) => void;
  setTypeAxes: (patch: Partial<TypeAxes>) => void;
  setIconAxes: (patch: Partial<IconAxes>) => void;
}

export function lookOf(state: Look): Look {
  const { theme, colorScheme, motionScheme, typeAxes, iconAxes } = state;
  return { theme, colorScheme, motionScheme, typeAxes, iconAxes };
}

// Starts from defaults; the hub calls reset() as it opens, by which point the
// saved look has loaded. Nothing here touches the DOM at import.
export const useDraft = create<DraftState>()((set) => ({
  theme: DEFAULT_THEME,
  colorScheme: 'system',
  motionScheme: 'expressive',
  typeAxes: usePreferences.getState().typeAxes,
  iconAxes: usePreferences.getState().iconAxes,
  reset: () => set(appliedLook()),
  setTheme: (patch) =>
    set((state) => {
      const theme = { ...state.theme, ...patch };
      return { theme: { ...theme, seed: theme.seed.toUpperCase() } };
    }),
  // The same two-state toggle as the page's: flip what is on screen, and land
  // back on the system scheme rather than pinning it.
  toggleColorScheme: () =>
    set((state) => {
      const target: ResolvedColorScheme = resolveScheme(state.colorScheme) === 'dark' ? 'light' : 'dark';
      return { colorScheme: target === systemColorScheme() ? 'system' : target };
    }),
  setMotionScheme: (motionScheme) => set({ motionScheme }),
  setTypeAxes: (patch) => set((state) => ({ typeAxes: { ...state.typeAxes, ...patch } })),
  setIconAxes: (patch) => set((state) => ({ iconAxes: { ...state.iconAxes, ...patch } })),
}));
