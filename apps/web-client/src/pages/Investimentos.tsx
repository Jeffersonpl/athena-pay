import React from 'react'

export default function Investimentos() {
  const investments = [
    { id: 1, name: 'CDB Athena', type: 'Renda Fixa', rate: '110% CDI', balance: 5000, yield: 245.50, risk: 'Baixo' },
    { id: 2, name: 'LCI Premium', type: 'Renda Fixa', rate: '95% CDI', balance: 10000, yield: 420.00, risk: 'Baixo' },
    { id: 3, name: 'Fundo Multi', type: 'Multimercado', rate: '+8.5% a.a.', balance: 3500, yield: 180.25, risk: 'Médio' },
  ]

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const totalBalance = investments.reduce((acc, inv) => acc + inv.balance, 0)
  const totalYield = investments.reduce((acc, inv) => acc + inv.yield, 0)

  return (
    <div className="invest-page">
      {/* Header */}
      <div className="invest-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="20" x2="12" y2="10" />
            <line x1="18" y1="20" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <h1>Investimentos</h1>
        <p>Faça seu dinheiro render mais</p>
      </div>

      {/* Portfolio Summary */}
      <div className="portfolio-section">
        <div className="portfolio-card">
          <div className="portfolio-header">
            <span>Patrimônio total</span>
            <div className="portfolio-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              +{((totalYield / totalBalance) * 100).toFixed(2)}%
            </div>
          </div>
          <div className="portfolio-amount">{formatCurrency(totalBalance + totalYield)}</div>
          <div className="portfolio-details">
            <div className="detail-item">
              <span className="label">Aplicado</span>
              <span className="value">{formatCurrency(totalBalance)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Rendimento</span>
              <span className="value positive">+{formatCurrency(totalYield)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <button className="action-btn">
          <div className="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span>Investir</span>
        </button>
        <button className="action-btn">
          <div className="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
          <span>Resgatar</span>
        </button>
        <button className="action-btn">
          <div className="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <span>Explorar</span>
        </button>
      </div>

      {/* Investments List */}
      <div className="investments-section">
        <h3>Meus investimentos</h3>
        <div className="investments-list">
          {investments.map(inv => (
            <div key={inv.id} className="invest-item">
              <div className="invest-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="invest-info">
                <div className="invest-main">
                  <span className="invest-name">{inv.name}</span>
                  <span className="invest-type">{inv.type}</span>
                </div>
                <div className="invest-meta">
                  <span className="invest-rate">{inv.rate}</span>
                  <span className={`invest-risk ${inv.risk.toLowerCase()}`}>{inv.risk}</span>
                </div>
              </div>
              <div className="invest-values">
                <span className="invest-balance">{formatCurrency(inv.balance)}</span>
                <span className="invest-yield">+{formatCurrency(inv.yield)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h3>Produtos disponíveis</h3>
        <div className="products-grid">
          <div className="product-card">
            <div className="product-icon cdb">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <div className="product-info">
              <span className="product-name">CDB</span>
              <span className="product-rate">Até 115% CDI</span>
            </div>
          </div>
          <div className="product-card">
            <div className="product-icon lci">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="product-info">
              <span className="product-name">LCI/LCA</span>
              <span className="product-rate">Isento de IR</span>
            </div>
          </div>
          <div className="product-card">
            <div className="product-icon fund">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div className="product-info">
              <span className="product-name">Fundos</span>
              <span className="product-rate">Diversificados</span>
            </div>
          </div>
          <div className="product-card coming-soon">
            <div className="product-icon crypto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="product-info">
              <span className="product-name">Cripto</span>
              <span className="product-rate">Em breve</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .invest-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .invest-header {
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
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px;
          color: #22C55E;
        }

        .invest-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .invest-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Portfolio Section */
        .portfolio-section {
          padding: 20px;
        }

        .portfolio-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          padding: 24px;
        }

        .portfolio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .portfolio-header span {
          font-size: 14px;
          color: #A3A3A3;
        }

        .portfolio-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #22C55E;
        }

        .portfolio-amount {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
        }

        .portfolio-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid #333;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item .label {
          font-size: 12px;
          color: #666;
        }

        .detail-item .value {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .detail-item .value.positive {
          color: #22C55E;
        }

        /* Actions Section */
        .actions-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 0 20px 20px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 8px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          border-color: #22C55E;
          transform: translateY(-2px);
        }

        .action-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          border-radius: 12px;
          color: #22C55E;
        }

        .action-btn span {
          font-size: 13px;
          font-weight: 500;
        }

        /* Investments Section */
        .investments-section {
          padding: 0 20px 20px;
        }

        .investments-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .investments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .invest-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .invest-item:hover {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .invest-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #22C55E;
        }

        .invest-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .invest-main {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .invest-name {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .invest-type {
          font-size: 11px;
          padding: 2px 8px;
          background: #262626;
          border-radius: 10px;
          color: #A3A3A3;
        }

        .invest-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .invest-rate {
          font-size: 13px;
          color: #22C55E;
          font-weight: 500;
        }

        .invest-risk {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .invest-risk.baixo {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .invest-risk.médio {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
        }

        .invest-risk.alto {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .invest-values {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .invest-balance {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .invest-yield {
          font-size: 13px;
          color: #22C55E;
        }

        /* Products Section */
        .products-section {
          padding: 0 20px 20px;
        }

        .products-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .product-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .product-card:hover {
          border-color: #C9A227;
        }

        .product-card.coming-soon {
          opacity: 0.6;
        }

        .product-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .product-icon.cdb {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .product-icon.lci {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .product-icon.fund {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .product-icon.crypto {
          background: rgba(139, 92, 246, 0.15);
          color: #8B5CF6;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .product-rate {
          font-size: 12px;
          color: #A3A3A3;
        }

        @media (max-width: 480px) {
          .portfolio-amount {
            font-size: 28px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
