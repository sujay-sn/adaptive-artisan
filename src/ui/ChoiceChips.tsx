import type { ChangeEvent } from 'react';
import { Icon } from './Icon';

interface ChoiceChipsProps<T extends string> {
  legend: string;
  name: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T, event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

/**
 * A single-choice set of filter chips on native radio buttons, so arrow keys
 * move between options and screen readers announce a radio group.
 */
export function ChoiceChips<T extends string>({ legend, name, value, options, onChange, className = '' }: ChoiceChipsProps<T>) {
  return (
    <fieldset className={className}>
      <legend className="mb-3 text-title-small text-on-surface">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="md-choice-chip state-layer inline-flex h-8 cursor-pointer items-center rounded-sm ps-2 pe-4 text-label-large text-on-surface-variant shadow-[inset_0_0_0_1px_var(--md-sys-color-outline-variant)] select-none has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container has-[:checked]:shadow-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-secondary"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={(event) => onChange(option.value, event)}
              className="sr-only"
            />
            <span className="md-filter-chip-check" aria-hidden="true">
              <Icon name="check" size={18} />
            </span>
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}