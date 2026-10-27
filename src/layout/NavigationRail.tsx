import type { CSSProperties } from 'react';
import { SECTIONS, type SectionId } from '@/content/profile';
import { Icon } from '@/ui/Icon';

/**
 * MD3 navigation rail, from the expanded window class up. On large screens
 * the labels move beside the icons and the active indicator wraps both.
 *
 * Items have a fixed pitch (4.5rem, or 3.75rem on large), so a single
 * indicator can spring between them with a CSS transition instead of a
 * JavaScript layout animation.
 */
export function NavigationRail({ active }: { active: SectionId }) {
  const activeIndex = Math.max(0, SECTIONS.findIndex((section) => section.id === active));
  return (
    <nav aria-label="Sections" className="fixed inset-y-0 start-0 z-30 hidden w-24 bg-surface pt-11 expanded:block large:w-[13.75rem] large:px-3">
      <div className="relative" style={{ '--rail-index': activeIndex } as CSSProperties}>
        <span
          aria-hidden="true"
          className="absolute top-1 left-[calc(50%-1.75rem)] h-8 w-14 translate-y-[calc(var(--rail-index)*4.5rem)] rounded-full bg-secondary-container transition-[translate] duration-(--md-spring-spatial-default-duration) ease-(--md-spring-spatial-default) motion-reduce:transition-none large:inset-x-0 large:top-0 large:h-14 large:w-auto large:translate-y-[calc(var(--rail-index)*3.75rem)]"
        />
        <ul className="relative flex flex-col gap-3 large:gap-1">
          {SECTIONS.map(({ id, label, icon }) => {
            const current = id === active;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={current ? 'true' : undefined}
                  className="group flex h-15 flex-col items-center gap-1 pt-1 text-on-surface-variant large:state-layer large:h-14 large:flex-row large:gap-3 large:rounded-full large:px-4 large:pt-0"
                >
                  <span className="grid h-8 w-14 place-items-center rounded-full group-aria-[current=true]:text-on-secondary-container max-large:state-layer large:w-6">
                    <Icon name={icon} fill={current} />
                  </span>
                  <span className="text-label-medium group-aria-[current=true]:font-bold group-aria-[current=true]:text-on-surface large:text-label-large large:group-aria-[current=true]:text-on-secondary-container">
                    {label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}