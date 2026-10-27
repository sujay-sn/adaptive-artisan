import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import '@fontsource-variable/google-sans-flex/wght.css';
import './index.css';
import { App } from './App';
import { syncThemeAcrossTabs } from './theme/store';

syncThemeAcrossTabs();

// The component gallery (/?gallery) exists only in development builds.
const Gallery = import.meta.env.DEV ? lazy(() => import('./dev/Gallery')) : null;
const showGallery = Gallery !== null && new URLSearchParams(window.location.search).has('gallery');

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      {showGallery && Gallery ? (
        <Suspense fallback={null}>
          <Gallery />
        </Suspense>
      ) : (
        <App />
      )}
    </MotionConfig>
  </StrictMode>,
);