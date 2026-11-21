import { renderToString } from 'react-dom/server';
import { App } from './App';
import { projects } from './content/projects';
import { Root } from './Root';
import { projectPath, routeOf, setServerLocation } from './router';

/**
 * Renders one page to HTML at build time (scripts/prerender.mjs). Nothing
 * here may touch the browser: components that depend on the visitor's clock,
 * storage, or screen render neutral stand-ins until hydration (useHydrated).
 */
export function render(path: string): string {
  setServerLocation(path);
  return renderToString(
    <Root>
      <App />
    </Root>,
  );
}

/** Every page to prerender, by address. "/404" renders the not-found page as 404.html. */
export function pages(): string[] {
  return ['/', '/projects/', ...projects.map((project) => projectPath(project.id)), '/404'];
}

export { routeOf };
export { validateContent } from './content/validate';
export { pageHead } from './seo/pages';
export { escapeHtml, socialTags } from './seo/social';
export { projectStructuredData, structuredData } from './seo/structuredData';
