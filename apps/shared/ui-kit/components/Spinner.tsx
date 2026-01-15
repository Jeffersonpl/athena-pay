import React, { forwardRef, HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  label?: string;
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', color, label = 'Carregando...', className = '', style, ...props }, ref) => {
    const classes = [
      'athena-spinner',
      `athena-spinner-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const spinnerStyle = color
      ? { ...style, borderTopColor: color }
      : style;

    return (
      <div
        ref={ref}
        className={classes}
        style={spinnerStyle}
        role="status"
        aria-label={label}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;
