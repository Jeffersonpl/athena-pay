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

interface Property {
  id: string;
  type: string;
  address: string;
  insured: boolean;
  plan?: string;
  premium?: number;
}

const SeguroResidencial: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'plans' | 'myProperties' | 'assistance'>('plans');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [propertyData, setPropertyData] = useState({
    type: '',
    address: '',
    zipCode: '',
    value: '',
  });

  const [plans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Básico',
      coverage: 100000,
      monthlyPrice: 24.90,
      features: [
        'Incêndio, raio e explosão',
        'Vendaval e granizo',
        'Responsabilidade civil familiar',
        'Assistência 24h básica',
      ],
    },
    {
      id: '2',
      name: 'Essencial',
      coverage: 200000,
      monthlyPrice: 49.90,
      features: [
        'Incêndio, raio e explosão',
        'Vendaval, granizo e queda de aeronaves',
        'Roubo e furto qualificado',
        'Danos elétricos',
        'Responsabilidade civil familiar',
        'Assistência 24h completa',
      ],
      recommended: true,
    },
    {
      id: '3',
      name: 'Premium',
      coverage: 500000,
      monthlyPrice: 89.90,
      features: [
        'Incêndio, raio e explosão',
        'Vendaval, granizo e queda de aeronaves',
        'Roubo e furto qualificado',
        'Danos elétricos em equipamentos',
        'Quebra de vidros',
        'Alagamento e inundação',
        'Responsabilidade civil familiar ampliada',
        'Assistência 24h premium',
        'Diária por impossibilidade de habitação',
      ],
    },
  ]);

  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      type: 'Apartamento',
      address: 'Rua das Flores, 123 - Apt 501',
      insured: true,
      plan: 'Essencial',
      premium: 49.90,
    },
  ]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowQuoteModal(true);
  };

  const handleContractInsurance = () => {
    if (!propertyData.type || !propertyData.address || !propertyData.zipCode) {
      showToast('Preencha todos os campos', 'error');
      return;
    }
    const newProperty: Property = {
      id: Date.now().toString(),
      type: propertyData.type,
      address: propertyData.address,
      insured: true,
      plan: selectedPlan?.name,
      premium: selectedPlan?.monthlyPrice,
    };
    setProperties([...properties, newProperty]);
    showToast(`Seguro ${selectedPlan?.name} contratado com sucesso!`, 'success');
    setShowQuoteModal(false);
    setPropertyData({ type: '', address: '', zipCode: '', value: '' });
    setSelectedPlan(null);
  };

  const handleAssistance = (type: string) => {
    showToast(`Solicitação de ${type} enviada. Em breve um profissional entrará em contato.`, 'success');
  };

  return (
    <div className="seguro-residencial-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => window.history.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-content">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </div>
          <h1>Seguro Residencial</h1>
          <p>Proteção completa para seu lar</p>
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
          className={`tab ${activeTab === 'myProperties' ? 'active' : ''}`}
          onClick={() => setActiveTab('myProperties')}
        >
          Meus Imóveis
        </button>
        <button
          className={`tab ${activeTab === 'assistance' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistance')}
        >
          Assistência
        </button>
      </div>

      {activeTab === 'plans' && (
        <div className="plans-section">
          <div className="plans-list">
            {plans.map(plan => (
              <div key={plan.id} className={`plan-card ${plan.recommended ? 'recommended' : ''}`}>
                {plan.recommended && <span className="badge">Mais vendido</span>}
                <h3>{plan.name}</h3>
                <div className="coverage">
                  <span className="label">Cobertura até</span>
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
                  className={`btn-select ${plan.recommended ? 'primary' : ''}`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Contratar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'myProperties' && (
        <div className="properties-section">
          {properties.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <h3>Nenhum imóvel segurado</h3>
              <p>Proteja sua casa ou apartamento</p>
              <button className="btn-contract" onClick={() => setActiveTab('plans')}>
                Ver Planos
              </button>
            </div>
          ) : (
            <div className="properties-list">
              {properties.map(property => (
                <div key={property.id} className="property-card">
                  <div className="property-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={property.insured ? '#C9A227' : '#666'} strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                  </div>
                  <div className="property-info">
                    <span className="property-type">{property.type}</span>
                    <span className="property-address">{property.address}</span>
                    {property.insured && (
                      <span className="property-plan">{property.plan} • {formatCurrency(property.premium || 0)}/mês</span>
                    )}
                  </div>
                  <div className="property-status">
                    <span className={`status ${property.insured ? 'insured' : ''}`}>
                      {property.insured ? 'Segurado' : 'Não segurado'}
                    </span>
                    {property.insured && (
                      <button className="btn-details" onClick={() => showToast('Detalhes da apólice', 'info')}>
                        Ver Apólice
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'assistance' && (
        <div className="assistance-section">
          <h2>Assistência Residencial 24h</h2>
          <p className="subtitle">Serviços inclusos no seu plano</p>

          <div className="assistance-grid">
            <button className="assistance-card" onClick={() => handleAssistance('Chaveiro')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <span className="title">Chaveiro</span>
              <span className="description">Abertura de portas e troca de fechaduras</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Eletricista')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <span className="title">Eletricista</span>
              <span className="description">Reparos elétricos emergenciais</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Encanador')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M6 6h.01M6 18h.01M18 6h.01M18 18h.01M3 12h18M12 3v18"/>
                </svg>
              </div>
              <span className="title">Encanador</span>
              <span className="description">Vazamentos e desentupimentos</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Vidraceiro')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <span className="title">Vidraceiro</span>
              <span className="description">Troca de vidros e espelhos</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Dedetização')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span className="title">Dedetização</span>
              <span className="description">Controle de pragas</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Limpeza de Caixa')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                </svg>
              </div>
              <span className="title">Limpeza de Caixa</span>
              <span className="description">Limpeza de caixa d'água</span>
            </button>
          </div>

          <div className="emergency-contact">
            <span className="label">Central de Atendimento 24h</span>
            <span className="phone">0800 123 4567</span>
          </div>
        </div>
      )}

      {showQuoteModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowQuoteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Dados do Imóvel</h3>
              <button className="btn-close" onClick={() => setShowQuoteModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="selected-plan-info">
                <span className="plan-name">{selectedPlan.name}</span>
                <span className="plan-price">{formatCurrency(selectedPlan.monthlyPrice)}/mês</span>
              </div>

              <div className="form-group">
                <label>Tipo de imóvel</label>
                <select
                  value={propertyData.type}
                  onChange={e => setPropertyData({ ...propertyData, type: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Casa em Condomínio">Casa em Condomínio</option>
                  <option value="Sobrado">Sobrado</option>
                </select>
              </div>

              <div className="form-group">
                <label>CEP</label>
                <input
                  type="text"
                  value={propertyData.zipCode}
                  onChange={e => setPropertyData({ ...propertyData, zipCode: e.target.value.replace(/\D/g, '') })}
                  placeholder="00000-000"
                  maxLength={8}
                />
              </div>

              <div className="form-group">
                <label>Endereço completo</label>
                <input
                  type="text"
                  value={propertyData.address}
                  onChange={e => setPropertyData({ ...propertyData, address: e.target.value })}
                  placeholder="Rua, número, complemento"
                />
              </div>

              <div className="form-group">
                <label>Valor estimado do imóvel</label>
                <input
                  type="text"
                  value={propertyData.value}
                  onChange={e => setPropertyData({ ...propertyData, value: e.target.value })}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowQuoteModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleContractInsurance}>
                Contratar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .seguro-residencial-page {
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
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .plans-list {
          display: flex;
          flex-direction: column;
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
          margin: 0 0 12px;
        }

        .coverage {
          margin-bottom: 12px;
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
          margin: 0 0 20px;
        }

        .features li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .btn-select {
          width: 100%;
          padding: 14px;
          border: 1px solid #333;
          border-radius: 10px;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-select:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-select.primary {
          background: #C9A227;
          border-color: #C9A227;
          color: #000;
        }

        .btn-select.primary:hover {
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

        .btn-contract {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .properties-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .property-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
        }

        @media (max-width: 640px) {
          .property-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .property-icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .property-info {
          display: flex;
          flex-direction: column;
        }

        .property-type {
          color: #888;
          font-size: 12px;
        }

        .property-address {
          color: #fff;
          font-weight: 500;
        }

        .property-plan {
          color: #C9A227;
          font-size: 12px;
          margin-top: 4px;
        }

        .property-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        @media (max-width: 640px) {
          .property-status {
            align-items: center;
          }
        }

        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          background: rgba(136, 136, 136, 0.1);
          color: #888;
        }

        .status.insured {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .btn-details {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-details:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .assistance-section {
          text-align: center;
        }

        .assistance-section h2 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 8px;
        }

        .subtitle {
          color: #888;
          font-size: 14px;
          margin: 0 0 24px;
        }

        .assistance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .assistance-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .assistance-card:hover {
          border-color: #C9A227;
        }

        .assistance-card .icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .assistance-card .title {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .assistance-card .description {
          color: #888;
          font-size: 12px;
          line-height: 1.3;
        }

        .emergency-contact {
          background: #1A1A1A;
          border: 1px solid #C9A227;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }

        .emergency-contact .label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .emergency-contact .phone {
          color: #C9A227;
          font-size: 28px;
          font-weight: 700;
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

        .selected-plan-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #252525;
          border: 1px solid #C9A227;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .plan-name {
          color: #C9A227;
          font-size: 18px;
          font-weight: 600;
        }

        .plan-price {
          color: #888;
          font-size: 14px;
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

export default SeguroResidencial;
