import { lazy } from 'react';
import { flushSync } from 'react-dom';
import { create } from 'zustand';
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

function canMorph(element: HTMLElement | null): element is HTMLElement {
  return (
    element !== null &&
    element.isConnected &&
    element.getClientRects().length > 0 &&
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * MD3 container transform: the FAB and the hub share one view-transition
 * name, so the browser morphs one into the other. The hub's name is applied
 * by CSS only while html[data-hub-transition] is set, so other transitions
 * (like the theme reveal) leave the hub alone.
 */
async function morph(fab: HTMLElement, update: () => void, direction: 'open' | 'close'): Promise<void> {
  const root = document.documentElement;
  root.dataset.hubTransition = direction;
  if (direction === 'open') fab.style.viewTransitionName = 'hub-surface';
  const transition = document.startViewTransition(() => {
    fab.style.viewTransitionName = direction === 'open' ? '' : 'hub-surface';
    update();
  });
  try {
    await transition.finished;
  } finally {
    fab.style.viewTransitionName = '';
    delete root.dataset.hubTransition;
  }
}

export async function openHub(from: HTMLElement | null): Promise<void> {
  origin = from;
  await preloadHub();
  playCue('open');
  const show = () => flushSync(() => useHubStore.setState({ open: true }));
  if (canMorph(from)) await morph(from, show, 'open');
  else show();
}

export async function closeHub(): Promise<void> {
  playCue('close');
  const hide = () => flushSync(() => useHubStore.setState({ open: false }));
  const target = origin;
  origin = null;
  if (canMorph(target)) await morph(target, hide, 'close');
  else hide();
}