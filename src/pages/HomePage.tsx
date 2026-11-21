import { Contact } from '@/contact/Contact';
import { ProjectsSection } from '@/projects/ProjectsSection';
import { About } from '@/sections/About';
import { Education } from '@/sections/Education';
import { Experience } from '@/sections/Experience';
import { Hero } from '@/sections/Hero';
import { SkillsSection } from '@/skills/SkillsSection';

/** The home page: every section, in order. */
export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <SkillsSection />
      <Experience />
      <ProjectsSection />
      <Education />
      <Contact />
    </>
  );
}
