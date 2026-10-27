// Light, dark, and system color scheme.
//
// The source of truth is <meta name="color-scheme"> in index.html: "light dark"
// follows the system, "light" or "dark" pins an override. CSS maps the meta to
// the color-scheme property, and every color is light-dark(), so nothing else
// needs to change. An override is stored only when it differs from the system
// at the moment it is chosen, and is never cleared automatically afterwards.

import { useSyncExternalStore } from 'react';

export type ColorSchemePreference = 'system' | 'light' | 'dark';
export type ResolvedColorScheme = 'light' | 'dark';

/** Read by the pre-paint script in index.html. Keep the key in sync. */
const STORAGE_KEY = 'color-scheme';
const CHANGE_EVENT = 'md:color-scheme';

function meta(): HTMLMetaElement {
  let element = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (!element) {
    element = document.createElement('meta');
    element.name = 'color-scheme';
    element.content = 'light dark';
    document.head.prepend(element);
  }
  return element;
}

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

export function getPreference(): ColorSchemePreference {
  const value = meta().content.trim();
  return value === 'light' || value === 'dark' ? value : 'system';
}

export function systemColorScheme(): ResolvedColorScheme {
  return darkQuery().matches ? 'dark' : 'light';
}

export function resolvedColorScheme(): ResolvedColorScheme {
  const preference = getPreference();
  return preference === 'system' ? systemColorScheme() : preference;
}

export function setPreference(preference: ColorSchemePreference): void {
  meta().content = preference === 'system' ? 'light dark' : preference;
  try {
    if (preference === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Two-state toggle: switch to the opposite of what is on screen. Landing back
 * on the system scheme removes the override instead of pinning it.
 */
export function toggleColorScheme(): void {
  const target: ResolvedColorScheme = resolvedColorScheme() === 'dark' ? 'light' : 'dark';
  setPreference(target === systemColorScheme() ? 'system' : target);
}

function subscribe(onChange: () => void): () => void {
  const query = darkQuery();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    meta().content = event.newValue ?? 'light dark';
    onChange();
  };
  query.addEventListener('change', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    query.removeEventListener('change', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useColorScheme() {
  const preference = useSyncExternalStore(subscribe, getPreference, (): ColorSchemePreference => 'system');
  const resolved = useSyncExternalStore(subscribe, resolvedColorScheme, (): ResolvedColorScheme => 'light');
  return { preference, resolved };
}