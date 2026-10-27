import { useId, type InputHTMLAttributes, type ReactNode, type Ref, type TextareaHTMLAttributes } from 'react';
import { Icon } from './Icon';

export type FieldVariant = 'filled' | 'outlined';

interface FieldOwnProps {
  label: string;
  variant?: FieldVariant;
  supportingText?: string;
  /** Shown once the browser marks the field invalid after interaction, or whenever `invalid` is set. */
  errorText?: string;
  invalid?: boolean;
  className?: string;
}

type Control = HTMLInputElement | HTMLTextAreaElement;

// :user-invalid is visual only, so mirror it to aria-invalid for assistive tech.
function syncInvalid(control: Control, forced: boolean): void {
  if (forced || control.matches(':user-invalid')) control.setAttribute('aria-invalid', 'true');
  else control.removeAttribute('aria-invalid');
}

function describedBy(id: string, supportingText?: string, errorText?: string) {
  return {
    'aria-describedby': supportingText ? `${id}-support` : undefined,
    'aria-errormessage': errorText ? `${id}-error` : undefined,
  };
}

function FieldShell({
  id,
  label,
  variant = 'filled',
  supportingText,
  errorText,
  invalid,
  required,
  className = '',
  children,
}: FieldOwnProps & { id: string; required?: boolean; children: ReactNode }) {
  return (
    <div className={`md-field md-field-${variant} ${className}`} data-invalid={invalid ? '' : undefined}>
      <div className="md-field-box">
        {children}
        <label htmlFor={id}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      </div>
      {supportingText && (
        <p id={`${id}-support`} className="md-field-support">
          {supportingText}
        </p>
      )}
      {errorText && (
        <p id={`${id}-error`} className="md-field-error">
          <Icon name="error" size={16} />
          {errorText}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = FieldOwnProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'className'> & { ref?: Ref<HTMLInputElement> };

/** MD3 text field with a floating label and native validation. */
export function TextField({ label, variant, supportingText, errorText, invalid = false, className, id, onBlur, onInput, ...input }: TextFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldShell id={fieldId} label={label} variant={variant} supportingText={supportingText} errorText={errorText} invalid={invalid} required={input.required} className={className}>
      <input
        {...input}
        {...describedBy(fieldId, supportingText, errorText)}
        id={fieldId}
        placeholder=" "
        aria-invalid={invalid ? true : undefined}
        onBlur={(event) => {
          syncInvalid(event.currentTarget, invalid);
          onBlur?.(event);
        }}
        onInput={(event) => {
          if (event.currentTarget.hasAttribute('aria-invalid')) syncInvalid(event.currentTarget, invalid);
          onInput?.(event);
        }}
      />
    </FieldShell>
  );
}

type TextAreaProps = FieldOwnProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder' | 'className'> & { ref?: Ref<HTMLTextAreaElement> };

/** Multi-line version of TextField. */
export function TextArea({ label, variant, supportingText, errorText, invalid = false, className, id, rows = 4, onBlur, onInput, ...input }: TextAreaProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldShell id={fieldId} label={label} variant={variant} supportingText={supportingText} errorText={errorText} invalid={invalid} required={input.required} className={className}>
      <textarea
        {...input}
        {...describedBy(fieldId, supportingText, errorText)}
        id={fieldId}
        rows={rows}
        placeholder=" "
        aria-invalid={invalid ? true : undefined}
        onBlur={(event) => {
          syncInvalid(event.currentTarget, invalid);
          onBlur?.(event);
        }}
        onInput={(event) => {
          if (event.currentTarget.hasAttribute('aria-invalid')) syncInvalid(event.currentTarget, invalid);
          onInput?.(event);
        }}
      />
    </FieldShell>
  );
}