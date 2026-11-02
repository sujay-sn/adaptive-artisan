import { education, experience, profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { SKILL_CATEGORIES, skills } from '@/content/skills';
import { HubFab, HubHost } from '@/hub/HubLaunchers';
import { container } from '@/layout/container';
import { NavigationRail } from '@/layout/NavigationRail';
import { Section } from '@/layout/Section';
import { TopAppBar } from '@/layout/TopAppBar';
import { useActiveSection } from '@/layout/useActiveSection';
import { About } from '@/sections/About';
import { Hero } from '@/sections/Hero';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Chip } from '@/ui/Chip';

// The page. Hero and About have their designed versions; the remaining
// sections are straightforward layouts until their own redesigns land.

function Skills() {
  return (
    <Section id="skills">
      <div className="grid gap-10 medium:grid-cols-2 large:grid-cols-3">
        {SKILL_CATEGORIES.map((category) => (
          <div key={category.id}>
            <h3 className="text-title-medium text-on-surface">{category.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skills
                .filter((skill) => skill.category === category.id)
                .map((skill) => (
                  <li key={skill.id}>
                    <Chip label={skill.name} />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience">
      <ol className="space-y-14">
        {experience.map((job) => (
          <li key={job.id} className="grid gap-2 expanded:grid-cols-[12rem_1fr] expanded:gap-10">
            <p className="text-label-large text-on-surface-variant tabular-nums">{job.period}</p>
            <div>
              <h3 className="text-title-large text-on-surface">
                {job.title}, {job.company}
              </h3>
              <p className="mt-1 text-body-medium text-on-surface-variant">
                {job.type}, {job.location}
              </p>
              <p className="mt-4 max-w-[65ch] text-body-large text-on-surface">{job.summary}</p>
              <ul className="mt-4 max-w-[65ch] list-disc space-y-2 ps-5 text-body-medium text-on-surface-variant marker:text-primary">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                {job.technologies.map((technology) => (
                  <li key={technology}>
                    <Chip label={technology} />
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects">
      <div className="grid gap-6 expanded:grid-cols-2">
        {projects.map((project, index) => {
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
          <Skills />
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
