import React, { forwardRef, HTMLAttributes, useState } from 'react';

export interface AmountProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  currency?: string;
  locale?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSign?: boolean;
  blurred?: boolean;
  toggleBlur?: boolean;
}

const Amount = forwardRef<HTMLSpanElement, AmountProps>(
  (
    {
      value,
      currency = 'BRL',
      locale = 'pt-BR',
      size = 'md',
      showSign = true,
      blurred = false,
      toggleBlur = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isBlurred, setIsBlurred] = useState(blurred);

    const formattedValue = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));

    const displayValue = showSign && value !== 0
      ? `${value > 0 ? '+' : '-'} ${formattedValue}`
      : formattedValue;

    const colorClass = showSign
      ? value > 0
        ? 'athena-amount-positive'
        : value < 0
        ? 'athena-amount-negative'
        : ''
      : '';

    const classes = [
      'athena-amount',
      `athena-amount-${size}`,
      colorClass,
      isBlurred && 'athena-amount-blur',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = () => {
      if (toggleBlur) {
        setIsBlurred(!isBlurred);
      }
    };

    return (
      <span
        ref={ref}
        className={classes}
        onClick={handleClick}
        style={{ cursor: toggleBlur ? 'pointer' : undefined }}
        {...props}
      >
        {displayValue}
      </span>
    );
  }
);

Amount.displayName = 'Amount';

export default Amount;
