import { education, profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { HubFab, HubHost } from '@/hub/HubLaunchers';
import { container } from '@/layout/container';
import { NavigationRail } from '@/layout/NavigationRail';
import { Section } from '@/layout/Section';
import { TopAppBar } from '@/layout/TopAppBar';
import { useActiveSection } from '@/layout/useActiveSection';
import { About } from '@/sections/About';
import { Experience } from '@/sections/Experience';
import { Hero } from '@/sections/Hero';
import { graphNode } from '@/skills/graph';
import { SkillsSection } from '@/skills/SkillsSection';
import { useSkillStore } from '@/skills/store';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';

// The page. Projects, Education, and Contact are straightforward layouts
// until their own redesigns land; Projects already filters by skill.

function Projects() {
  const projectSkill = useSkillStore((state) => state.projectSkill);
  const clearProjectSkill = useSkillStore((state) => state.clearProjectSkill);
  const shown = projectSkill ? projects.filter((project) => project.skills.includes(projectSkill)) : projects;

  return (
    <Section id="projects">
      {projectSkill && (
        <div className="mb-6 flex flex-wrap items-center gap-3" role="status">
          <p className="text-body-large text-on-surface">
            Projects using <span className="font-medium text-primary">{graphNode(projectSkill)?.label}</span>
          </p>
          <Button variant="text" icon="close" onClick={clearProjectSkill}>
            Show all projects
          </Button>
        </div>
      )}
      <div className="grid gap-6 expanded:grid-cols-2">
        {shown.map((project, index) => {
          const featured = index === 0;
          return (
            <Card
              key={project.id}
              as="article"
              variant="filled"
              tone={featured ? 'primary' : 'surface'}
              aria-labelledby={`${project.id}-title`}
              className={featured ? 'rounded-xl p-6 expanded:col-span-2 expanded:rounded-2xl expanded:p-10' : 'rounded-lg-plus p-6 expanded:p-8'}
            >
              <h3 id={`${project.id}-title`} className="font-display text-headline-medium">
                {project.title}
              </h3>
              <p className="mt-1 text-label-large opacity-80">
                {[project.year, project.duration, project.team, project.status === 'in-progress' ? 'in progress' : undefined]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p className="mt-4 max-w-[65ch] text-body-large">{project.description}</p>
              <ul className="mt-4 max-w-[65ch] list-disc space-y-1.5 ps-5 text-body-medium opacity-90">
                {(project.results.length > 0 ? project.results : project.features.slice(0, 4)).map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="mt-4 text-label-medium opacity-80">{project.technologies.join(', ')}</p>
              {(project.repoUrl || project.demoUrl) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.demoUrl && (
                    <Button href={project.demoUrl} icon="open_in_new">
                      Live demo
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button href={project.repoUrl} variant="outlined" icon="code">
                      Source
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

function Education() {
  return (
    <Section id="education">
      <div className="space-y-12">
        {education.map((degree) => (
          <div key={degree.id} className="grid gap-2 expanded:grid-cols-[12rem_1fr] expanded:gap-10">
            <p className="text-label-large text-on-surface-variant">{degree.period}</p>
            <div>
              <h3 className="text-title-large text-on-surface">{degree.degree}</h3>
              <p className="mt-1 text-body-medium text-on-surface-variant">
                {degree.school}, {degree.location}. GPA {degree.gpa}
              </p>
              {degree.summary && <p className="mt-4 max-w-[65ch] text-body-large text-on-surface">{degree.summary}</p>}
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Coursework">
                {degree.coursework.map((course) => (
                  <li key={course}>
                    <Chip label={course} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact">
      <p className="max-w-[55ch] text-body-large text-on-surface">
        I graduate in December 2026 and I'm looking for full-time software engineering roles. Email is the fastest way to reach me.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={`mailto:${profile.email}`} icon="mail">
          {profile.email}
        </Button>
        <Button href={profile.linkedin} variant="outlined" icon="person">
          LinkedIn
        </Button>
        <Button href={profile.github} variant="outlined" icon="code">
          GitHub
        </Button>
      </div>
    </Section>
  );
}

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
          <Projects />
          <Education />
          <Contact />
        </main>
        <footer className="border-t border-outline-variant py-10">
          <div className={`${container} flex flex-wrap items-center justify-between gap-4 text-body-medium text-on-surface-variant`}>
            <p>
              &copy; {new Date().getFullYear()} {profile.name}
            </p>
            <Button href="#home" variant="text" icon="arrow_upward">
              Back to top
            </Button>
          </div>
        </footer>
      </div>
    </>
  );
}
