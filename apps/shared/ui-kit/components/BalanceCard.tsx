import React, { forwardRef, HTMLAttributes, useState } from 'react';

export interface BalanceCardProps extends HTMLAttributes<HTMLDivElement> {
  balance: number;
  label?: string;
  currency?: string;
  locale?: string;
  showBalance?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
  trend?: {
    value: number;
    label: string;
  };
  actions?: React.ReactNode;
}

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const BalanceCard = forwardRef<HTMLDivElement, BalanceCardProps>(
  (
    {
      balance,
      label = 'Saldo disponível',
      currency = 'BRL',
      locale = 'pt-BR',
      showBalance: controlledShowBalance,
      onToggleVisibility,
      trend,
      actions,
      className = '',
      ...props
    },
    ref
  ) => {
    const [internalShowBalance, setInternalShowBalance] = useState(true);

    const showBalance = controlledShowBalance ?? internalShowBalance;

    const toggleVisibility = () => {
      const newValue = !showBalance;
      if (onToggleVisibility) {
        onToggleVisibility(newValue);
      } else {
        setInternalShowBalance(newValue);
      }
    };

    const formattedBalance = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(balance);

    const cardStyle: React.CSSProperties = {
      background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
      borderRadius: 'var(--radius-2xl)',
      padding: 'var(--space-6)',
      color: 'white',
      boxShadow: 'var(--shadow-xl)',
    };

    return (
      <div ref={ref} className={className} style={cardStyle} {...props}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>{label}</span>
          <button
            onClick={toggleVisibility}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
            aria-label={showBalance ? 'Ocultar saldo' : 'Mostrar saldo'}
          >
            {showBalance ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>

        {/* Balance */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <div
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              fontVariantNumeric: 'tabular-nums',
              filter: showBalance ? 'none' : 'blur(8px)',
              transition: 'filter 0.2s ease',
              userSelect: showBalance ? 'auto' : 'none',
            }}
          >
            {formattedBalance}
          </div>
        </div>

        {/* Trend */}
        {trend && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
              opacity: 0.9,
              marginBottom: actions ? 'var(--space-4)' : 0,
            }}
          >
            {trend.value >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
            <span style={{ color: trend.value >= 0 ? '#a7f3d0' : '#fecaca' }}>
              {trend.value >= 0 ? '+' : ''}{trend.value.toFixed(1)}%
            </span>
            <span style={{ opacity: 0.7 }}>{trend.label}</span>
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {actions}
          </div>
        )}
      </div>
    );
  }
);

BalanceCard.displayName = 'BalanceCard';

export default BalanceCard;
