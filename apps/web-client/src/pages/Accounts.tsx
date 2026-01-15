import React, { useState, useEffect } from 'react'
import api from '../api/http'

export default function Accounts() {
  const [acc] = useState('acc-001')
  const [bal, setBal] = useState<any>(null)
  const [tx, setTx] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const b = await api.get(`/balances/${acc}`)
      setBal(b.data)
      const s = await api.get(`/statement/${acc}`)
      setTx(s.data || [])
    } catch {
      // Demo data
      setBal({ available: '12.458,32', pending: '250,00' })
      setTx([
        { id: '1', type: 'PIX_IN', amount: 1500.00, description: 'PIX recebido - João Silva', date: '2025-01-15', time: '14:32' },
        { id: '2', type: 'PIX_OUT', amount: -250.00, description: 'PIX enviado - Maria Santos', date: '2025-01-15', time: '10:15' },
        { id: '3', type: 'CARD', amount: -89.90, description: 'Spotify Premium', date: '2025-01-14', time: '08:00' },
        { id: '4', type: 'TRANSFER_IN', amount: 3000.00, description: 'Transferência recebida', date: '2025-01-13', time: '16:45' },
        { id: '5', type: 'CARD', amount: -156.80, description: 'iFood Delivery', date: '2025-01-12', time: '20:30' },
        { id: '6', type: 'PIX_OUT', amount: -500.00, description: 'PIX enviado - Pedro Costa', date: '2025-01-11', time: '11:20' },
        { id: '7', type: 'BOLETO', amount: -245.00, description: 'Conta de luz', date: '2025-01-10', time: '09:00' },
      ])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const getTypeIcon = (type: string) => {
    if (type?.includes('PIX')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5" />
        </svg>
      )
    }
    if (type?.includes('CARD')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      )
    }
    if (type?.includes('TRANSFER')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      )
    }
    if (type?.includes('BOLETO')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
        </svg>
      )
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    )
  }

  const getTypeColor = (type: string, amount: number) => {
    if (amount > 0) return '#22C55E'
    if (type?.includes('PIX')) return '#C9A227'
    if (type?.includes('CARD')) return '#EF4444'
    return '#A3A3A3'
  }

  const filteredTx = tx.filter(t => {
    if (filter === 'in') return t.amount > 0
    if (filter === 'out') return t.amount < 0
    return true
  })

  const formatCurrency = (value: number | string) => {
    if (typeof value === 'string') return `R$ ${value}`
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  return (
    <div className="accounts-page">
      {/* Header */}
      <div className="accounts-header">
        <h1>Extrato</h1>
        <p>Acompanhe suas movimentações</p>
      </div>

      {/* Balance Card */}
      <div className="balance-section">
        <div className="balance-card">
          <div className="balance-header">
            <span>Saldo disponível</span>
            <button className="refresh-btn" onClick={load}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>
          <div className="balance-amount">
            {loading ? (
              <div className="skeleton" style={{ width: 200, height: 44 }} />
            ) : (
              formatCurrency(bal?.available || 0)
            )}
          </div>
          <div className="balance-pending">
            <span>Bloqueado</span>
            <span>{loading ? '...' : formatCurrency(bal?.pending || 0)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-section">
        <div className="stat-card in">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Entradas</span>
            <span className="stat-value">R$ 4.500,00</span>
          </div>
        </div>
        <div className="stat-card out">
          <div className="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Saídas</span>
            <span className="stat-value">R$ 1.241,70</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Todas
        </button>
        <button className={`filter-btn ${filter === 'in' ? 'active' : ''}`} onClick={() => setFilter('in')}>
          Entradas
        </button>
        <button className={`filter-btn ${filter === 'out' ? 'active' : ''}`} onClick={() => setFilter('out')}>
          Saídas
        </button>
      </div>

      {/* Transactions */}
      <div className="transactions-section">
        <h3>Movimentações</h3>

        {loading ? (
          <div className="transactions-loading">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="tx-skeleton">
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '40%', height: 12 }} />
                </div>
                <div className="skeleton" style={{ width: 80, height: 20 }} />
              </div>
            ))}
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <p>Nenhuma movimentação encontrada</p>
          </div>
        ) : (
          <div className="transactions-list">
            {filteredTx.map((t: any) => (
              <div key={t.id} className="tx-item">
                <div className="tx-icon" style={{ color: getTypeColor(t.type, t.amount) }}>
                  {getTypeIcon(t.type)}
                </div>
                <div className="tx-info">
                  <span className="tx-description">{t.description}</span>
                  <span className="tx-meta">
                    {t.date} {t.time && `• ${t.time}`}
                  </span>
                </div>
                <div className={`tx-amount ${t.amount > 0 ? 'positive' : 'negative'}`}>
                  {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="export-section">
        <button className="export-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar PDF
        </button>
        <button className="export-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          Exportar Excel
        </button>
      </div>

      <style>{`
        .accounts-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .accounts-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          border-bottom: 1px solid #262626;
        }

        .accounts-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .accounts-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Balance Section */
        .balance-section {
          padding: 20px;
        }

        .balance-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          padding: 24px;
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .balance-header span {
          font-size: 14px;
          color: #A3A3A3;
        }

        .refresh-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 1px solid #333;
          border-radius: 10px;
          color: #A3A3A3;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-btn:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .balance-amount {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }

        .balance-pending {
          display: flex;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #333;
          font-size: 14px;
          color: #666;
        }

        /* Stats Section */
        .stats-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 0 20px 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-card.in .stat-icon {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .stat-card.out .stat-icon {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        /* Filters */
        .filters-section {
          display: flex;
          gap: 8px;
          padding: 0 20px 20px;
        }

        .filter-btn {
          padding: 10px 20px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          color: #A3A3A3;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: #C9A227;
        }

        .filter-btn.active {
          background: rgba(201, 162, 39, 0.15);
          border-color: #C9A227;
          color: #C9A227;
        }

        /* Transactions */
        .transactions-section {
          padding: 0 20px 20px;
        }

        .transactions-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tx-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .tx-item:hover {
          border-color: rgba(201, 162, 39, 0.3);
        }

        .tx-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
        }

        .tx-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .tx-description {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tx-meta {
          font-size: 12px;
          color: #666;
        }

        .tx-amount {
          font-size: 15px;
          font-weight: 600;
          white-space: nowrap;
        }

        .tx-amount.positive {
          color: #22C55E;
        }

        .tx-amount.negative {
          color: #EF4444;
        }

        /* Loading */
        .transactions-loading {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tx-skeleton {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
        }

        .skeleton {
          background: linear-gradient(90deg, #262626 25%, #333 50%, #262626 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state p {
          color: #666;
          margin: 0;
        }

        /* Export Section */
        .export-section {
          display: flex;
          gap: 12px;
          padding: 0 20px;
        }

        .export-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          color: #A3A3A3;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-btn:hover {
          border-color: #C9A227;
          color: #fff;
        }

        @media (max-width: 480px) {
          .balance-amount {
            font-size: 28px;
          }

          .stats-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
