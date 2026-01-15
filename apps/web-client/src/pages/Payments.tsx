import React from 'react'

export default function Payments() {
  return (
    <div className="payments-page">
      {/* Header */}
      <div className="payments-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h1>Pagamentos</h1>
        <p>Escolha como quer pagar</p>
      </div>

      {/* Payment Options */}
      <div className="options-section">
        <a href="#/pix" className="option-card">
          <div className="option-icon pix">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5" />
            </svg>
          </div>
          <div className="option-info">
            <span className="option-name">Pix</span>
            <span className="option-desc">Pagamento instantâneo</span>
          </div>
          <div className="option-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </a>

        <a href="#/boleto" className="option-card">
          <div className="option-icon boleto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
            </svg>
          </div>
          <div className="option-info">
            <span className="option-name">Boleto</span>
            <span className="option-desc">Pagar ou gerar boleto</span>
          </div>
          <div className="option-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </a>

        <a href="#/cards" className="option-card">
          <div className="option-icon card">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div className="option-info">
            <span className="option-name">Cartão</span>
            <span className="option-desc">Crédito ou débito</span>
          </div>
          <div className="option-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </a>

        <div className="option-card disabled">
          <div className="option-icon transfer">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </div>
          <div className="option-info">
            <span className="option-name">TED/DOC</span>
            <span className="option-desc">Em breve</span>
          </div>
          <span className="coming-badge">Em breve</span>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="recent-section">
        <h3>Pagamentos recentes</h3>
        <div className="recent-list">
          <div className="recent-item">
            <div className="recent-icon pix">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5" />
              </svg>
            </div>
            <div className="recent-info">
              <span className="recent-name">Pix para João Silva</span>
              <span className="recent-date">Hoje, 14:32</span>
            </div>
            <span className="recent-amount">- R$ 150,00</span>
          </div>
          <div className="recent-item">
            <div className="recent-icon boleto">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
              </svg>
            </div>
            <div className="recent-info">
              <span className="recent-name">Conta de luz</span>
              <span className="recent-date">Ontem, 10:15</span>
            </div>
            <span className="recent-amount">- R$ 245,00</span>
          </div>
          <div className="recent-item">
            <div className="recent-icon card">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="recent-info">
              <span className="recent-name">Spotify Premium</span>
              <span className="recent-date">12 Jan, 08:00</span>
            </div>
            <span className="recent-amount">- R$ 21,90</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="info-content">
            <span className="info-title">Seus pagamentos estão protegidos</span>
            <span className="info-desc">Todas as transações são criptografadas e monitoradas 24h.</span>
          </div>
        </div>
      </div>

      <style>{`
        .payments-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .payments-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          text-align: center;
          border-bottom: 1px solid #262626;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 16px;
          color: #C9A227;
        }

        .payments-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .payments-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Options Section */
        .options-section {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .option-card:hover {
          border-color: #C9A227;
          transform: translateX(4px);
        }

        .option-card.disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        .option-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }

        .option-icon.pix {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          color: #C9A227;
        }

        .option-icon.boleto {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #3B82F6;
        }

        .option-icon.card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%);
          color: #8B5CF6;
        }

        .option-icon.transfer {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          color: #22C55E;
        }

        .option-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .option-name {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .option-desc {
          font-size: 13px;
          color: #A3A3A3;
        }

        .option-arrow {
          color: #666;
        }

        .coming-badge {
          padding: 4px 12px;
          background: #262626;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        /* Recent Section */
        .recent-section {
          padding: 0 20px 20px;
        }

        .recent-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          transition: all 0.2s ease;
        }

        .recent-item:hover {
          border-color: rgba(201, 162, 39, 0.3);
        }

        .recent-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .recent-icon.pix {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .recent-icon.boleto {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .recent-icon.card {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
        }

        .recent-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recent-name {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .recent-date {
          font-size: 12px;
          color: #666;
        }

        .recent-amount {
          font-size: 15px;
          font-weight: 600;
          color: #EF4444;
        }

        /* Info Section */
        .info-section {
          padding: 0 20px;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 16px;
        }

        .info-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 12px;
          color: #22C55E;
        }

        .info-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-title {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .info-desc {
          font-size: 13px;
          color: #A3A3A3;
        }
      `}</style>
    </div>
  )
}
