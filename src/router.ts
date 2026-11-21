import { useMemo, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { projects } from '@/content/projects';
import { canContainerTransform, pageTransform } from '@/lib/containerTransform';

// The site's pages, routed in the browser without a library: three kinds of
// page don't need one. Every route is also prerendered to its own HTML file
// (scripts/prerender.mjs), so direct visits and shared links get a real page;
// in the browser, links are intercepted so moving between pages happens in
// place, with the card-to-page morph.

export type Route =
  | { name: 'home' }
  | { name: 'projects'; skill: string | null }
  | { name: 'project'; id: string }
  | { name: 'not-found' };

/** Pages live in folders (projects/burrow-housing/index.html), so their addresses end in a slash. */
export const projectPath = (id: string) => `/projects/${id}/`;
export const projectsPath = (skill?: string | null) => (skill ? `/projects/?skill=${encodeURIComponent(skill)}` : '/projects/');

/** Reads a route from an address's path and query. */
export function routeOf(pathname: string, search = ''): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { name: 'home' };
  if (path === '/projects') return { name: 'projects', skill: new URLSearchParams(search).get('skill') };
  const match = /^\/projects\/([a-z0-9-]+)$/.exec(path);
  if (match && projects.some((project) => project.id === match[1])) return { name: 'project', id: match[1]! };
  return { name: 'not-found' };
}

/** The project an old ?project=id link points at, from before projects had pages. */
export function legacyProjectId(search: string): string | null {
  const id = new URLSearchParams(search).get('project');
  return id !== null && projects.some((project) => project.id === id) ? id : null;
}

// ---------------------------------------------------------------------------
// The current location, as a store React can subscribe to.

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** The address the prerender is rendering; set by entry-server before each page. */
let serverLocation = '/';
export function setServerLocation(location: string): void {
  serverLocation = location;
}

const snapshot = () => `${window.location.pathname}${window.location.search}`;
// While hydrating, match what was prerendered: the path alone, since pages are
// built without a query. A ?skill= filter applies right after.
const hydrationSnapshot = () => (typeof window === 'undefined' ? serverLocation : window.location.pathname);

export function useRoute(): Route {
  const location = useSyncExternalStore(subscribe, snapshot, hydrationSnapshot);
  return useMemo(() => {
    const [path = '/', query = ''] = location.split('?');
    return routeOf(path, query ? `?${query}` : '');
  }, [location]);
}

// ---------------------------------------------------------------------------
// Moving between pages.

/** The view-transition name a project's card and its page's cover share (see index.css). */
const SURFACE = 'project-surface';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** After a page change: go to the hash's target, or the top, and move focus to the new page's heading. */
function arrive(hash: string, scrollY?: number): void {
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (target) target.scrollIntoView({ block: 'start' });
  else window.scrollTo(0, scrollY ?? 0);
  // Screen readers hear the new page's title, as they would on a full page load.
  if (!target && scrollY === undefined) document.querySelector<HTMLElement>('[data-page-heading]')?.focus({ preventScroll: true });
}

function rememberScroll(): void {
  history.replaceState({ ...(history.state as object | null), scrollY: window.scrollY }, '');
}

interface NavigateOptions {
  /** The card a project page grows out of. */
  from?: HTMLElement | null;
  /** Swap the current history entry instead of adding one, as for a filter. */
  replace?: boolean;
  /** Stay where the page is scrolled, as for a filter. */
  keepScroll?: boolean;
}

export async function navigate(to: string, options: NavigateOptions = {}): Promise<void> {
  const url = new URL(to, window.location.href);
  if (!options.replace) rememberScroll();
  const commit = () => {
    if (options.replace) history.replaceState({ ...(history.state as object | null) }, '', url);
    else history.pushState({ scrollY: 0 }, '', url);
    flushSync(notify);
    if (!options.keepScroll) arrive(url.hash);
  };
  const opening = routeOf(url.pathname).name === 'project';
  if (opening && canContainerTransform(options.from ?? null)) await pageTransform(SURFACE, 'open', commit, options.from!);
  else commit();
}

/** Follows back and forward, morphing a project page back into its card when there is one. Returns a cleanup. */
export function followHistory(): () => void {
  history.scrollRestoration = 'manual';
  let shown = snapshot();
  const onPopState = (event: PopStateEvent) => {
    const before = routeOf(shown.split('?')[0] ?? '/');
    shown = snapshot();
    const scrollY = (event.state as { scrollY?: number } | null)?.scrollY;
    const update = () => {
      flushSync(notify);
      arrive(window.location.hash, scrollY);
    };
    if (before.name === 'project' && typeof document.startViewTransition === 'function' && !prefersReducedMotion()) {
      void pageTransform(SURFACE, 'close', update, null, () => document.querySelector<HTMLElement>(`[data-project-card="${before.id}"] [data-morph]`));
    } else update();
  };
  const onNavigated = () => {
    shown = snapshot();
  };
  window.addEventListener('popstate', onPopState);
  listeners.add(onNavigated);
  return () => {
    window.removeEventListener('popstate', onPopState);
    listeners.delete(onNavigated);
  };
}

/**
 * Turns clicks on links to the site's own pages into in-place navigation. Links
 * stay ordinary links, so opening in a new tab, copying the address, and
 * middle-clicking all still work. Returns a cleanup.
 */
export function interceptLinks(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest('a');
    if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    // Same page, different hash: the browser jumps there itself.
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    if (routeOf(url.pathname).name === 'not-found') return;
    event.preventDefault();
    const card = link.closest<HTMLElement>('[data-project-card]');
    void navigate(`${url.pathname}${url.search}${url.hash}`, { from: card?.querySelector<HTMLElement>('[data-morph]') ?? null });
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
