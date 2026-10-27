import type { InputHTMLAttributes, Ref } from 'react';
import { Icon } from './Icon';
import type { IconName } from './icons';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role' | 'className'> {
  label: string;
  hideLabel?: boolean;
  onIcon?: IconName;
  offIcon?: IconName;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

/**
 * MD3 Expressive switch. A real checkbox with role="switch" sits on top of the
 * drawn track, so keyboard, form, and screen reader behavior are all native.
 */
export function Switch({ label, hideLabel = false, onIcon = 'check', offIcon = 'close', className = '', ...input }: SwitchProps) {
  return (
    <label className={`inline-flex items-center gap-4 ${className}`}>
      <span className={hideLabel ? 'sr-only' : 'text-body-large text-on-surface'}>{label}</span>
      <span className="md-switch">
        <input {...input} type="checkbox" role="switch" />
        <span className="md-switch-track" aria-hidden="true" />
        <span className="md-switch-thumb" aria-hidden="true">
          <Icon name={onIcon} size={16} className="md-switch-icon-on" />
          <Icon name={offIcon} size={16} className="md-switch-icon-off" />
        </span>
      </span>
    </label>
  );
}