import type { ButtonHTMLAttributes, Ref } from 'react';
import { Icon } from './Icon';
import type { IconName } from './icons';

export type FabSize = 'default' | 'medium' | 'large';
export type FabColor = 'primary' | 'secondary' | 'tertiary';

interface FabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  icon: IconName;
  /** Accessible name when there is no visible text. */
  label: string;
  /** Visible text. Makes it an extended FAB. */
  text?: string;
  size?: FabSize;
  color?: FabColor;
  ref?: Ref<HTMLButtonElement>;
}

const SIZES: Record<FabSize, { box: string; icon: number }> = {
  default: { box: 'h-14 min-w-14 [--md-shape-rest:1rem] [--md-shape-pressed:0.75rem]', icon: 24 },
  medium: { box: 'h-20 min-w-20 [--md-shape-rest:1.25rem] [--md-shape-pressed:1rem]', icon: 28 },
  large: { box: 'h-24 min-w-24 [--md-shape-rest:1.75rem] [--md-shape-pressed:1.25rem]', icon: 36 },
};

const COLORS: Record<FabColor, string> = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
};

/** MD3 Expressive floating action button, in three sizes, optionally extended with text. */
export function Fab({ icon, label, text, size = 'default', color = 'primary', className = '', type = 'button', ...rest }: FabProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={text ? undefined : label}
      className={`state-layer press-morph inline-flex shrink-0 cursor-pointer items-center justify-center gap-3 shadow-3 select-none hover:shadow-4 ${text ? 'px-4 text-title-medium' : ''} ${SIZES[size].box} ${COLORS[color]} ${className}`}
    >
      <Icon name={icon} size={SIZES[size].icon} />
      {text && <span>{text}</span>}
    </button>
  );
}