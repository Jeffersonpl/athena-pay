import React, { forwardRef, InputHTMLAttributes, useId } from 'react';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  labelPosition?: 'left' | 'right';
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      labelPosition = 'right',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const toggleId = id || generatedId;

    const wrapperClasses = [
      'athena-toggle',
      labelPosition === 'left' && 'flex-row-reverse',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={wrapperClasses} htmlFor={toggleId}>
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          className="athena-toggle-input"
          {...props}
        />
        <span className="athena-toggle-track" />
        <span className="athena-toggle-thumb" />
        {label && (
          <span
            className="text-sm text-primary"
            style={{ marginLeft: labelPosition === 'right' ? 'var(--space-3)' : 0, marginRight: labelPosition === 'left' ? 'var(--space-3)' : 0 }}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
