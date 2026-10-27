import { useRef, useState } from 'react';
import { profile, SECTIONS, type SectionId } from '@/content/profile';
import { toggleColorScheme, useColorScheme } from '@/theme/colorScheme';
import { Dialog } from '@/ui/Dialog';
import { Icon } from '@/ui/Icon';
import { IconButton } from '@/ui/IconButton';

/**
 * MD3 top app bar for compact and medium windows. It sticks to the top and
 * picks up a translucent tint once the page scrolls (see .md-top-app-bar).
 * The menu opens the sections in a modal navigation sheet.
 */
export function TopAppBar({ active }: { active: SectionId }) {
  const [open, setOpen] = useState(false);
  const target = useRef<SectionId | null>(null);
  const { resolved } = useColorScheme();
  const next = resolved === 'dark' ? 'light' : 'dark';

  const handleClose = () => {
    setOpen(false);
    const id = target.current;
    target.current = null;
    // The browser returns focus to the menu button. After choosing a section,
    // move it to that section instead so keyboard users land where they went.
    if (id) document.getElementById(id)?.focus({ preventScroll: true });
  };

  return (
    <header className="md-top-app-bar expanded:hidden">
      <div className="md-top-app-bar-surface flex h-16 items-center gap-1 px-1">
        <IconButton icon="menu" label="Open navigation" aria-haspopup="dialog" onClick={() => setOpen(true)} />
        <a href="#home" className="rounded-full px-2 py-1 font-display text-title-large text-on-surface">
          {profile.name}
        </a>
        <IconButton className="ms-auto" icon={`${next}_mode`} label={`Switch to ${next} mode`} onClick={toggleColorScheme} />
      </div>

      <Dialog open={open} onClose={handleClose} title={profile.name} variant="sheet" lightDismiss>
        <nav aria-label="Sections">
          <ul className="flex flex-col gap-1 pb-6">
            {SECTIONS.map(({ id, label, icon }) => {
              const current = id === active;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={current ? 'true' : undefined}
                    onClick={() => {
                      target.current = id;
                      setOpen(false);
                    }}
                    className={`state-layer flex h-14 items-center gap-3 rounded-full px-4 text-label-large ${current ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'}`}
                  >
                    <Icon name={icon} fill={current} />
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Dialog>
    </header>
  );
}