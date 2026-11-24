import type { CSSProperties } from 'react';
import type { IconName } from './icons';

interface IconProps {
  name: IconName;
  /**
   * Filled glyph. Animatable, since FILL is a variable axis. Pass it only when
   * fill carries meaning (a current section, a selected toggle); left unset,
   * every axis follows the visitor's icon settings from the hub.
   */
  fill?: boolean;
  weight?: number;
  grade?: number;
  /** Size in px. Optical size follows it within the font's 20 to 48 range. */
  size?: number;
  /** Overrides the optical size that would follow from `size` and the visitor's settings. */
  opticalSize?: number;
  /** Only for icons that carry meaning on their own. Otherwise hidden from assistive tech. */
  label?: string;
  className?: string;
}

export function Icon({ name, fill, weight, grade, size = 24, opticalSize, label, className = '' }: IconProps) {
  // Unset axes stay out of the style, so .md-icon falls back to the visitor's
  // --md-user-icon-* values and then to the defaults (see index.css).
  const style = {
    '--md-icon-fill': fill === undefined ? undefined : fill ? 1 : 0,
    '--md-icon-wght': weight,
    '--md-icon-grad': grade,
    '--md-icon-opsz': opticalSize,
    '--md-icon-opsz-auto': Math.min(48, Math.max(20, size)),
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
