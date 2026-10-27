import type { CSSProperties } from 'react';
import type { IconName } from './icons';

interface IconProps {
  name: IconName;
  /** Filled glyph. Animatable, since FILL is a variable axis. */
  fill?: boolean;
  weight?: number;
  grade?: number;
  /** Size in px. Optical size follows it within the font's 20 to 48 range. */
  size?: number;
  /** Only for icons that carry meaning on their own. Otherwise hidden from assistive tech. */
  label?: string;
  className?: string;
}

export function Icon({ name, fill = false, weight = 400, grade = 0, size = 24, label, className = '' }: IconProps) {
  const style = {
    '--md-icon-fill': fill ? 1 : 0,
    '--md-icon-wght': weight,
    '--md-icon-grad': grade,
    '--md-icon-opsz': Math.min(48, Math.max(20, size)),
    '--md-icon-size': `${size / 16}rem`,
  } as CSSProperties;

  return label ? (
    <span className={`md-icon ${className}`} style={style} role="img" aria-label={label}>
      {name}
    </span>
  ) : (
    <span className={`md-icon ${className}`} style={style} aria-hidden="true">
      {name}
    </span>
  );
}