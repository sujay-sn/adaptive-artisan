import { useEffect, type RefObject } from 'react';

/**
 * Reveals each .md-reveal element inside `root` once, when it enters the
 * viewport (see .md-reveal in index.css). Time-based rather than tied to
 * scroll position, so it plays however the visitor arrives, nav jumps included.
 */
export function useReveal(root: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const targets = container.querySelectorAll<HTMLElement>('.md-reveal');
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [root]);
}