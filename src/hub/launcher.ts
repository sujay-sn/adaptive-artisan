import { lazy } from 'react';
import { flushSync } from 'react-dom';
import { create } from 'zustand';
import { canContainerTransform, containerTransform } from '@/lib/containerTransform';
import { playCue } from '@/sound/cues';

export interface HubProps {
  open: boolean;
  onRequestClose: () => void;
}

interface HubState {
  /** Set once something reaches for the hub; mounts it, closed, in the background. */
  requested: boolean;
  open: boolean;
}

/** The view-transition name the FAB and the hub share (see index.css). */
const SURFACE = 'hub-surface';

export const useHubStore = create<HubState>(() => ({ requested: false, open: false }));

let modulePromise: Promise<typeof import('./PersonalizationHub')> | null = null;
const loadModule = () => (modulePromise ??= import('./PersonalizationHub'));

/** The hub, code-split. Rendered by HubHost once requested. */
export const LazyHub = lazy(() => loadModule().then((module) => ({ default: module.PersonalizationHub })));

// Resolves when the hub has mounted (closed), so a transition never starts before it exists.
let markMounted: () => void = () => undefined;
const mounted = new Promise<void>((resolve) => {
  markMounted = resolve;
});

/** Called by the hub from a layout effect on its first mount. */
export function hubMounted(): void {
  markMounted();
}

/** Loads and mounts the hub. Launchers call this on hover and focus, so it is usually ready before a click. */
export function preloadHub(): Promise<void> {
  if (!useHubStore.getState().requested) {
    void loadModule();
    useHubStore.setState({ requested: true });
  }
  return mounted;
}

let origin: HTMLElement | null = null;

export async function openHub(from: HTMLElement | null): Promise<void> {
  origin = from;
  await preloadHub();
  playCue('open');
  const show = () => flushSync(() => useHubStore.setState({ open: true }));
  if (canContainerTransform(from)) await containerTransform(from, SURFACE, 'open', show);
  else show();
}

export async function closeHub(): Promise<void> {
  playCue('close');
  const hide = () => flushSync(() => useHubStore.setState({ open: false }));
  const target = origin;
  origin = null;
  if (canContainerTransform(target)) await containerTransform(target, SURFACE, 'close', hide);
  else hide();
}