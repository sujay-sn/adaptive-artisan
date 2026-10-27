import type { ButtonHTMLAttributes, Ref } from 'react';
import { Icon } from './Icon';
import type { IconName } from './icons';

const SHELL = 'inline-flex h-8 shrink-0 items-center rounded-sm text-label-large select-none';
const OUTLINED = 'text-on-surface-variant shadow-[inset_0_0_0_1px_var(--md-sys-color-outline-variant)]';

interface ChipProps {
  label: string;
  icon?: IconName;
  className?: string;
}

/** A non-interactive chip, for tags such as skills and coursework. */
export function Chip({ label, icon, className = '' }: ChipProps) {
  return (
    <span className={`${SHELL} ${OUTLINED} ${icon ? 'ps-2 pe-4' : 'px-4'} ${className}`}>
      {icon && <Icon name={icon} size={18} className="me-2 text-primary" />}
      {label}
    </span>
  );
}

interface AssistChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: string;
  icon?: IconName;
  ref?: Ref<HTMLButtonElement>;
}

/** An assist chip: a compact action. */
export function AssistChip({ label, icon, className = '', type = 'button', ...rest }: AssistChipProps) {
  return (
    <button {...rest} type={type} className={`state-layer cursor-pointer ${SHELL} ${OUTLINED} ${icon ? 'ps-2 pe-4' : 'px-4'} ${className}`}>
      {icon && <Icon name={icon} size={18} className="me-2 text-primary" />}
      {label}
    </button>
  );
}

interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'onChange'> {
  label: string;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  ref?: Ref<HTMLButtonElement>;
}

/** A filter chip. The check mark grows in when it is selected. */
export function FilterChip({ label, selected, onSelectedChange, className = '', type = 'button', ...rest }: FilterChipProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-pressed={selected}
      onClick={() => onSelectedChange(!selected)}
      className={`md-filter-chip state-layer cursor-pointer ps-2 pe-4 ${SHELL} ${selected ? 'bg-secondary-container text-on-secondary-container' : OUTLINED} ${className}`}
    >
      <span className="md-filter-chip-check" aria-hidden="true">
        <Icon name="check" size={18} />
      </span>
      {label}
    </button>
  );
}