import React, { forwardRef, SelectHTMLAttributes, useId, ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder,
      size = 'md',
      fullWidth = true,
      leftIcon,
      required,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    const wrapperClasses = ['athena-input-wrapper', fullWidth && 'w-full']
      .filter(Boolean)
      .join(' ');

    const selectClasses = [
      'athena-input athena-select',
      leftIcon && 'athena-input-with-icon',
      error && 'athena-input-error',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const labelClasses = [
      'athena-input-label',
      required && 'athena-input-label-required',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={selectId} className={labelClasses}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {leftIcon && <span className="athena-input-icon">{leftIcon}</span>}
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <span id={`${selectId}-error`} className="athena-input-error-message" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${selectId}-helper`} className="athena-input-helper">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
