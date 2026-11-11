import { AnimatePresence, LazyMotion } from 'motion/react';
import { useEffect } from 'react';
import { projects } from '@/content/projects';
import { Section } from '@/layout/Section';
import { graphNode } from '@/skills/graph';
import { useSkillStore } from '@/skills/store';
import { FilterChip } from '@/ui/Chip';
import { projectFilterSkills } from './filters';
import { ProjectCard } from './ProjectCard';
import { ProjectDialog } from './ProjectDialog';
import { closeProject, syncProjectWithUrl, useProjectStore } from './store';

const loadMotionFeatures = () => import('./motionFeatures').then((module) => module.default);
const FILTERS = projectFilterSkills();

/**
 * Projects, filterable by skill. The filter is shared with the constellation,
 * so "See projects" there lands here already filtered. Cards animate to their
 * new places when the filter changes.
 */
export function ProjectsSection() {
  const projectSkill = useSkillStore((state) => state.projectSkill);
  const openId = useProjectStore((state) => state.openId);

  useEffect(() => syncProjectWithUrl(), []);

  const setFilter = (skill: string | null) => useSkillStore.setState({ projectSkill: skill });
  const shown = projectSkill ? projects.filter((project) => project.skills.includes(projectSkill)) : projects;
  // A filter set from the constellation may not be one of the usual chips; show it anyway.
  const chips = projectSkill && !FILTERS.includes(projectSkill) ? [projectSkill, ...FILTERS] : FILTERS;
  const label = (skill: string) => graphNode(skill)?.label ?? skill;

  return (
    <Section id="projects">
      <div role="group" aria-label="Filter projects by skill" className="mb-8 flex flex-wrap gap-2">
        <FilterChip label="All" selected={projectSkill === null} onSelectedChange={() => setFilter(null)} />
        {chips.map((skill) => (
          <FilterChip key={skill} label={label(skill)} selected={projectSkill === skill} onSelectedChange={(on) => setFilter(on ? skill : null)} />
        ))}
      </div>
      <p role="status" className="sr-only">
        {projectSkill ? `${shown.length} ${shown.length === 1 ? 'project uses' : 'projects use'} ${label(projectSkill)}` : ''}
      </p>
      <LazyMotion features={loadMotionFeatures} strict>
        <div className="grid gap-6 expanded:grid-cols-2">
          <AnimatePresence initial={false}>
            {shown.map((project, index) => (
              <ProjectCard key={project.id} project={project} featured={index === 0} />
            ))}
          </AnimatePresence>
        </div>
      </LazyMotion>
      <ProjectDialog project={projects.find((project) => project.id === openId) ?? null} onRequestClose={() => void closeProject()} />
    </Section>
  );
}