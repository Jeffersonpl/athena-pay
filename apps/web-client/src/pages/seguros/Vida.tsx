import React, { useState } from 'react';
import { useToast } from '../../ui/Toast';

interface Plan {
  id: string;
  name: string;
  coverage: number;
  monthlyPrice: number;
  features: string[];
  recommended?: boolean;
}

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
}

const SeguroVida: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'plans' | 'myPolicy' | 'beneficiaries'>('plans');
  const [hasPolicy, setHasPolicy] = useState(false);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({ name: '', relationship: '', percentage: '' });

  const [plans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Essencial',
      coverage: 100000,
      monthlyPrice: 29.90,
      features: [
        'Morte natural ou acidental',
        'Invalidez permanente total',
        'Assistência funeral familiar',
      ],
    },
    {
      id: '2',
      name: 'Completo',
      coverage: 300000,
      monthlyPrice: 59.90,
      features: [
        'Morte natural ou acidental',
        'Invalidez permanente total ou parcial',
        'Assistência funeral familiar',
        'Doenças graves',
        'Diária por internação hospitalar',
      ],
      recommended: true,
    },
    {
      id: '3',
      name: 'Premium',
      coverage: 500000,
      monthlyPrice: 99.90,
      features: [
        'Morte natural ou acidental',
        'Invalidez permanente total ou parcial',
        'Assistência funeral familiar completa',
        'Doenças graves (30 doenças)',
        'Diária por internação hospitalar',
        'Segunda opinião médica',
        'Telemedicina 24h',
      ],
    },
  ]);

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    { id: '1', name: 'Maria Silva', relationship: 'Cônjuge', percentage: 50 },
    { id: '2', name: 'João Silva', relationship: 'Filho', percentage: 25 },
    { id: '3', name: 'Ana Silva', relationship: 'Filha', percentage: 25 },
  ]);

  const [selectedPlan] = useState<Plan>(plans[1]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleContractPlan = (plan: Plan) => {
    showToast(`Plano ${plan.name} contratado com sucesso!`, 'success');
    setHasPolicy(true);
  };

  const handleAddBeneficiary = () => {
    if (!newBeneficiary.name || !newBeneficiary.relationship || !newBeneficiary.percentage) {
      showToast('Preencha todos os campos', 'error');
      return;
    }
    const totalPercentage = beneficiaries.reduce((acc, b) => acc + b.percentage, 0) + parseFloat(newBeneficiary.percentage);
    if (totalPercentage > 100) {
      showToast('A soma das porcentagens não pode ultrapassar 100%', 'error');
      return;
    }
    const newBen: Beneficiary = {
      id: Date.now().toString(),
      name: newBeneficiary.name,
      relationship: newBeneficiary.relationship,
      percentage: parseFloat(newBeneficiary.percentage),
    };
    setBeneficiaries([...beneficiaries, newBen]);
    showToast('Beneficiário adicionado com sucesso!', 'success');
    setShowBeneficiaryModal(false);
    setNewBeneficiary({ name: '', relationship: '', percentage: '' });
  };

  const handleRemoveBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
    showToast('Beneficiário removido', 'info');
  };

  return (
    <div className="seguro-vida-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => window.history.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-content">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h1>Seguro de Vida</h1>
          <p>Proteção para você e sua família</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          Planos
        </button>
        <button
          className={`tab ${activeTab === 'myPolicy' ? 'active' : ''}`}
          onClick={() => setActiveTab('myPolicy')}
        >
          Minha Apólice
        </button>
        <button
          className={`tab ${activeTab === 'beneficiaries' ? 'active' : ''}`}
          onClick={() => setActiveTab('beneficiaries')}
        >
          Beneficiários
        </button>
      </div>

      {activeTab === 'plans' && (
        <div className="plans-section">
          <div className="plans-grid">
            {plans.map(plan => (
              <div key={plan.id} className={`plan-card ${plan.recommended ? 'recommended' : ''}`}>
                {plan.recommended && <span className="badge">Recomendado</span>}
                <h3>{plan.name}</h3>
                <div className="coverage">
                  <span className="label">Cobertura</span>
                  <span className="value">{formatCurrency(plan.coverage)}</span>
                </div>
                <div className="price">
                  <span className="amount">{formatCurrency(plan.monthlyPrice)}</span>
                  <span className="period">/mês</span>
                </div>
                <ul className="features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <path d="M22 4L12 14.01l-3-3"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn-contract ${plan.recommended ? 'primary' : ''}`}
                  onClick={() => handleContractPlan(plan)}
                >
                  Contratar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'myPolicy' && (
        <div className="policy-section">
          {!hasPolicy ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <h3>Você ainda não tem um seguro de vida</h3>
              <p>Contrate agora e proteja quem você ama</p>
              <button className="btn-contract-now" onClick={() => setActiveTab('plans')}>
                Ver Planos
              </button>
            </div>
          ) : (
            <div className="policy-details">
              <div className="policy-card">
                <div className="policy-header">
                  <span className="policy-name">Seguro de Vida {selectedPlan.name}</span>
                  <span className="policy-status active">Ativo</span>
                </div>
                <div className="policy-info">
                  <div className="info-row">
                    <span className="label">Apólice</span>
                    <span className="value">#SV-2024-001234</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Cobertura</span>
                    <span className="value">{formatCurrency(selectedPlan.coverage)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Vigência</span>
                    <span className="value">15/01/2024 a 15/01/2025</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Valor Mensal</span>
                    <span className="value">{formatCurrency(selectedPlan.monthlyPrice)}</span>
                  </div>
                </div>
                <div className="policy-actions">
                  <button className="btn-action" onClick={() => showToast('PDF da apólice baixado', 'success')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Baixar Apólice
                  </button>
                  <button className="btn-action" onClick={() => showToast('Solicitação de sinistro iniciada', 'info')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    Acionar Seguro
                  </button>
                </div>
              </div>

              <div className="coverages-card">
                <h3>Coberturas Contratadas</h3>
                <ul className="coverages-list">
                  {selectedPlan.features.map((feature, idx) => (
                    <li key={idx}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <path d="M22 4L12 14.01l-3-3"/>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'beneficiaries' && (
        <div className="beneficiaries-section">
          <div className="section-header">
            <h2>Beneficiários</h2>
            <button className="btn-add" onClick={() => setShowBeneficiaryModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Adicionar
            </button>
          </div>

          <div className="total-percentage">
            <span className="label">Total distribuído</span>
            <div className="percentage-bar">
              <div
                className="percentage-fill"
                style={{ width: `${beneficiaries.reduce((acc, b) => acc + b.percentage, 0)}%` }}
              />
            </div>
            <span className="value">{beneficiaries.reduce((acc, b) => acc + b.percentage, 0)}%</span>
          </div>

          <div className="beneficiaries-list">
            {beneficiaries.map(ben => (
              <div key={ben.id} className="beneficiary-card">
                <div className="beneficiary-info">
                  <div className="avatar">
                    {ben.name.charAt(0)}
                  </div>
                  <div className="details">
                    <span className="name">{ben.name}</span>
                    <span className="relationship">{ben.relationship}</span>
                  </div>
                </div>
                <div className="beneficiary-percentage">
                  <span className="percentage">{ben.percentage}%</span>
                  <button className="btn-remove" onClick={() => handleRemoveBeneficiary(ben.id)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBeneficiaryModal && (
        <div className="modal-overlay" onClick={() => setShowBeneficiaryModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adicionar Beneficiário</h3>
              <button className="btn-close" onClick={() => setShowBeneficiaryModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Nome completo</label>
                <input
                  type="text"
                  value={newBeneficiary.name}
                  onChange={e => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                  placeholder="Nome do beneficiário"
                />
              </div>
              <div className="form-group">
                <label>Parentesco</label>
                <select
                  value={newBeneficiary.relationship}
                  onChange={e => setNewBeneficiary({ ...newBeneficiary, relationship: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="Cônjuge">Cônjuge</option>
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Pai/Mãe">Pai/Mãe</option>
                  <option value="Irmão(ã)">Irmão(ã)</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Porcentagem (%)</label>
                <input
                  type="number"
                  value={newBeneficiary.percentage}
                  onChange={e => setNewBeneficiary({ ...newBeneficiary, percentage: e.target.value })}
                  placeholder="0"
                  min="1"
                  max="100"
                />
                <span className="hint">
                  Disponível: {100 - beneficiaries.reduce((acc, b) => acc + b.percentage, 0)}%
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowBeneficiaryModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleAddBeneficiary}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .seguro-vida-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .btn-back {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 8px;
          color: #888;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-back:hover {
          color: #C9A227;
          border-color: #C9A227;
        }

        .header-content {
          flex: 1;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C9A227 0%, #1A1A1A 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .header-content h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .header-content p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .tabs {
          display: flex;
          background: #1A1A1A;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .plan-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          position: relative;
        }

        .plan-card.recommended {
          border-color: #C9A227;
        }

        .badge {
          position: absolute;
          top: -10px;
          right: 16px;
          background: #C9A227;
          color: #000;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .plan-card h3 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 16px;
        }

        .coverage {
          margin-bottom: 16px;
        }

        .coverage .label {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .coverage .value {
          color: #C9A227;
          font-size: 24px;
          font-weight: 700;
        }

        .price {
          margin-bottom: 20px;
        }

        .price .amount {
          color: #fff;
          font-size: 28px;
          font-weight: 600;
        }

        .price .period {
          color: #888;
          font-size: 14px;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
        }

        .features li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .btn-contract {
          width: 100%;
          padding: 14px;
          border: 1px solid #333;
          border-radius: 10px;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-contract:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-contract.primary {
          background: #C9A227;
          border-color: #C9A227;
          color: #000;
        }

        .btn-contract.primary:hover {
          background: #D4AF37;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-state svg {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .btn-contract-now {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-contract-now:hover {
          background: #D4AF37;
        }

        .policy-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .policy-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .policy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .policy-name {
          color: #fff;
          font-size: 18px;
          font-weight: 500;
        }

        .policy-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .policy-status.active {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .policy-info {
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row .label {
          color: #888;
          font-size: 14px;
        }

        .info-row .value {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .policy-actions {
          display: flex;
          gap: 12px;
        }

        .btn-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 10px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-action:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .coverages-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .coverages-card h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .coverages-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .coverages-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
          color: #888;
          font-size: 14px;
        }

        .coverages-list li:last-child {
          border-bottom: none;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h2 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-add:hover {
          background: #D4AF37;
        }

        .total-percentage {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
        }

        .total-percentage .label {
          color: #888;
          font-size: 14px;
        }

        .percentage-bar {
          flex: 1;
          height: 8px;
          background: #252525;
          border-radius: 4px;
          overflow: hidden;
        }

        .percentage-fill {
          height: 100%;
          background: #C9A227;
          border-radius: 4px;
          transition: width 0.3s;
        }

        .total-percentage .value {
          color: #C9A227;
          font-size: 16px;
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }

        .beneficiaries-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .beneficiary-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .beneficiary-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #C9A227 0%, #333 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
        }

        .details {
          display: flex;
          flex-direction: column;
        }

        .details .name {
          color: #fff;
          font-weight: 500;
        }

        .details .relationship {
          color: #888;
          font-size: 12px;
        }

        .beneficiary-percentage {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .percentage {
          color: #C9A227;
          font-size: 20px;
          font-weight: 600;
        }

        .btn-remove {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 8px;
          transition: all 0.3s;
        }

        .btn-remove:hover {
          color: #EF4444;
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

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .hint {
          display: block;
          color: #888;
          font-size: 12px;
          margin-top: 4px;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
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

        .btn-confirm {
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

        .btn-confirm:hover {
          background: #D4AF37;
        }
      `}</style>
    </div>
  );
};

export default SeguroVida;
