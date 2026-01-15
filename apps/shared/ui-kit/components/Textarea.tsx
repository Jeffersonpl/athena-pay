import React, { forwardRef, TextareaHTMLAttributes, useId } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  fullWidth?: boolean;
  showCharCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      success = false,
      fullWidth = true,
      showCharCount = false,
      required,
      maxLength,
      value,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    const charCount = typeof value === 'string' ? value.length : 0;

    const wrapperClasses = ['athena-input-wrapper', fullWidth && 'w-full']
      .filter(Boolean)
      .join(' ');

    const textareaClasses = [
      'athena-input athena-textarea',
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
          <label htmlFor={textareaId} className={labelClasses}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          required={required}
          maxLength={maxLength}
          value={value}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        <div className="flex justify-between">
          <div>
            {error && (
              <span id={`${textareaId}-error`} className="athena-input-error-message" role="alert">
                {error}
              </span>
            )}
            {!error && helperText && (
              <span id={`${textareaId}-helper`} className="athena-input-helper">
                {helperText}
              </span>
            )}
          </div>
          {showCharCount && maxLength && (
            <span className="athena-input-helper">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
