import { lazy, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/google-sans-flex/wght.css';
import './index.css';
import { App } from './App';
import { Root } from './Root';
import { legacyProjectId, projectPath } from './router';
import { unlockAudioOnFirstGesture } from './sound/cues';
import { listenForSectionJumps } from './sound/navigation';
import { startFaviconMotion } from './theme/faviconMotion';
import { syncThemeAcrossTabs } from './theme/store';

syncThemeAcrossTabs();
unlockAudioOnFirstGesture();
listenForSectionJumps();
startFaviconMotion();

// Projects used to open in a dialog at /?project=id; send those links on to the project's page.
const legacy = legacyProjectId(window.location.search);
if (legacy) window.location.replace(projectPath(legacy));

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

// Prerendered content is already on screen. Anything waiting to reveal that is
// in view right now stays shown: hiding it for its entrance would flicker it.
for (const element of root.querySelectorAll<HTMLElement>('.md-reveal')) {
  const box = element.getBoundingClientRect();
  if (box.bottom > 0 && box.top < window.innerHeight) element.dataset.revealed = '';
}

// Tells the pre-paint script's safety timer that the bloom is in the app's hands now.
document.documentElement.dataset.appStarted = '';

// The component gallery (/?gallery) exists only in development builds.
const Gallery = import.meta.env.DEV ? lazy(() => import('./dev/Gallery')) : null;
const showGallery = Gallery !== null && new URLSearchParams(window.location.search).has('gallery');

const tree = (
  <Root>
    {showGallery && Gallery ? (
      <Suspense fallback={null}>
        <Gallery />
      </Suspense>
    ) : (
      <App />
    )}
  </Root>
);

// Production builds ship prerendered HTML to hydrate; the dev server serves an empty root.
if (root.hasChildNodes()) hydrateRoot(root, tree);
else createRoot(root).render(tree);