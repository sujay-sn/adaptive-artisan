import { Suspense } from 'react';
import { Fab } from '@/ui/Fab';
import { closeHub, LazyHub, openHub, preloadHub, useHubStore } from './launcher';

/** Mounts the hub, closed, once something has reached for it. */
export function HubHost() {
  const requested = useHubStore((state) => state.requested);
  const open = useHubStore((state) => state.open);
  if (!requested) return null;
  return (
    <Suspense fallback={null}>
      <LazyHub open={open} onRequestClose={() => void closeHub()} />
    </Suspense>
  );
}

/** The FAB that opens the Personalization Hub. `extended` adds its label, for the large rail. */
export function HubFab({ extended = false, className = '' }: { extended?: boolean; className?: string }) {
  return (
    <Fab
      icon="palette"
      label="Personalize"
      text={extended ? 'Personalize' : undefined}
      aria-haspopup="dialog"
      className={className}
      onPointerEnter={() => void preloadHub()}
      onFocus={() => void preloadHub()}
      onClick={(event) => void openHub(event.currentTarget)}
    />
  );
}