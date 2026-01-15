import React from 'react'
import api from '../api/client'
import { CFG } from '../config'

export default function Cards() {
  const [cards, setCards] = React.useState<any[]>([])
  const [detail, setDetail] = React.useState<any | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [showData, setShowData] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const list = await api._unsafeFetch('/cards/cards')
        if (mounted) setCards(Array.isArray(list) ? list : [])
      } catch (e) {
        console.error('cards list failed', e)
        // Demo data
        if (mounted) setCards([
          { id: 'card-001', brand: 'Mastercard', last4: '4532', type: 'credit', status: 'active' },
          { id: 'card-002', brand: 'Visa', last4: '7891', type: 'virtual', status: 'active' },
        ])
      }
    })()
    return () => { mounted = false }
  }, [])

  async function open(id: string) {
    try {
      setLoading(true)
      const base = CFG?.VITE_CARD_BASE || (window as any).CFG?.VITE_CARD_BASE || 'http://localhost:9084'
      const res = await fetch(`${base}/card/${id}`)
      const js = await res.json()
      setDetail(js)
    } catch (e) {
      console.error('card detail failed', e)
      // Demo data
      setDetail({
        id,
        brand: 'Mastercard',
        last4: '4532',
        holder: 'USUARIO ATHENA',
        exp_month: '12',
        exp_year: '2028',
        cvv: '***',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cards-page">
      {/* Header */}
      <div className="cards-header">
        <div className="header-content">
          <h1>Meus Cartões</h1>
          <p>Gerencie seus cartões físicos e virtuais</p>
        </div>
      </div>

      {/* Card Visual */}
      <div className="card-visual-section">
        <div className="credit-card">
          <div className="card-bg-pattern" />
          <div className="card-top">
            <div className="card-chip">
              <div className="chip-line" />
              <div className="chip-line" />
              <div className="chip-line" />
            </div>
            <div className="card-contactless">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 14.5A5 5 0 0 1 7 11a5 5 0 0 1 1.5-3.5" />
                <path d="M12 18a8 8 0 0 1-4-7 8 8 0 0 1 4-7" />
                <path d="M15.5 14.5A5 5 0 0 0 17 11a5 5 0 0 0-1.5-3.5" />
              </svg>
            </div>
          </div>
          <div className="card-number">
            •••• •••• •••• {cards[0]?.last4 || '4532'}
          </div>
          <div className="card-bottom">
            <div className="card-info">
              <span className="label">TITULAR</span>
              <span className="value">USUARIO ATHENA</span>
            </div>
            <div className="card-info">
              <span className="label">VALIDADE</span>
              <span className="value">12/28</span>
            </div>
            <div className="card-brand">
              <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
                <circle cx="18" cy="16" r="12" fill="#EB001B" fillOpacity="0.9" />
                <circle cx="30" cy="16" r="12" fill="#F79E1B" fillOpacity="0.9" />
                <path d="M24 6.5a12 12 0 0 0 0 19" fill="#FF5F00" fillOpacity="0.9" />
              </svg>
            </div>
          </div>
          <div className="card-logo">
            <span className="logo-dot" />
            <span>Athena</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-actions">
        <button className="action-btn" onClick={() => cards[0] && open(cards[0].id)}>
          <div className="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span>Ver dados</span>
        </button>
        <button className="action-btn">
          <div className="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <span>Bloquear</span>
        </button>
        <button className="action-btn">
          <div className="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <span>Configurar</span>
        </button>
        <button className="action-btn gold">
          <div className="action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <span>Cartão virtual</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="cards-list">
        <h3>Todos os cartões</h3>
        {cards.map((c: any) => (
          <div key={c.id} className="card-item" onClick={() => open(c.id)}>
            <div className="card-item-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="card-item-info">
              <span className="card-item-brand">{c.brand || 'Athena Card'}</span>
              <span className="card-item-number">•••• {String(c.last4 || c.pan_last4 || c.id?.slice(-4) || '').padStart(4, '•')}</span>
            </div>
            <div className="card-item-type">
              <span className={`type-badge ${c.type === 'virtual' ? 'virtual' : ''}`}>
                {c.type === 'virtual' ? 'Virtual' : 'Físico'}
              </span>
            </div>
            <div className="card-item-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <p>Nenhum cartão encontrado</p>
            <button className="btn-gold">Solicitar cartão</button>
          </div>
        )}
      </div>

      {/* Fatura Section */}
      <div className="invoice-section">
        <div className="invoice-header">
          <h3>Fatura atual</h3>
          <span className="invoice-status">Aberta</span>
        </div>
        <div className="invoice-amount">
          <span className="label">Total</span>
          <span className="value">R$ 1.247,50</span>
        </div>
        <div className="invoice-details">
          <div className="invoice-row">
            <span>Fecha em</span>
            <span>15 Fev</span>
          </div>
          <div className="invoice-row">
            <span>Vencimento</span>
            <span>22 Fev</span>
          </div>
          <div className="invoice-row">
            <span>Limite disponível</span>
            <span className="gold">R$ 8.752,50</span>
          </div>
        </div>
        <button className="btn-outline">Ver fatura completa</button>
      </div>

      {/* Modal */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Dados do Cartão</h3>
              <button className="close-btn" onClick={() => setDetail(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {loading ? (
              <div className="modal-loading">
                <div className="spinner" />
                <span>Carregando...</span>
              </div>
            ) : (
              <div className="modal-content">
                <div className="modal-card-preview">
                  <div className="mini-card">
                    <div className="mini-chip" />
                    <div className="mini-number">•••• {detail.last4 || detail.pan_last4 || '****'}</div>
                  </div>
                </div>
                <div className="modal-info">
                  <div className="info-row">
                    <span className="label">Bandeira</span>
                    <span className="value">{detail.brand || detail.scheme || 'Cartão'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Número</span>
                    <span className="value">•••• •••• •••• {detail.last4 || detail.pan_last4 || '****'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Titular</span>
                    <span className="value">{detail.holder || detail.holder_name || 'USUARIO ATHENA'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Validade</span>
                    <span className="value">{detail.exp || (detail.exp_month && detail.exp_year ? `${detail.exp_month}/${detail.exp_year}` : '12/28')}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">CVV</span>
                    <button className="show-cvv" onClick={() => setShowData(!showData)}>
                      {showData ? (detail.cvv || detail.cvv_ephemeral || '123') : '•••'}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn-outline-modal">Copiar dados</button>
                  <button className="btn-gold-modal">Gerar virtual</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .cards-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        .cards-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          border-bottom: 1px solid #262626;
        }

        .header-content h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .header-content p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Card Visual */
        .card-visual-section {
          padding: 24px 20px;
          display: flex;
          justify-content: center;
        }

        .credit-card {
          width: 100%;
          max-width: 360px;
          aspect-ratio: 1.586;
          background: linear-gradient(145deg, #1A1A1A 0%, #0D0D0D 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 162, 39, 0.1);
        }

        .card-bg-pattern {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 100% 0%, rgba(201, 162, 39, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .card-chip {
          width: 45px;
          height: 35px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 3px;
          padding: 6px;
        }

        .chip-line {
          height: 2px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 1px;
        }

        .card-contactless {
          color: rgba(255, 255, 255, 0.5);
          transform: rotate(90deg);
        }

        .card-number {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 3px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .card-bottom {
          display: flex;
          align-items: flex-end;
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        .card-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-info .label {
          font-size: 9px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .card-info .value {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        .card-brand {
          margin-left: auto;
        }

        .card-logo {
          position: absolute;
          top: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }

        .card-logo .logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
        }

        /* Card Actions */
        .card-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 0 20px 24px;
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
          border-color: #C9A227;
          transform: translateY(-2px);
        }

        .action-btn.gold {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border-color: rgba(201, 162, 39, 0.5);
        }

        .action-btn.gold .action-icon {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          color: #0D0D0D;
        }

        .action-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #C9A227;
        }

        .action-btn span {
          font-size: 12px;
          font-weight: 500;
        }

        /* Cards List */
        .cards-list {
          padding: 0 20px 24px;
        }

        .cards-list h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .card-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-item:hover {
          border-color: #C9A227;
          background: #262626;
        }

        .card-item-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 12px;
          color: #C9A227;
        }

        .card-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-item-brand {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .card-item-number {
          font-size: 13px;
          color: #A3A3A3;
        }

        .type-badge {
          padding: 4px 10px;
          background: #262626;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #A3A3A3;
        }

        .type-badge.virtual {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .card-item-arrow {
          color: #666;
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
          margin: 0 0 20px;
        }

        .btn-gold {
          padding: 14px 28px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 12px;
          color: #0D0D0D;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Invoice Section */
        .invoice-section {
          margin: 0 20px;
          padding: 20px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .invoice-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .invoice-status {
          padding: 4px 12px;
          background: rgba(201, 162, 39, 0.15);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #C9A227;
        }

        .invoice-amount {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #262626;
          margin-bottom: 16px;
        }

        .invoice-amount .label {
          display: block;
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }

        .invoice-amount .value {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
        }

        .invoice-details {
          margin-bottom: 20px;
        }

        .invoice-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: #A3A3A3;
          border-bottom: 1px solid #262626;
        }

        .invoice-row:last-child {
          border-bottom: none;
        }

        .invoice-row .gold {
          color: #C9A227;
          font-weight: 600;
        }

        .btn-outline {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-outline:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 400px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 24px;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #262626;
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: none;
          border-radius: 10px;
          color: #A3A3A3;
          cursor: pointer;
        }

        .modal-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
          color: #A3A3A3;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #333;
          border-top-color: #C9A227;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .modal-content {
          padding: 20px;
        }

        .modal-card-preview {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .mini-card {
          width: 180px;
          height: 110px;
          background: linear-gradient(145deg, #262626 0%, #1A1A1A 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .mini-chip {
          width: 28px;
          height: 20px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border-radius: 4px;
        }

        .mini-number {
          font-size: 13px;
          color: #fff;
          letter-spacing: 2px;
        }

        .modal-info {
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #262626;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row .label {
          font-size: 13px;
          color: #666;
        }

        .info-row .value {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .show-cvv {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 8px;
          color: #C9A227;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .btn-outline-modal {
          padding: 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-gold-modal {
          padding: 14px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          border-radius: 12px;
          color: #0D0D0D;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .card-actions {
            grid-template-columns: repeat(2, 1fr);
          }

          .credit-card {
            padding: 20px;
          }

          .card-number {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}
