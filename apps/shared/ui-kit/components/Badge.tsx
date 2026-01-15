import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gray';
  dot?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', dot = false, leftIcon, rightIcon, className = '', children, ...props }, ref) => {
    const classes = [
      'athena-badge',
      `athena-badge-${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classes} {...props}>
        {dot && <span className="athena-badge-dot" />}
        {leftIcon && <span>{leftIcon}</span>}
        {children}
        {rightIcon && <span>{rightIcon}</span>}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
