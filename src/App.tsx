import type { ReactNode } from 'react';
import { education, experience, profile, sectionLabel, type SectionId } from '@/content/profile';
import { projects } from '@/content/projects';
import { SKILL_CATEGORIES, skills } from '@/content/skills';
import { ThemeControls } from '@/theme/ThemeControls';
import { Icon } from '@/ui/Icon';
import type { IconName } from '@/ui/icons';

// Day 1 foundation page: real content on the real tokens, before any
// components exist. Each section is replaced by its designed version later in
// the plan, so this stays deliberately plain.

const container = 'mx-auto w-full max-w-[75rem] px-4 medium:px-6 expanded:px-12';

function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-4 py-16 expanded:py-24">
      <div className={container}>
        <h2 id={`${id}-title`} className="font-display text-headline-large text-on-surface expanded:text-display-small">
          {sectionLabel(id)}
        </h2>
        <div className="mt-8 expanded:mt-12">{children}</div>
      </div>
    </section>
  );
}

function LinkButton({ href, icon, children }: { href: string; icon?: IconName; children: ReactNode }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-outline px-5 text-label-large text-primary hover:bg-primary/8"
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

function Hero() {
  return (
    <header id="home" className="flex min-h-[85svh] flex-col justify-end pt-24 pb-16">
      <div className={container}>
        <h1 className="font-display text-hero text-primary [font-stretch:82%] rond-40">
          <span className="block">Sujay</span>
          <span className="block">S N</span>
        </h1>
        <p className="mt-8 text-title-large text-on-surface">
          {profile.role} in {profile.location}
        </p>
        <p className="mt-3 max-w-[60ch] text-body-large text-on-surface-variant">{profile.summary}</p>
        <div className="mt-10">
          <ThemeControls />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {profile.resumeUrl && (
            <LinkButton href={profile.resumeUrl} icon="download">
              Resume
            </LinkButton>
          )}
          <LinkButton href={profile.github} icon="code">
            GitHub
          </LinkButton>
          <LinkButton href={profile.linkedin} icon="person">
            LinkedIn
          </LinkButton>
        </div>
      </div>
    </header>
  );
}

function About() {
  return (
    <Section id="about">
      <div className="max-w-[65ch] space-y-5 text-body-large text-on-surface">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills">
      <div className="grid gap-10 medium:grid-cols-2">
        {SKILL_CATEGORIES.map((category) => (
          <div key={category.id}>
            <h3 className="text-title-medium text-on-surface">{category.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {skills
                .filter((skill) => skill.category === category.id)
                .map((skill) => (
                  <li
                    key={skill.id}
                    className="rounded-sm border border-outline-variant px-3 py-1.5 text-label-large text-on-surface-variant"
                  >
                    {skill.name}
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
              <p className="mt-4 text-label-medium text-on-surface-variant">{job.technologies.join(', ')}</p>
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
            <article
              key={project.id}
              aria-labelledby={`${project.id}-title`}
              className={
                featured
                  ? 'rounded-2xl bg-primary-container p-6 text-on-primary-container expanded:col-span-2 expanded:p-10'
                  : 'rounded-xl bg-surface-container-low p-6 text-on-surface expanded:p-8'
              }
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
                    <LinkButton href={project.demoUrl} icon="open_in_new">
                      Live demo
                    </LinkButton>
                  )}
                  {project.repoUrl && (
                    <LinkButton href={project.repoUrl} icon="code">
                      Source
                    </LinkButton>
                  )}
                </div>
              )}
            </article>
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
                  <li
                    key={course}
                    className="rounded-sm bg-secondary-container px-3 py-1.5 text-label-large text-on-secondary-container"
                  >
                    {course}
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
        <LinkButton href={`mailto:${profile.email}`} icon="mail">
          {profile.email}
        </LinkButton>
        <LinkButton href={profile.linkedin} icon="person">
          LinkedIn
        </LinkButton>
        <LinkButton href={profile.github} icon="code">
          GitHub
        </LinkButton>
      </div>
    </Section>
  );
}

export function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-label-large focus:text-on-primary"
      >
        Skip to content
      </a>
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
          <a href="#home" className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 hover:bg-on-surface/8">
            <Icon name="arrow_upward" size={18} />
            Back to top
          </a>
        </div>
      </footer>
    </>
  );
}
