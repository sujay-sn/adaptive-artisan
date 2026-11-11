// MD3 container transform on a same-document view transition. An element
// (a FAB, a card) and a dialog share one view-transition name, so the browser
// morphs one into the other. Dialogs get the name from CSS only while
// html[data-container-transform] names them, so other view transitions, like
// the theme reveal, leave dialogs alone.

export function canContainerTransform(element: HTMLElement | null): element is HTMLElement {
  return (
    element !== null &&
    element.isConnected &&
    element.getClientRects().length > 0 &&
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export async function containerTransform(element: HTMLElement, name: string, direction: 'open' | 'close', update: () => void): Promise<void> {
  const root = document.documentElement;
  root.dataset.containerTransform = name;
  if (direction === 'open') element.style.viewTransitionName = name;
  const transition = document.startViewTransition(() => {
    element.style.viewTransitionName = direction === 'open' ? '' : name;
    update();
  });
  try {
    await transition.finished;
  } finally {
    element.style.viewTransitionName = '';
    delete root.dataset.containerTransform;
  }
}