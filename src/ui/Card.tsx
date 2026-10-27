import type { HTMLAttributes, ReactNode } from 'react';

export type CardVariant = 'elevated' | 'filled' | 'outlined';
export type CardTone = 'surface' | 'primary' | 'secondary' | 'tertiary';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'article' | 'section' | 'li';
  variant?: CardVariant;
  /** A tonal card uses a container color instead of a surface. */
  tone?: CardTone;
  interactive?: boolean;
  children: ReactNode;
}

const SURFACES: Record<CardVariant, string> = {
  elevated: 'bg-surface-container-low text-on-surface shadow-1',
  // surface-container-highest, not -low, so filled cards still read against the page in dark mode.
  filled: 'bg-surface-container-highest text-on-surface',
  outlined: 'bg-surface text-on-surface shadow-[inset_0_0_0_1px_var(--md-sys-color-outline-variant)]',
};

const TONES: Record<Exclude<CardTone, 'surface'>, string> = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
};

/** MD3 card. Pass a rounded-* class to change its shape; it defaults to medium (12px). */
export function Card({ as: Tag = 'div', variant = 'filled', tone = 'surface', interactive = false, className = '', children, ...rest }: CardProps) {
  const fill = tone === 'surface' ? SURFACES[variant] : TONES[tone];
  const hover = interactive ? `state-layer cursor-pointer ${variant === 'elevated' ? 'hover:shadow-2' : 'hover:shadow-1'}` : '';
  const shape = className.includes('rounded') ? '' : 'rounded-md';
  return (
    <Tag {...rest} className={`transition-shadow ${shape} ${fill} ${hover} ${className}`}>
      {children}
    </Tag>
  );
}