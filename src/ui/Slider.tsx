import { useId, type CSSProperties, type InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'min' | 'max' | 'step' | 'className'> {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number) => void;
  format?: (value: number) => string;
  className?: string;
}

/** MD3 Expressive slider on a native range input: a thick track and a narrow bar handle. */
export function Slider({ label, value, min, max, step = 1, onValueChange, format = String, className = '', id, ...rest }: SliderProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const fill = `${((value - min) / (max - min)) * 100}%`;
  return (
    <div className={`md-slider ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={inputId} className="text-label-large text-on-surface">
          {label}
        </label>
        <output htmlFor={inputId} className="text-label-large text-on-surface-variant tabular-nums">
          {format(value)}
        </output>
      </div>
      <input
        {...rest}
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onValueChange(Number(event.currentTarget.value))}
        style={{ '--md-slider-fill': fill } as CSSProperties}
      />
    </div>
  );
}