import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False while React renders on the server or hydrates the prerendered page,
 * true from the first render after that. Anything that depends on the
 * visitor's clock, storage, or screen renders a neutral stand-in until then,
 * so the browser's first render matches the prerendered HTML exactly.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
