import { renderToString } from 'react-dom/server';
import { App } from './App';
import { Root } from './Root';

/**
 * Renders the page to HTML at build time (scripts/prerender.mjs). Nothing
 * here may touch the browser: components that depend on the visitor's clock,
 * storage, or screen render neutral stand-ins until hydration (useHydrated).
 */
export function render(): string {
  return renderToString(
    <Root>
      <App />
    </Root>,
  );
}

export { validateContent } from './content/validate';
export { headTags, socialTags } from './seo/social';
export { structuredData } from './seo/structuredData';