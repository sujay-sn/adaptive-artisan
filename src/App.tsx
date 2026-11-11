import { Contact } from '@/contact/Contact';
import { HubFab, HubHost } from '@/hub/HubLaunchers';
import { Footer } from '@/layout/Footer';
import { NavigationRail } from '@/layout/NavigationRail';
import { TopAppBar } from '@/layout/TopAppBar';
import { useActiveSection } from '@/layout/useActiveSection';
import { ProjectsSection } from '@/projects/ProjectsSection';
import { About } from '@/sections/About';
import { Education } from '@/sections/Education';
import { Experience } from '@/sections/Experience';
import { Hero } from '@/sections/Hero';
import { SkillsSection } from '@/skills/SkillsSection';

/** The page shell: navigation, the hub, and the sections in order. */
export function App() {
  const active = useActiveSection();
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
        <main id="main">
          <Hero />
          <About />
          <SkillsSection />
          <Experience />
          <ProjectsSection />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
