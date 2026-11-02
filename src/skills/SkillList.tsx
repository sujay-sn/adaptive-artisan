import { SKILL_CATEGORIES, skills } from '@/content/skills';
import { FilterChip } from '@/ui/Chip';
import { useSkillStore } from './store';

/** Every skill by category, as selectable chips: the accessible alternative to the constellation. */
export function SkillList() {
  const selected = useSkillStore((state) => state.selected);
  const select = useSkillStore((state) => state.select);
  const hover = useSkillStore((state) => state.hover);
  return (
    <div className="grid gap-x-10 gap-y-8 medium:grid-cols-2">
      {SKILL_CATEGORIES.map((category) => (
        <section key={category.id} aria-labelledby={`skills-${category.id}`}>
          <h3 id={`skills-${category.id}`} className="text-title-medium text-on-surface">
            {category.label}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {skills
              .filter((skill) => skill.category === category.id)
              .map((skill) => (
                <li key={skill.id}>
                  <FilterChip
                    label={skill.name}
                    selected={selected === skill.id}
                    onSelectedChange={(on) => select(on ? skill.id : null)}
                    onPointerEnter={() => hover(skill.id)}
                    onPointerLeave={() => hover(null)}
                  />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}