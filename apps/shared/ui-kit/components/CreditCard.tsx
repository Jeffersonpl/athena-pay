import React, { forwardRef, HTMLAttributes, useState } from 'react';

export interface CreditCardProps extends HTMLAttributes<HTMLDivElement> {
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  brand?: 'visa' | 'mastercard' | 'elo' | 'amex' | 'hipercard';
  variant?: 'physical' | 'virtual';
  isFlipped?: boolean;
  cvv?: string;
  frozen?: boolean;
  onFlip?: () => void;
}

const BrandLogos = {
  visa: () => (
    <svg viewBox="0 0 48 16" fill="currentColor" style={{ height: 24 }}>
      <path d="M18.3 1.3l-2.2 13.4h3.5l2.2-13.4h-3.5zM13.4 1.3L9.9 10.1l-.4-2.1-1.3-6.5s-.1-.2-.4-.2H3.1l-.1.3s2 .4 4.3 1.9L10 14.7h3.7l5.7-13.4h-6zM44.4 14.7h3.3l-2.9-13.4h-2.8c-.8 0-1 .7-1 .7l-5.3 12.7h3.7l.7-2h4.5l.4 2h-.6zm-3.9-4.7l1.9-5.2 1.1 5.2h-3zM35.9 4.6l.5-2.9s-1.5-.6-3.2-.6c-1.8 0-5.9.8-5.9 4.5 0 3.5 4.9 3.6 4.9 5.4 0 1.9-4.4 1.5-5.8.4l-.5 3s1.5.8 3.8.8c2.3 0 6.1-1.2 6.1-4.7 0-3.5-5-3.9-5-5.4 0-1.5 3.4-1.3 5.1-.5z"/>
    </svg>
  ),
  mastercard: () => (
    <svg viewBox="0 0 48 30" style={{ height: 28 }}>
      <circle cx="17" cy="15" r="14" fill="#EB001B"/>
      <circle cx="31" cy="15" r="14" fill="#F79E1B"/>
      <path d="M24 4.5a14 14 0 0 0-5 10.5 14 14 0 0 0 5 10.5 14 14 0 0 0 5-10.5 14 14 0 0 0-5-10.5z" fill="#FF5F00"/>
    </svg>
  ),
  elo: () => (
    <svg viewBox="0 0 48 20" fill="currentColor" style={{ height: 20 }}>
      <text x="0" y="16" fontFamily="Arial" fontSize="16" fontWeight="bold">elo</text>
    </svg>
  ),
  amex: () => (
    <svg viewBox="0 0 48 18" fill="currentColor" style={{ height: 18 }}>
      <text x="0" y="14" fontFamily="Arial" fontSize="12" fontWeight="bold">AMEX</text>
    </svg>
  ),
  hipercard: () => (
    <svg viewBox="0 0 48 18" fill="currentColor" style={{ height: 18 }}>
      <text x="0" y="14" fontFamily="Arial" fontSize="10" fontWeight="bold">HIPERCARD</text>
    </svg>
  ),
};

const ChipIcon = () => (
  <svg viewBox="0 0 40 30" style={{ width: 40, height: 30 }}>
    <rect x="1" y="1" width="38" height="28" rx="3" fill="#d4af37" stroke="#c9a227" strokeWidth="1"/>
    <line x1="1" y1="10" x2="39" y2="10" stroke="#c9a227" strokeWidth="1"/>
    <line x1="1" y1="20" x2="39" y2="20" stroke="#c9a227" strokeWidth="1"/>
    <line x1="14" y1="1" x2="14" y2="29" stroke="#c9a227" strokeWidth="1"/>
    <line x1="26" y1="1" x2="26" y2="29" stroke="#c9a227" strokeWidth="1"/>
  </svg>
);

const ContactlessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20, opacity: 0.7 }}>
    <path d="M8.5 14.5A5 5 0 0 1 14.5 8.5"/>
    <path d="M5.5 17.5A10 10 0 0 1 17.5 5.5"/>
    <path d="M2.5 20.5A15 15 0 0 1 20.5 2.5"/>
  </svg>
);

function formatCardNumber(number: string, masked = true): string {
  const clean = number.replace(/\D/g, '').slice(0, 16);
  const groups = clean.match(/.{1,4}/g) || [];

  if (masked && groups.length === 4) {
    return `${groups[0]} **** **** ${groups[3]}`;
  }

  return groups.join(' ');
}

const CreditCard = forwardRef<HTMLDivElement, CreditCardProps>(
  (
    {
      cardNumber,
      holderName,
      expiryDate,
      brand = 'visa',
      variant = 'physical',
      isFlipped = false,
      cvv = '***',
      frozen = false,
      onFlip,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showNumber, setShowNumber] = useState(false);
    const BrandLogo = BrandLogos[brand];

    const cardStyle: React.CSSProperties = {
      position: 'relative',
      width: '340px',
      height: '215px',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-5)',
      background: variant === 'virtual'
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: 'var(--font-mono)',
      cursor: onFlip ? 'pointer' : 'default',
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
      filter: frozen ? 'grayscale(0.8) brightness(0.7)' : 'none',
      boxShadow: 'var(--shadow-xl)',
    };

    const frontStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      padding: 'var(--space-5)',
      backfaceVisibility: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    };

    const backStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      backfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
      display: 'flex',
      flexDirection: 'column',
    };

    return (
      <div
        ref={ref}
        className={className}
        style={cardStyle}
        onClick={onFlip}
        {...props}
      >
        {/* Front */}
        <div style={frontStyle}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <ChipIcon />
              <ContactlessIcon />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {variant === 'virtual' && (
                <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8, textTransform: 'uppercase' }}>
                  Virtual
                </span>
              )}
              {frozen && (
                <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                  Congelado
                </span>
              )}
            </div>
          </div>

          {/* Card Number */}
          <div style={{ marginTop: 'auto' }}>
            <div
              style={{
                fontSize: 'var(--text-xl)',
                letterSpacing: '2px',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowNumber(!showNumber);
              }}
            >
              {formatCardNumber(cardNumber, !showNumber)}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, marginBottom: '2px' }}>
                TITULAR
              </div>
              <div style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase' }}>
                {holderName}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--text-xs)', opacity: 0.7, marginBottom: '2px' }}>
                VALIDADE
              </div>
              <div style={{ fontSize: 'var(--text-sm)' }}>
                {expiryDate}
              </div>
            </div>
            <div>
              <BrandLogo />
            </div>
          </div>
        </div>

        {/* Back */}
        <div style={backStyle}>
          <div style={{ width: '100%', height: '50px', background: '#2d2d2d', marginTop: 'var(--space-6)' }} />
          <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <div style={{ flex: 1, height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 var(--space-3)' }}>
                <span style={{ color: '#333', fontFamily: 'var(--font-mono)', fontStyle: 'italic' }}>{cvv}</span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>CVV</span>
            </div>
            <div style={{ marginTop: 'auto', fontSize: 'var(--text-xs)', opacity: 0.5, lineHeight: 1.4 }}>
              Este cartão é de uso pessoal e intransferível.
              Em caso de perda ou roubo, bloqueie imediatamente pelo app.
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CreditCard.displayName = 'CreditCard';

export default CreditCard;
