import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { Icon } from './Icon';
import type { IconName } from './icons';

export type ButtonVariant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  trailingIcon?: IconName;
  children: ReactNode;
  className?: string;
}

type NativeButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & { href?: undefined; ref?: Ref<HTMLButtonElement> };

type LinkButtonProps = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & { href: string; ref?: Ref<HTMLAnchorElement> };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

const COLORS: Record<ButtonVariant, string> = {
  filled: 'bg-primary text-on-primary disabled:bg-on-surface/12 disabled:text-on-surface/38',
  tonal: 'bg-secondary-container text-on-secondary-container disabled:bg-on-surface/12 disabled:text-on-surface/38',
  elevated:
    'bg-surface-container-low text-primary shadow-1 hover:shadow-2 disabled:bg-on-surface/12 disabled:text-on-surface/38 disabled:shadow-none',
  outlined: 'text-on-surface-variant shadow-[inset_0_0_0_1px_var(--md-sys-color-outline-variant)] disabled:text-on-surface/38',
  text: 'text-primary disabled:text-on-surface/38',
};

// Rest and pressed corner radii drive the Expressive press morph (see press-morph in index.css).
const SIZES: Record<ButtonSize, { box: string; padding: string; textPadding: string; icon: number }> = {
  small: {
    box: 'h-10 gap-2 text-label-large [--md-shape-rest:1.25rem] [--md-shape-pressed:0.5rem]',
    padding: 'px-4',
    textPadding: 'px-3',
    icon: 20,
  },
  medium: {
    box: 'h-14 gap-2 text-title-medium [--md-shape-rest:1.75rem] [--md-shape-pressed:0.75rem]',
    padding: 'px-6',
    textPadding: 'px-4',
    icon: 24,
  },
};

function buttonClassName(variant: ButtonVariant = 'filled', size: ButtonSize = 'small', extra = ''): string {
  const s = SIZES[size];
  return [
    'state-layer press-morph inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap select-none disabled:cursor-default',
    s.box,
    variant === 'text' ? s.textPadding : s.padding,
    COLORS[variant],
    extra,
  ].join(' ');
}

function ButtonContent({ icon, trailingIcon, size = 'small', children }: Pick<ButtonOwnProps, 'icon' | 'trailingIcon' | 'size' | 'children'>) {
  const iconSize = SIZES[size].icon;
  return (
    <>
      {icon && <Icon name={icon} size={iconSize} />}
      <span>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} size={iconSize} />}
    </>
  );
}

/** MD3 Expressive button. Renders a link when given `href`; external links open in a new tab. */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, icon, trailingIcon, children, className, href, target, rel, ...rest } = props;
    const external = /^https?:\/\//.test(href);
    return (
      <a
        {...rest}
        href={href}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
        className={buttonClassName(variant, size, className)}
      >
        <ButtonContent icon={icon} trailingIcon={trailingIcon} size={size}>
          {children}
        </ButtonContent>
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  const { variant, size, icon, trailingIcon, children, className, type = 'button', ...rest } = props;
  return (
    <button {...rest} type={type} className={buttonClassName(variant, size, className)}>
      <ButtonContent icon={icon} trailingIcon={trailingIcon} size={size}>
        {children}
      </ButtonContent>
    </button>
  );
}