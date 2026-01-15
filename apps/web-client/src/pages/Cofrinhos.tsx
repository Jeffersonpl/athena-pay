import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Cofrinho {
  id: string;
  name: string;
  icon: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

const icons = ['🏠', '🚗', '✈️', '📱', '🎓', '💍', '🎁', '🏖️', '💰', '🎯'];
const colors = ['#C9A227', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function Cofrinhos() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showDeposit, setShowDeposit] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const [cofrinhos, setCofrinhos] = useState<Cofrinho[]>([
    { id: '1', name: 'Viagem Europa', icon: '✈️', target: 15000, current: 8500, deadline: '2025-12-01', color: '#3B82F6' },
    { id: '2', name: 'iPhone Novo', icon: '📱', target: 8000, current: 3200, deadline: '2025-06-01', color: '#8B5CF6' },
    { id: '3', name: 'Reserva Emergência', icon: '💰', target: 30000, current: 22500, deadline: '2025-12-31', color: '#22C55E' },
  ]);

  const [newCofrinho, setNewCofrinho] = useState({
    name: '',
    icon: '🎯',
    target: '',
    deadline: '',
    color: '#C9A227',
  });

  const totalSaved = cofrinhos.reduce((sum, c) => sum + c.current, 0);
  const totalTarget = cofrinhos.reduce((sum, c) => sum + c.target, 0);

  const handleCreate = () => {
    if (!newCofrinho.name || !newCofrinho.target) {
      showToast('error', 'Preencha nome e meta');
      return;
    }
    const cofrinho: Cofrinho = {
      id: Date.now().toString(),
      name: newCofrinho.name,
      icon: newCofrinho.icon,
      target: parseFloat(newCofrinho.target),
      current: 0,
      deadline: newCofrinho.deadline || '',
      color: newCofrinho.color,
    };
    setCofrinhos([...cofrinhos, cofrinho]);
    setNewCofrinho({ name: '', icon: '🎯', target: '', deadline: '', color: '#C9A227' });
    setShowModal(false);
    showToast('success', 'Cofrinho criado com sucesso!');
  };

  const handleDeposit = (id: string) => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      showToast('error', 'Informe um valor válido');
      return;
    }
    setCofrinhos(cofrinhos.map(c =>
      c.id === id ? { ...c, current: c.current + parseFloat(depositAmount) } : c
    ));
    setShowDeposit(null);
    setDepositAmount('');
    showToast('success', 'Depósito realizado!');
  };

  const handleDelete = (id: string) => {
    setCofrinhos(cofrinhos.filter(c => c.id !== id));
    showToast('info', 'Cofrinho removido');
  };

  return (
    <div className="cofrinhos-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/>
            <path d="M2 9v1c0 1.1.9 2 2 2h1"/>
            <circle cx="16" cy="11" r="1"/>
          </svg>
        </div>
        <h1>Cofrinhos</h1>
        <p>Organize suas metas e economize</p>
      </div>

      {/* Summary Card */}
      <div className="summary-card">
        <div className="summary-item">
          <span className="summary-label">Total Guardado</span>
          <span className="summary-value gold">{formatCurrency(totalSaved)}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Meta Total</span>
          <span className="summary-value">{formatCurrency(totalTarget)}</span>
        </div>
        <div className="summary-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }}
            />
          </div>
          <span className="progress-text">{Math.round((totalSaved / totalTarget) * 100)}% completo</span>
        </div>
      </div>

      {/* Cofrinhos List */}
      <div className="cofrinhos-list">
        {cofrinhos.map(cofrinho => {
          const progress = (cofrinho.current / cofrinho.target) * 100;
          const isComplete = cofrinho.current >= cofrinho.target;

          return (
            <div key={cofrinho.id} className="cofrinho-card">
              <div className="cofrinho-header">
                <div className="cofrinho-icon" style={{ background: `${cofrinho.color}20`, borderColor: cofrinho.color }}>
                  <span>{cofrinho.icon}</span>
                </div>
                <div className="cofrinho-info">
                  <h3>{cofrinho.name}</h3>
                  {cofrinho.deadline && (
                    <span className="cofrinho-deadline">
                      Meta: {new Date(cofrinho.deadline).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
                {isComplete && (
                  <div className="cofrinho-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="cofrinho-progress">
                <div className="progress-info">
                  <span className="current">{formatCurrency(cofrinho.current)}</span>
                  <span className="target">de {formatCurrency(cofrinho.target)}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(progress, 100)}%`, background: cofrinho.color }}
                  />
                </div>
                <span className="progress-percent">{Math.round(progress)}%</span>
              </div>

              <div className="cofrinho-actions">
                <button className="btn-deposit" onClick={() => setShowDeposit(cofrinho.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Depositar
                </button>
                <button className="btn-withdraw">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Resgatar
                </button>
                <button className="btn-delete" onClick={() => handleDelete(cofrinho.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>

              {/* Deposit Modal */}
              {showDeposit === cofrinho.id && (
                <div className="deposit-overlay" onClick={() => setShowDeposit(null)}>
                  <div className="deposit-modal" onClick={e => e.stopPropagation()}>
                    <h4>Depositar em {cofrinho.name}</h4>
                    <div className="deposit-input">
                      <span>R$</span>
                      <input
                        type="number"
                        placeholder="0,00"
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="deposit-actions">
                      <button className="btn-cancel" onClick={() => setShowDeposit(null)}>Cancelar</button>
                      <button className="btn-confirm" onClick={() => handleDeposit(cofrinho.id)}>Confirmar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <button className="btn-add" onClick={() => setShowModal(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Criar novo cofrinho
      </button>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Cofrinho</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nome do cofrinho</label>
                <input
                  type="text"
                  placeholder="Ex: Viagem, Carro novo..."
                  value={newCofrinho.name}
                  onChange={e => setNewCofrinho({ ...newCofrinho, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Ícone</label>
                <div className="icon-grid">
                  {icons.map(icon => (
                    <button
                      key={icon}
                      className={`icon-btn ${newCofrinho.icon === icon ? 'active' : ''}`}
                      onClick={() => setNewCofrinho({ ...newCofrinho, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Cor</label>
                <div className="color-grid">
                  {colors.map(color => (
                    <button
                      key={color}
                      className={`color-btn ${newCofrinho.color === color ? 'active' : ''}`}
                      style={{ background: color }}
                      onClick={() => setNewCofrinho({ ...newCofrinho, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Meta (R$)</label>
                <input
                  type="number"
                  placeholder="0,00"
                  value={newCofrinho.target}
                  onChange={e => setNewCofrinho({ ...newCofrinho, target: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Prazo (opcional)</label>
                <input
                  type="date"
                  value={newCofrinho.deadline}
                  onChange={e => setNewCofrinho({ ...newCofrinho, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleCreate}>Criar Cofrinho</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cofrinhos-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding: 24px 20px 100px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          color: #C9A227;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Summary Card */
        .summary-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .summary-label {
          font-size: 14px;
          color: #A3A3A3;
        }

        .summary-value {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .summary-value.gold {
          color: #C9A227;
        }

        .summary-divider {
          height: 1px;
          background: #333;
          margin: 12px 0;
        }

        .summary-progress {
          margin-top: 16px;
        }

        .progress-bar {
          height: 8px;
          background: #262626;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A227, #E5B82A);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #666;
        }

        /* Cofrinhos List */
        .cofrinhos-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .cofrinho-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 20px;
          position: relative;
        }

        .cofrinho-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .cofrinho-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          border: 1px solid;
          font-size: 24px;
        }

        .cofrinho-info {
          flex: 1;
        }

        .cofrinho-info h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 4px;
        }

        .cofrinho-deadline {
          font-size: 12px;
          color: #666;
        }

        .cofrinho-badge {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.2);
          border-radius: 50%;
          color: #22C55E;
        }

        .cofrinho-progress {
          margin-bottom: 16px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-info .current {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .progress-info .target {
          font-size: 14px;
          color: #666;
        }

        .progress-percent {
          font-size: 12px;
          color: #A3A3A3;
        }

        .cofrinho-actions {
          display: flex;
          gap: 8px;
        }

        .btn-deposit, .btn-withdraw {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-deposit {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          color: #0D0D0D;
        }

        .btn-deposit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .btn-withdraw {
          background: #262626;
          border: 1px solid #333;
          color: #fff;
        }

        .btn-withdraw:hover {
          border-color: #C9A227;
        }

        .btn-delete {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Deposit Overlay */
        .deposit-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .deposit-modal {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          width: 100%;
          max-width: 360px;
        }

        .deposit-modal h4 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 20px;
          text-align: center;
        }

        .deposit-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .deposit-input span {
          font-size: 20px;
          color: #666;
        }

        .deposit-input input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
        }

        .deposit-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel, .btn-confirm {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: #262626;
          border: 1px solid #333;
          color: #fff;
        }

        .btn-confirm {
          background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
          border: none;
          color: #fff;
        }

        /* Add Button */
        .btn-add {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 18px 24px;
          background: transparent;
          border: 2px dashed #333;
          border-radius: 16px;
          color: #C9A227;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
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
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #333;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          border-color: #C9A227;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .icon-btn {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 2px solid #333;
          border-radius: 12px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-btn:hover, .icon-btn.active {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .color-grid {
          display: flex;
          gap: 8px;
        }

        .color-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-btn:hover, .color-btn.active {
          border-color: #fff;
          transform: scale(1.1);
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #333;
        }

        .btn-secondary, .btn-primary {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: #262626;
          border: 1px solid #333;
          color: #fff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          color: #0D0D0D;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        @media (max-width: 480px) {
          .cofrinho-actions {
            flex-wrap: wrap;
          }

          .btn-deposit, .btn-withdraw {
            flex: 1 1 calc(50% - 4px);
          }

          .btn-delete {
            width: 100%;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
}
