import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Limit {
  id: string;
  name: string;
  description: string;
  current: number;
  max: number;
  icon: React.ReactNode;
  category: 'pix' | 'card' | 'transfer' | 'withdraw';
}

const Limites: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'pix' | 'card' | 'transfer' | 'withdraw'>('pix');
  const [editingLimit, setEditingLimit] = useState<string | null>(null);
  const [newLimitValue, setNewLimitValue] = useState('');
  const [showAlertSettings, setShowAlertSettings] = useState(false);

  const [limits, setLimits] = useState<Limit[]>([
    {
      id: '1',
      name: 'PIX Diurno',
      description: '06h às 20h',
      current: 5000,
      max: 50000,
      category: 'pix',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
        </svg>
      ),
    },
    {
      id: '2',
      name: 'PIX Noturno',
      description: '20h às 06h',
      current: 1000,
      max: 5000,
      category: 'pix',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      ),
    },
    {
      id: '3',
      name: 'PIX Único',
      description: 'Por transação',
      current: 10000,
      max: 50000,
      category: 'pix',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
    },
    {
      id: '4',
      name: 'Limite do Cartão',
      description: 'Crédito disponível',
      current: 15000,
      max: 30000,
      category: 'card',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
    },
    {
      id: '5',
      name: 'Compra Online',
      description: 'Limite para e-commerce',
      current: 5000,
      max: 20000,
      category: 'card',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      ),
    },
    {
      id: '6',
      name: 'Compra Internacional',
      description: 'Limite em USD',
      current: 2000,
      max: 10000,
      category: 'card',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      ),
    },
    {
      id: '7',
      name: 'Transferência TED',
      description: 'Limite diário',
      current: 20000,
      max: 100000,
      category: 'transfer',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="19,12 12,19 5,12"/>
        </svg>
      ),
    },
    {
      id: '8',
      name: 'Transferência DOC',
      description: 'Limite diário',
      current: 4999,
      max: 4999,
      category: 'transfer',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      id: '9',
      name: 'Saque Diário',
      description: 'Caixas eletrônicos',
      current: 1500,
      max: 5000,
      category: 'withdraw',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M2 10h20"/>
          <path d="M6 16h.01M10 16h.01"/>
        </svg>
      ),
    },
    {
      id: '10',
      name: 'Saque Mensal',
      description: 'Total do mês',
      current: 5000,
      max: 20000,
      category: 'withdraw',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ]);

  const [alerts, setAlerts] = useState({
    onApproachLimit: true,
    onHighTransaction: true,
    highTransactionThreshold: 1000,
    weeklyReport: false,
  });

  const filteredLimits = limits.filter(l => l.category === activeTab);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleEditLimit = (limitId: string) => {
    const limit = limits.find(l => l.id === limitId);
    if (limit) {
      setNewLimitValue(limit.current.toString());
      setEditingLimit(limitId);
    }
  };

  const handleSaveLimit = () => {
    if (!editingLimit || !newLimitValue) return;

    const value = parseFloat(newLimitValue);
    const limit = limits.find(l => l.id === editingLimit);

    if (!limit) return;

    if (value > limit.max) {
      showToast(`O limite máximo é ${formatCurrency(limit.max)}`, 'error');
      return;
    }

    if (value < 0) {
      showToast('O limite não pode ser negativo', 'error');
      return;
    }

    setLimits(limits.map(l =>
      l.id === editingLimit ? { ...l, current: value } : l
    ));

    showToast('Limite atualizado com sucesso!', 'success');
    setEditingLimit(null);
    setNewLimitValue('');
  };

  const handleQuickAdjust = (limitId: string, percentage: number) => {
    const limit = limits.find(l => l.id === limitId);
    if (!limit) return;

    const newValue = Math.min(limit.max * percentage, limit.max);
    setLimits(limits.map(l =>
      l.id === limitId ? { ...l, current: newValue } : l
    ));
    showToast(`Limite ajustado para ${formatCurrency(newValue)}`, 'success');
  };

  const getPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div className="limites-page">
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h1>Limites e Controles</h1>
        <p>Gerencie os limites das suas transações</p>
      </div>

      <div className="alert-banner" onClick={() => setShowAlertSettings(true)}>
        <div className="alert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <span>Configurar alertas de limite</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'pix' ? 'active' : ''}`}
          onClick={() => setActiveTab('pix')}
        >
          PIX
        </button>
        <button
          className={`tab ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => setActiveTab('card')}
        >
          Cartão
        </button>
        <button
          className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transferência
        </button>
        <button
          className={`tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Saque
        </button>
      </div>

      <div className="limits-list">
        {filteredLimits.map(limit => (
          <div key={limit.id} className="limit-card">
            <div className="limit-header">
              <div className="limit-icon">
                {limit.icon}
              </div>
              <div className="limit-info">
                <span className="limit-name">{limit.name}</span>
                <span className="limit-desc">{limit.description}</span>
              </div>
            </div>

            <div className="limit-value">
              <div className="current-value">
                <span className="label">Limite atual</span>
                <span className="value">{formatCurrency(limit.current)}</span>
              </div>
              <div className="max-value">
                <span className="label">Máximo</span>
                <span className="value">{formatCurrency(limit.max)}</span>
              </div>
            </div>

            <div className="limit-bar">
              <div
                className="limit-fill"
                style={{ width: `${getPercentage(limit.current, limit.max)}%` }}
              />
              <span className="percentage">{getPercentage(limit.current, limit.max)}%</span>
            </div>

            {editingLimit === limit.id ? (
              <div className="edit-section">
                <div className="input-group">
                  <span className="currency">R$</span>
                  <input
                    type="number"
                    value={newLimitValue}
                    onChange={e => setNewLimitValue(e.target.value)}
                    placeholder="0,00"
                    max={limit.max}
                  />
                </div>
                <div className="edit-actions">
                  <button className="btn-cancel" onClick={() => setEditingLimit(null)}>
                    Cancelar
                  </button>
                  <button className="btn-save" onClick={handleSaveLimit}>
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="limit-actions">
                <div className="quick-adjust">
                  <button onClick={() => handleQuickAdjust(limit.id, 0.25)}>25%</button>
                  <button onClick={() => handleQuickAdjust(limit.id, 0.5)}>50%</button>
                  <button onClick={() => handleQuickAdjust(limit.id, 0.75)}>75%</button>
                  <button onClick={() => handleQuickAdjust(limit.id, 1)}>100%</button>
                </div>
                <button className="btn-edit" onClick={() => handleEditLimit(limit.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Editar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="security-tips">
        <h3>Dicas de Segurança</h3>
        <ul>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <path d="M22 4L12 14.01l-3-3"/>
            </svg>
            Mantenha limites noturnos mais baixos para maior segurança
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <path d="M22 4L12 14.01l-3-3"/>
            </svg>
            Ajuste o limite de compras online conforme seu uso
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <path d="M22 4L12 14.01l-3-3"/>
            </svg>
            Ative alertas para transações acima de valores específicos
          </li>
        </ul>
      </div>

      {showAlertSettings && (
        <div className="modal-overlay" onClick={() => setShowAlertSettings(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configurar Alertas</h3>
              <button className="btn-close" onClick={() => setShowAlertSettings(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="alert-option">
                <div className="option-info">
                  <span className="option-name">Alerta ao se aproximar do limite</span>
                  <span className="option-desc">Notificar quando usar 80% do limite</span>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={alerts.onApproachLimit}
                    onChange={e => setAlerts({ ...alerts, onApproachLimit: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>

              <div className="alert-option">
                <div className="option-info">
                  <span className="option-name">Alerta de transação alta</span>
                  <span className="option-desc">Notificar transações acima do valor definido</span>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={alerts.onHighTransaction}
                    onChange={e => setAlerts({ ...alerts, onHighTransaction: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>

              {alerts.onHighTransaction && (
                <div className="threshold-input">
                  <label>Valor mínimo para alerta</label>
                  <div className="input-group">
                    <span className="currency">R$</span>
                    <input
                      type="number"
                      value={alerts.highTransactionThreshold}
                      onChange={e => setAlerts({ ...alerts, highTransactionThreshold: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              <div className="alert-option">
                <div className="option-info">
                  <span className="option-name">Relatório semanal</span>
                  <span className="option-desc">Receber resumo dos limites utilizados</span>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={alerts.weeklyReport}
                    onChange={e => setAlerts({ ...alerts, weeklyReport: e.target.checked })}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-save-alerts" onClick={() => {
                showToast('Configurações de alerta salvas!', 'success');
                setShowAlertSettings(false);
              }}>
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .limites-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .page-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .page-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          margin-bottom: 24px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .alert-banner:hover {
          border-color: #C9A227;
        }

        .alert-icon {
          width: 40px;
          height: 40px;
          background: #252525;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A227;
        }

        .alert-banner span {
          flex: 1;
          color: #fff;
          font-size: 14px;
        }

        .alert-banner svg:last-child {
          color: #888;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          overflow-x: auto;
        }

        .tab {
          flex: 1;
          min-width: fit-content;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .limits-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .limit-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .limit-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .limit-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A227;
        }

        .limit-info {
          display: flex;
          flex-direction: column;
        }

        .limit-name {
          color: #fff;
          font-weight: 500;
        }

        .limit-desc {
          color: #888;
          font-size: 12px;
        }

        .limit-value {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .current-value, .max-value {
          display: flex;
          flex-direction: column;
        }

        .limit-value .label {
          color: #888;
          font-size: 12px;
        }

        .current-value .value {
          color: #C9A227;
          font-size: 20px;
          font-weight: 600;
        }

        .max-value .value {
          color: #fff;
          font-size: 16px;
        }

        .limit-bar {
          position: relative;
          height: 8px;
          background: #252525;
          border-radius: 4px;
          margin-bottom: 16px;
          overflow: visible;
        }

        .limit-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A227 0%, #D4AF37 100%);
          border-radius: 4px;
          transition: width 0.3s;
        }

        .percentage {
          position: absolute;
          right: 0;
          top: -20px;
          color: #888;
          font-size: 12px;
        }

        .limit-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .quick-adjust {
          display: flex;
          gap: 8px;
        }

        .quick-adjust button {
          padding: 8px 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-adjust button:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-edit {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #C9A227;
          border-radius: 8px;
          color: #C9A227;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-edit:hover {
          background: #C9A227;
          color: #000;
        }

        .edit-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
        }

        .input-group .currency {
          color: #888;
        }

        .input-group input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 18px;
          outline: none;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-save {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .security-tips {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .security-tips h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .security-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .security-tips li {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .security-tips li:last-child {
          margin-bottom: 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
          font-size: 18px;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .modal-content {
          padding: 20px;
        }

        .alert-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #252525;
        }

        .alert-option:last-of-type {
          border-bottom: none;
        }

        .option-info {
          display: flex;
          flex-direction: column;
        }

        .option-name {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .option-desc {
          color: #888;
          font-size: 12px;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #333;
          border-radius: 26px;
          transition: 0.3s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: #fff;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle input:checked + .slider {
          background: #C9A227;
        }

        .toggle input:checked + .slider:before {
          transform: translateX(22px);
        }

        .threshold-input {
          padding: 16px 0;
          border-bottom: 1px solid #252525;
        }

        .threshold-input label {
          color: #888;
          font-size: 12px;
          display: block;
          margin-bottom: 8px;
        }

        .threshold-input .input-group {
          padding: 10px 12px;
        }

        .threshold-input input {
          font-size: 16px;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-save-alerts {
          width: 100%;
          padding: 14px;
          background: #C9A227;
          border: none;
          border-radius: 10px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-save-alerts:hover {
          background: #D4AF37;
        }
      `}</style>
    </div>
  );
};

export default Limites;
