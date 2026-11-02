import { useSyncExternalStore } from 'react';
import fullFontUrl from '@fontsource-variable/google-sans-flex/files/google-sans-flex-latin-full-normal.woff2?url';

// The full Google Sans Flex (all six axes, about 1.4 MB) loads only when the
// hub opens, under its own family name, so the rest of the site keeps the
// small cuts.

export type PlaygroundFontStatus = 'idle' | 'loading' | 'ready' | 'error';

export const PLAYGROUND_FONT = 'Google Sans Flex Playground';

let status: PlaygroundFontStatus = 'idle';
const listeners = new Set<() => void>();

function setStatus(next: PlaygroundFontStatus): void {
  status = next;
  for (const listener of listeners) listener();
}

export function loadPlaygroundFont(): void {
  if (status !== 'idle') return;
  setStatus('loading');
  const face = new FontFace(PLAYGROUND_FONT, `url(${fullFontUrl}) format("woff2")`, {
    weight: '1 1000',
    stretch: '25% 151%',
    style: 'oblique 0deg 10deg',
    display: 'swap',
  });
  document.fonts.add(face);
  face.load().then(
    () => setStatus('ready'),
    () => setStatus('error'),
  );
}

export function usePlaygroundFont(): PlaygroundFontStatus {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => status,
    () => 'idle',
  );
}