import { AnimatePresence, LazyMotion } from 'motion/react';
import { copy } from '@/content/profile';
import { projects } from '@/content/projects';
import { container } from '@/layout/container';
import { projectFilterSkills } from '@/projects/filters';
import { ProjectCard } from '@/projects/ProjectCard';
import { navigate, projectsPath } from '@/router';
import { graphNode } from '@/skills/graph';
import { Button } from '@/ui/Button';
import { FilterChip } from '@/ui/Chip';

const loadMotionFeatures = () => import('@/projects/motionFeatures').then((module) => module.default);
const FILTERS = projectFilterSkills();
const label = (skill: string) => graphNode(skill)?.label ?? skill;

/**
 * Every project, filterable by skill. The filter lives in the address
 * (/projects/?skill=react), so a filtered view can be shared, and "See
 * projects" in the skills section lands here already filtered. Cards animate
 * to their new places when the filter changes.
 */
export function ProjectsPage({ skill }: { skill: string | null }) {
  const shown = skill ? projects.filter((project) => project.skills.includes(skill)) : projects;
  // A filter from the skills section may not be one of the usual chips; show it anyway.
  const chips = skill && !FILTERS.includes(skill) ? [skill, ...FILTERS] : FILTERS;
  const setFilter = (next: string | null) => void navigate(projectsPath(next), { replace: true, keepScroll: true });

  return (
    <div className={`${container} pt-6 pb-24 expanded:pt-10`}>
      <Button href="/#projects" variant="text" icon="arrow_back">
        Home
      </Button>
      <h1 data-page-heading tabIndex={-1} className="mt-6 font-display text-display-small text-on-surface outline-none expanded:text-display-medium">
        Projects
      </h1>
      <p className="mt-4 max-w-[60ch] text-body-large text-on-surface-variant">{copy.projectsIntro}</p>

      <div role="group" aria-label="Filter projects by skill" className="mt-10 mb-8 flex flex-wrap gap-2">
        <FilterChip label="All" selected={skill === null} onSelectedChange={() => setFilter(null)} />
        {chips.map((chip) => (
          <FilterChip key={chip} label={label(chip)} selected={skill === chip} onSelectedChange={(on) => setFilter(on ? chip : null)} />
        ))}
      </div>
      <p role="status" className="sr-only">
        {skill ? `${shown.length} ${shown.length === 1 ? 'project uses' : 'projects use'} ${label(skill)}` : ''}
      </p>

      <LazyMotion features={loadMotionFeatures} strict>
        <div className="grid gap-6 expanded:grid-cols-2">
          <AnimatePresence initial={false}>
            {shown.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </div>
  );
}
