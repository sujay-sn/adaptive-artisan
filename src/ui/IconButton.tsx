import type { ButtonHTMLAttributes, Ref } from 'react';
import { Icon } from './Icon';
import type { IconName } from './icons';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  icon: IconName;
  /** Accessible name. Required, since the button shows no text. */
  label: string;
  variant?: IconButtonVariant;
  /** Setting this makes it a toggle button. */
  selected?: boolean;
  selectedIcon?: IconName;
  ref?: Ref<HTMLButtonElement>;
}

const OUTLINE = 'shadow-[inset_0_0_0_1px_var(--md-sys-color-outline-variant)]';

const COLORS: Record<IconButtonVariant, { rest: string; off: string; on: string }> = {
  standard: { rest: 'text-on-surface-variant', off: 'text-on-surface-variant', on: 'text-primary' },
  filled: { rest: 'bg-primary text-on-primary', off: 'bg-surface-container-highest text-primary', on: 'bg-primary text-on-primary' },
  tonal: {
    rest: 'bg-secondary-container text-on-secondary-container',
    off: 'bg-surface-container-highest text-on-surface-variant',
    on: 'bg-secondary-container text-on-secondary-container',
  },
  outlined: { rest: `text-on-surface-variant ${OUTLINE}`, off: `text-on-surface-variant ${OUTLINE}`, on: 'bg-inverse-surface text-inverse-on-surface' },
};

/** MD3 icon button, 40px with a 48px touch target. Expressive toggles turn squarer when selected. */
export function IconButton({ icon, label, variant = 'standard', selected, selectedIcon, className = '', type = 'button', ...rest }: IconButtonProps) {
  const toggle = selected !== undefined;
  const palette = COLORS[variant];
  const color = !toggle ? palette.rest : selected ? palette.on : palette.off;
  const shape = toggle && selected ? '[--md-shape-rest:0.75rem]' : '[--md-shape-rest:1.25rem]';
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      aria-pressed={toggle ? selected : undefined}
      className={`state-layer press-morph inline-grid size-10 shrink-0 cursor-pointer place-items-center select-none [--md-shape-pressed:0.5rem] after:absolute after:-inset-1 after:content-[''] disabled:cursor-default disabled:text-on-surface/38 ${shape} ${color} ${className}`}
    >
      <Icon name={toggle && selected && selectedIcon ? selectedIcon : icon} fill={toggle && selected} />
    </button>
  );
}