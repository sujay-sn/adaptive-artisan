import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MotionScheme } from '@/motion/tokens';

export interface TypeAxes {
  wght: number;
  wdth: number;
  opsz: number;
  slnt: number;
  GRAD: number;
  ROND: number;
}

export interface IconAxes {
  fill: boolean;
  weight: number;
  grade: number;
  opticalSize: number;
}

export const DEFAULT_TYPE_AXES: TypeAxes = { wght: 400, wdth: 100, opsz: 72, slnt: 0, GRAD: 0, ROND: 0 };
export const DEFAULT_ICON_AXES: IconAxes = { fill: false, weight: 400, grade: 0, opticalSize: 24 };

/** Switches which spring custom properties are in effect (see springStylesheet). */
export function applyMotionScheme(scheme: MotionScheme): void {
  if (scheme === 'standard') document.documentElement.dataset.motionScheme = 'standard';
  else delete document.documentElement.dataset.motionScheme;
}

interface PreferencesState {
  motionScheme: MotionScheme;
  /** Sound effects. Off until the visitor turns them on. */
  sound: boolean;
  typeAxes: TypeAxes;
  iconAxes: IconAxes;
  /** Pauses ambient motion: the hero shapes and the avatar's breathing (WCAG 2.2.2). */
  ambientPaused: boolean;
  setMotionScheme: (scheme: MotionScheme) => void;
  setSound: (on: boolean) => void;
  setAmbientPaused: (paused: boolean) => void;
  setTypeAxes: (patch: Partial<TypeAxes>) => void;
  setIconAxes: (patch: Partial<IconAxes>) => void;
  resetTypeAxes: () => void;
  resetIconAxes: () => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      motionScheme: 'expressive',
      sound: false,
      typeAxes: DEFAULT_TYPE_AXES,
      iconAxes: DEFAULT_ICON_AXES,
      ambientPaused: false,
      setMotionScheme: (motionScheme) => {
        applyMotionScheme(motionScheme);
        set({ motionScheme });
      },
      setSound: (sound) => set({ sound }),
      setAmbientPaused: (ambientPaused) => set({ ambientPaused }),
      setTypeAxes: (patch) => set((state) => ({ typeAxes: { ...state.typeAxes, ...patch } })),
      setIconAxes: (patch) => set((state) => ({ iconAxes: { ...state.iconAxes, ...patch } })),
      resetTypeAxes: () => set({ typeAxes: DEFAULT_TYPE_AXES }),
      resetIconAxes: () => set({ iconAxes: DEFAULT_ICON_AXES }),
    }),
    {
      // Read by the pre-paint script in index.html. Keep the key in sync.
      name: 'md-preferences',
      partialize: ({ motionScheme, sound, typeAxes, iconAxes, ambientPaused }) => ({ motionScheme, sound, typeAxes, iconAxes, ambientPaused }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<PreferencesState>;
        return {
          ...current,
          ...saved,
          typeAxes: { ...DEFAULT_TYPE_AXES, ...saved.typeAxes },
          iconAxes: { ...DEFAULT_ICON_AXES, ...saved.iconAxes },
        };
      },
    },
  ),
);