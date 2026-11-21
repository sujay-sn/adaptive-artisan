import { useEffect, useState } from 'react';
import { SECTIONS, type SectionId } from '@/content/profile';

/** The section crossing the middle of the viewport, for scrollspy navigation. Watches only while `enabled`, as on the home page. */
export function useActiveSection(enabled = true): SectionId {
  const [active, setActive] = useState<SectionId>('home');

  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    for (const { id } of SECTIONS) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}