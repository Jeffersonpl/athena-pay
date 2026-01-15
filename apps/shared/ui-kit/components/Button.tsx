import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = 'athena-btn';
    const variantClass = `athena-btn-${variant}`;
    const sizeClass = `athena-btn-${size}`;
    const fullWidthClass = fullWidth ? 'athena-btn-full' : '';
    const iconOnlyClass = iconOnly ? 'athena-btn-icon' : '';

    const classes = [
      baseClass,
      variantClass,
      sizeClass,
      fullWidthClass,
      iconOnlyClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="athena-spinner athena-spinner-sm" />
        ) : leftIcon ? (
          <span className="athena-btn-icon-left">{leftIcon}</span>
        ) : null}
        {!iconOnly && children}
        {!loading && rightIcon && (
          <span className="athena-btn-icon-right">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
