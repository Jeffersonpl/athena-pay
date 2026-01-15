import React from 'react'
import { useToast } from '../ui/Toast'

export default function Boleto() {
  const { showToast } = useToast()
  const [code, setCode] = React.useState('')
  const [payCode, setPayCode] = React.useState('')
  const [tab, setTab] = React.useState<'generate' | 'pay'>('generate')

  function gerar() {
    const rand = () => Math.random().toString().slice(2, 13)
    setCode(`${rand()}${rand()}`.slice(0, 47))
    showToast('success', 'Boleto gerado com sucesso!')
  }

  return (
    <div className="boleto-page">
      {/* Header */}
      <div className="boleto-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
          </svg>
        </div>
        <h1>Boleto</h1>
        <p>Gere ou pague boletos</p>
      </div>

      {/* Tabs */}
      <div className="boleto-tabs">
        <button className={`tab ${tab === 'generate' ? 'active' : ''}`} onClick={() => setTab('generate')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Gerar
        </button>
        <button className={`tab ${tab === 'pay' ? 'active' : ''}`} onClick={() => setTab('pay')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Pagar
        </button>
      </div>

      {/* Content */}
      <div className="boleto-content">
        {tab === 'generate' && (
          <div className="generate-section">
            <div className="form-card">
              <div className="form-header">
                <div className="form-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
                  </svg>
                </div>
                <div>
                  <h3>Gerar Boleto</h3>
                  <p>Crie um boleto para receber pagamentos</p>
                </div>
              </div>

              <div className="form-group">
                <label>Valor do boleto</label>
                <div className="amount-input-wrapper">
                  <span className="currency">R$</span>
                  <input type="text" placeholder="0,00" className="amount-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Vencimento</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <input type="date" />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição (opcional)</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="17" y1="10" x2="3" y2="10" />
                    <line x1="21" y1="6" x2="3" y2="6" />
                    <line x1="21" y1="14" x2="3" y2="14" />
                    <line x1="17" y1="18" x2="3" y2="18" />
                  </svg>
                  <input type="text" placeholder="Descrição do boleto" />
                </div>
              </div>

              <button className="btn-generate" onClick={gerar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
                </svg>
                Gerar Boleto
              </button>
            </div>

            {code && (
              <div className="code-section">
                <div className="code-card">
                  <div className="code-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Boleto gerado!</span>
                  </div>
                  <div className="code-label">Linha digitável</div>
                  <div className="code-value">{code}</div>
                  <div className="code-actions">
                    <button className="btn-copy">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copiar código
                    </button>
                    <button className="btn-share">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'pay' && (
          <div className="pay-section">
            <div className="form-card">
              <div className="form-header">
                <div className="form-icon pay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div>
                  <h3>Pagar Boleto</h3>
                  <p>Use a câmera ou digite o código</p>
                </div>
              </div>

              <button className="btn-scan">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                Escanear código de barras
              </button>

              <div className="divider">
                <span>ou digite o código</span>
              </div>

              <div className="form-group">
                <label>Linha digitável</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Digite o código de barras"
                    value={payCode}
                    onChange={e => setPayCode(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn-pay" disabled={!payCode}>
                Continuar
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            <div className="recent-boletos">
              <h4>Boletos recentes</h4>
              <div className="boleto-item">
                <div className="boleto-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
                  </svg>
                </div>
                <div className="boleto-info">
                  <span className="boleto-name">Conta de energia</span>
                  <span className="boleto-date">Vencimento: 20/01/2025</span>
                </div>
                <span className="boleto-amount">R$ 245,00</span>
              </div>
              <div className="boleto-item">
                <div className="boleto-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h2v18H3zM7 3h1v18H7zM11 3h2v18h-2zM15 3h2v18h-2zM19 3h2v18h-2z" />
                  </svg>
                </div>
                <div className="boleto-info">
                  <span className="boleto-name">Internet fibra</span>
                  <span className="boleto-date">Vencimento: 15/01/2025</span>
                </div>
                <span className="boleto-amount">R$ 129,90</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .boleto-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .boleto-header {
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

        .boleto-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .boleto-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Tabs */
        .boleto-tabs {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          background: #0D0D0D;
          border-bottom: 1px solid #262626;
        }

        .tab {
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
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover {
          border-color: #C9A227;
          color: #fff;
        }

        .tab.active {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border-color: #C9A227;
          color: #C9A227;
        }

        /* Content */
        .boleto-content {
          padding: 20px;
        }

        /* Form Card */
        .form-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border-radius: 14px;
          color: #C9A227;
        }

        .form-icon.pay {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #3B82F6;
        }

        .form-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .form-header p {
          font-size: 13px;
          color: #A3A3A3;
          margin: 4px 0 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #C9A227;
        }

        .input-wrapper svg {
          color: #666;
        }

        .input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        .input-wrapper input::placeholder {
          color: #666;
        }

        .amount-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .amount-input-wrapper:focus-within {
          border-color: #C9A227;
        }

        .currency {
          font-size: 18px;
          font-weight: 600;
          color: #666;
        }

        .amount-input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
        }

        .amount-input::placeholder {
          color: #444;
        }

        .btn-generate {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .btn-generate:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        /* Code Section */
        .code-section {
          margin-top: 20px;
        }

        .code-card {
          background: #1A1A1A;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          padding: 24px;
        }

        .code-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #22C55E;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .code-label {
          font-size: 13px;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .code-value {
          font-family: monospace;
          font-size: 16px;
          color: #fff;
          background: #262626;
          padding: 16px;
          border-radius: 12px;
          word-break: break-all;
          margin-bottom: 20px;
        }

        .code-actions {
          display: flex;
          gap: 12px;
        }

        .btn-copy, .btn-share {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy:hover, .btn-share:hover {
          border-color: #C9A227;
        }

        /* Pay Section */
        .btn-scan {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px 24px;
          background: #262626;
          border: 2px dashed #333;
          border-radius: 14px;
          color: #A3A3A3;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 20px;
        }

        .btn-scan:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #333;
        }

        .divider span {
          color: #666;
          font-size: 13px;
        }

        .btn-pay {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .btn-pay:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-pay:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        /* Recent Boletos */
        .recent-boletos {
          margin-top: 24px;
        }

        .recent-boletos h4 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 12px;
        }

        .boleto-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .boleto-item:hover {
          border-color: #C9A227;
        }

        .boleto-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #C9A227;
        }

        .boleto-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .boleto-name {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .boleto-date {
          font-size: 12px;
          color: #666;
        }

        .boleto-amount {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }
      `}</style>
    </div>
  )
}
