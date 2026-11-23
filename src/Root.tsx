import { MotionConfig } from 'motion/react';
import { StrictMode, useEffect, type ReactNode } from 'react';
import { usePreferences } from './preferences/store';
import { applyTypeAxes } from './preferences/typeAxes';
import { useTheme } from './theme/store';

/**
 * Saved preferences and theme load only after hydration. Loading them as the
 * stores were created would make a returning visitor's first render differ
 * from the prerendered page; the colors themselves are already on screen by
 * then, from the pre-paint script in index.html. Rendered before the app, so
 * this effect runs ahead of any of the app's own.
 */
function RestoreSaved() {
  useEffect(() => {
    // Type axes go onto <html> once per frame however fast a slider moves,
    // since each change re-lays out the whole page. Subscribed before the
    // rehydrate below, so saved axes apply too; until then the pre-paint
    // script's copy stays on screen.
    let frame = 0;
    const unsubscribe = usePreferences.subscribe((state, previous) => {
      if (state.typeAxes === previous.typeAxes) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => applyTypeAxes(usePreferences.getState().typeAxes));
    });
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    void usePreferences.persist.rehydrate();
    void useTheme.persist.rehydrate();
  }, []);
  return null;
}

/** Everything around the app, shared by the browser entry and the prerender so both render the same tree. */
export function Root({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <RestoreSaved />
        {children}
      </MotionConfig>
    </StrictMode>
  );
}
