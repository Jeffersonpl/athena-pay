import React, { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success = false,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = true,
      required,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const wrapperClasses = [
      'athena-input-wrapper',
      fullWidth && 'w-full',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'athena-input',
      leftIcon && 'athena-input-with-icon',
      error && 'athena-input-error',
      success && 'athena-input-success',
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
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {leftIcon && <span className="athena-input-icon">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="athena-input-icon" style={{ left: 'auto', right: 'var(--space-3)' }}>
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="athena-input-error-message" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={`${inputId}-helper`} className="athena-input-helper">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
