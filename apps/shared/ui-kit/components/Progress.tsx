import React, { forwardRef, HTMLAttributes } from 'react';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      variant = 'primary',
      size = 'md',
      showLabel = false,
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const containerClasses = [
      'athena-progress',
      variant !== 'primary' && `athena-progress-${variant}`,
      size !== 'md' && `athena-progress-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1">
        {(showLabel || label) && (
          <div className="flex justify-between text-sm">
            <span className="text-secondary">{label}</span>
            {showLabel && <span className="text-tertiary">{Math.round(percentage)}%</span>}
          </div>
        )}
        <div
          ref={ref}
          className={containerClasses}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          <div
            className="athena-progress-bar"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export default Progress;
