import type { CSSProperties } from 'react';
import { projects } from '@/content/projects';
import { Section } from '@/layout/Section';
import { projectsPath } from '@/router';
import { Button } from '@/ui/Button';
import { featuredProjects } from './featured';
import { ProjectRow } from './ProjectRow';

/**
 * Featured projects on the home page, as editorial rows, with a way through to
 * every project. Each row opens its project's page.
 */
export function ProjectsSection() {
  const featured = featuredProjects();
  return (
    <Section id="projects">
      <div className="space-y-16 expanded:space-y-24">
        {featured.map((project, index) => (
          <ProjectRow key={project.id} project={project} index={index} />
        ))}
      </div>
      <div className="md-reveal mt-16 flex flex-wrap items-center gap-4" style={{ '--i': featured.length + 1 } as CSSProperties}>
        <Button href={projectsPath()} variant="tonal" trailingIcon="arrow_forward">
          {projects.length > featured.length ? `See all ${projects.length} projects` : 'See all projects'}
        </Button>
      </div>
    </Section>
  );
}
