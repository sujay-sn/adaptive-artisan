import { flushSync } from 'react-dom';
import { create } from 'zustand';
import { projects } from '@/content/projects';
import { canContainerTransform, containerTransform } from '@/lib/containerTransform';

// Which project's dialog is open, kept in step with the URL (?project=id), so
// every project has a link that can be shared and the back button closes it.

const PARAM = 'project';
/** The view-transition name a card and the project dialog share (see index.css). */
const SURFACE = 'project-surface';

interface ProjectState {
  openId: string | null;
}

export const useProjectStore = create<ProjectState>(() => ({ openId: null }));

export function projectIdFromSearch(search: string): string | null {
  const id = new URLSearchParams(search).get(PARAM);
  return id !== null && projects.some((project) => project.id === id) ? id : null;
}

/** The shareable address of a project. */
export function projectUrl(id: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, id);
  url.hash = '';
  return url.toString();
}

let origin: HTMLElement | null = null;
// True while the open dialog has its own history entry, which closing pops.
let ownsHistoryEntry = false;

export async function openProject(id: string, from: HTMLElement | null): Promise<void> {
  origin = from;
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, id);
  history.pushState({ project: id }, '', url);
  ownsHistoryEntry = true;
  const show = () => flushSync(() => useProjectStore.setState({ openId: id }));
  if (canContainerTransform(from)) await containerTransform(from, SURFACE, 'open', show);
  else show();
}

export async function closeProject(): Promise<void> {
  const target = origin;
  origin = null;
  const hide = () => flushSync(() => useProjectStore.setState({ openId: null }));
  if (canContainerTransform(target)) await containerTransform(target, SURFACE, 'close', hide);
  else hide();
  // Leave the URL as it was before the dialog opened.
  if (ownsHistoryEntry) {
    ownsHistoryEntry = false;
    history.back();
  } else {
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM);
    history.replaceState(history.state, '', url);
  }
}

/** Opens the project named in the URL on arrival, and follows back and forward. Returns a cleanup. */
export function syncProjectWithUrl(): () => void {
  const initial = projectIdFromSearch(window.location.search);
  if (initial) {
    useProjectStore.setState({ openId: initial });
    requestAnimationFrame(() => document.getElementById('projects')?.scrollIntoView({ block: 'start' }));
  }
  const onPopState = () => {
    ownsHistoryEntry = false;
    origin = null;
    const id = projectIdFromSearch(window.location.search);
    if (id !== useProjectStore.getState().openId) useProjectStore.setState({ openId: id });
  };
  window.addEventListener('popstate', onPopState);
  return () => window.removeEventListener('popstate', onPopState);
}