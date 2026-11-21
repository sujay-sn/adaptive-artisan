import { useEffect } from 'react';
import { HubFab, HubHost } from '@/hub/HubLaunchers';
import { Footer } from '@/layout/Footer';
import { NavigationRail } from '@/layout/NavigationRail';
import { TopAppBar } from '@/layout/TopAppBar';
import { useActiveSection } from '@/layout/useActiveSection';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProjectPage } from '@/pages/ProjectPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { followHistory, interceptLinks, useRoute } from '@/router';
import { pageHead } from '@/seo/pages';

/** The shell every page shares: navigation, the hub, and the footer, around the current page. */
export function App() {
  const route = useRoute();
  const onHome = route.name === 'home';
  const scrolled = useActiveSection(onHome);
  // Away from the home page, the rail shows where these pages belong.
  const active = onHome ? scrolled : 'projects';

  useEffect(() => {
    const stopLinks = interceptLinks();
    const stopHistory = followHistory();
    return () => {
      stopLinks();
      stopHistory();
    };
  }, []);

  useEffect(() => {
    document.title = pageHead(route).title;
  }, [route]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-label-large focus:text-on-primary"
      >
        Skip to content
      </a>
      <TopAppBar active={active} />
      <NavigationRail active={active} />
      <div className="fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 expanded:hidden">
        <HubFab />
      </div>
      <HubHost />
      <div className="expanded:ps-24 large:ps-[13.75rem]">
        <main id="main" tabIndex={-1} className="outline-none">
          {route.name === 'home' && <HomePage />}
          {route.name === 'projects' && <ProjectsPage skill={route.skill} />}
          {route.name === 'project' && <ProjectPage key={route.id} id={route.id} />}
          {route.name === 'not-found' && <NotFoundPage />}
        </main>
        <Footer />
      </div>
    </>
  );
}
