import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';

export type TransactionType = 'pix' | 'ted' | 'doc' | 'card' | 'boleto' | 'transfer' | 'deposit' | 'withdrawal' | 'payment' | 'loan';

export interface TransactionItemProps extends HTMLAttributes<HTMLDivElement> {
  type: TransactionType;
  title: string;
  subtitle?: string;
  amount: number;
  date: Date | string;
  icon?: ReactNode;
  currency?: string;
  locale?: string;
}

const PixIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5" />
  </svg>
);

const TransferIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const CardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const BoletoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h2v16H2zM6 4h1v16H6zM9 4h2v16H9zM13 4h1v16h-1zM16 4h3v16h-3zM21 4h1v16h-1z" />
  </svg>
);

const DepositIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const WithdrawalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const PaymentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LoanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const iconMap: Record<TransactionType, React.FC> = {
  pix: PixIcon,
  ted: TransferIcon,
  doc: TransferIcon,
  card: CardIcon,
  boleto: BoletoIcon,
  transfer: TransferIcon,
  deposit: DepositIcon,
  withdrawal: WithdrawalIcon,
  payment: PaymentIcon,
  loan: LoanIcon,
};

const TransactionItem = forwardRef<HTMLDivElement, TransactionItemProps>(
  (
    {
      type,
      title,
      subtitle,
      amount,
      date,
      icon,
      currency = 'BRL',
      locale = 'pt-BR',
      className = '',
      ...props
    },
    ref
  ) => {
    const Icon = icon || iconMap[type];

    const formattedAmount = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));

    const displayAmount = amount >= 0 ? `+ ${formattedAmount}` : `- ${formattedAmount}`;

    const formattedDate =
      typeof date === 'string'
        ? date
        : new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: 'short',
          }).format(date);

    const amountColorClass = amount >= 0 ? 'athena-amount-positive' : 'athena-amount-negative';

    return (
      <div ref={ref} className={`athena-transaction ${className}`} {...props}>
        <div className="athena-transaction-icon">
          {typeof Icon === 'function' ? <Icon /> : Icon}
        </div>
        <div className="athena-transaction-content">
          <div className="athena-transaction-title truncate">{title}</div>
          {subtitle && (
            <div className="athena-transaction-subtitle truncate">{subtitle}</div>
          )}
        </div>
        <div className="athena-transaction-amount">
          <div className={`athena-transaction-value ${amountColorClass}`}>
            {displayAmount}
          </div>
          <div className="athena-transaction-date">{formattedDate}</div>
        </div>
      </div>
    );
  }
);

TransactionItem.displayName = 'TransactionItem';

export default TransactionItem;
