import React, { useState } from 'react';
import { useToast } from '../../ui/Toast';

interface Plan {
  id: string;
  name: string;
  coverage: number;
  dailyPrice: number;
  features: string[];
  recommended?: boolean;
}

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  plan: string;
  status: 'active' | 'upcoming' | 'completed';
}

const SeguroViagem: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'quote' | 'myTrips'>('quote');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [showPlansModal, setShowPlansModal] = useState(false);

  const [plans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Essencial',
      coverage: 30000,
      dailyPrice: 12.90,
      features: [
        'Despesas médicas (USD 30.000)',
        'Bagagem extraviada (USD 1.000)',
        'Cancelamento de viagem',
        'Assistência 24h em português',
      ],
    },
    {
      id: '2',
      name: 'Completo',
      coverage: 60000,
      dailyPrice: 24.90,
      features: [
        'Despesas médicas (USD 60.000)',
        'Bagagem extraviada (USD 2.000)',
        'Cancelamento de viagem',
        'Assistência 24h em português',
        'Cobertura para esportes',
        'Regresso sanitário',
      ],
      recommended: true,
    },
    {
      id: '3',
      name: 'Premium',
      coverage: 150000,
      dailyPrice: 45.90,
      features: [
        'Despesas médicas (USD 150.000)',
        'Bagagem extraviada (USD 3.000)',
        'Cancelamento de viagem (USD 5.000)',
        'Assistência 24h em português',
        'Cobertura para esportes radicais',
        'Regresso sanitário',
        'Acompanhante em caso de hospitalização',
        'Cobertura para gestantes',
      ],
    },
  ]);

  const [trips] = useState<Trip[]>([
    {
      id: '1',
      destination: 'Paris, França',
      startDate: '2024-02-15',
      endDate: '2024-02-25',
      plan: 'Completo',
      status: 'upcoming',
    },
    {
      id: '2',
      destination: 'Orlando, EUA',
      startDate: '2023-12-20',
      endDate: '2024-01-05',
      plan: 'Essencial',
      status: 'completed',
    },
  ]);

  const formatCurrency = (value: number, currency: string = 'BRL') => {
    if (currency === 'USD') {
      return `USD ${value.toLocaleString('en-US')}`;
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleQuote = () => {
    if (!destination || !startDate || !endDate) {
      showToast('Preencha todos os campos', 'error');
      return;
    }
    if (calculateDays() === 0) {
      showToast('Data de retorno deve ser posterior à data de ida', 'error');
      return;
    }
    setShowPlansModal(true);
  };

  const handleSelectPlan = (plan: Plan) => {
    const days = calculateDays();
    const total = plan.dailyPrice * days * parseInt(travelers);
    showToast(`Seguro ${plan.name} contratado! Total: ${formatCurrency(total)}`, 'success');
    setShowPlansModal(false);
    setDestination('');
    setStartDate('');
    setEndDate('');
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      active: { text: 'Em vigor', color: '#22C55E' },
      upcoming: { text: 'Próxima', color: '#3B82F6' },
      completed: { text: 'Concluída', color: '#888' },
    };
    return labels[status] || { text: status, color: '#888' };
  };

  return (
    <div className="seguro-viagem-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => window.history.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-content">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h1>Seguro Viagem</h1>
          <p>Viaje tranquilo pelo mundo</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'quote' ? 'active' : ''}`}
          onClick={() => setActiveTab('quote')}
        >
          Cotar Seguro
        </button>
        <button
          className={`tab ${activeTab === 'myTrips' ? 'active' : ''}`}
          onClick={() => setActiveTab('myTrips')}
        >
          Minhas Viagens
        </button>
      </div>

      {activeTab === 'quote' && (
        <div className="quote-section">
          <div className="quote-form">
            <div className="form-group">
              <label>Destino</label>
              <select value={destination} onChange={e => setDestination(e.target.value)}>
                <option value="">Selecione o destino...</option>
                <option value="america-norte">América do Norte</option>
                <option value="america-sul">América do Sul</option>
                <option value="europa">Europa</option>
                <option value="asia">Ásia</option>
                <option value="africa">África</option>
                <option value="oceania">Oceania</option>
                <option value="mundial">Mundial (múltiplos destinos)</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Data de ida</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Data de volta</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Número de viajantes</label>
              <select value={travelers} onChange={e => setTravelers(e.target.value)}>
                <option value="1">1 viajante</option>
                <option value="2">2 viajantes</option>
                <option value="3">3 viajantes</option>
                <option value="4">4 viajantes</option>
                <option value="5">5 viajantes</option>
              </select>
            </div>

            {calculateDays() > 0 && (
              <div className="trip-summary">
                <div className="summary-item">
                  <span className="label">Duração</span>
                  <span className="value">{calculateDays()} dias</span>
                </div>
                <div className="summary-item">
                  <span className="label">Viajantes</span>
                  <span className="value">{travelers}</span>
                </div>
              </div>
            )}

            <button className="btn-quote" onClick={handleQuote}>
              Ver Planos e Preços
            </button>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="M22 4L12 14.01l-3-3"/>
                </svg>
              </div>
              <div className="info-content">
                <h4>Obrigatório para Europa</h4>
                <p>Países do Tratado de Schengen exigem seguro viagem com cobertura mínima de EUR 30.000</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div className="info-content">
                <h4>Assistência 24h</h4>
                <p>Atendimento em português a qualquer hora, em qualquer lugar do mundo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'myTrips' && (
        <div className="trips-section">
          {trips.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <h3>Nenhuma viagem cadastrada</h3>
              <p>Faça uma cotação e proteja sua próxima aventura</p>
              <button className="btn-new" onClick={() => setActiveTab('quote')}>
                Cotar Seguro
              </button>
            </div>
          ) : (
            <div className="trips-list">
              {trips.map(trip => {
                const status = getStatusLabel(trip.status);
                return (
                  <div key={trip.id} className="trip-card">
                    <div className="trip-header">
                      <div className="destination">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{trip.destination}</span>
                      </div>
                      <span className="status" style={{ color: status.color, background: `${status.color}15` }}>
                        {status.text}
                      </span>
                    </div>
                    <div className="trip-details">
                      <div className="detail">
                        <span className="label">Período</span>
                        <span className="value">
                          {new Date(trip.startDate).toLocaleDateString('pt-BR')} - {new Date(trip.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="detail">
                        <span className="label">Plano</span>
                        <span className="value">{trip.plan}</span>
                      </div>
                    </div>
                    <div className="trip-actions">
                      <button className="btn-action" onClick={() => showToast('PDF baixado', 'success')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7,10 12,15 17,10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Voucher
                      </button>
                      <button className="btn-action" onClick={() => showToast('Central de atendimento: 0800-123-4567', 'info')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
                        </svg>
                        Assistência
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showPlansModal && (
        <div className="modal-overlay" onClick={() => setShowPlansModal(false)}>
          <div className="modal plans-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Escolha seu Plano</h3>
              <button className="btn-close" onClick={() => setShowPlansModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="plans-list">
                {plans.map(plan => {
                  const days = calculateDays();
                  const total = plan.dailyPrice * days * parseInt(travelers);
                  return (
                    <div key={plan.id} className={`plan-card ${plan.recommended ? 'recommended' : ''}`}>
                      {plan.recommended && <span className="badge">Recomendado</span>}
                      <h4>{plan.name}</h4>
                      <div className="coverage">
                        Cobertura: {formatCurrency(plan.coverage, 'USD')}
                      </div>
                      <div className="price">
                        <span className="daily">{formatCurrency(plan.dailyPrice)}/dia</span>
                        <span className="total">Total: {formatCurrency(total)}</span>
                      </div>
                      <ul className="features">
                        {plan.features.map((feature, idx) => (
                          <li key={idx}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
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
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .seguro-viagem-page {
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

        .quote-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .quote-form {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .trip-summary {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #252525;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .summary-item {
          flex: 1;
          text-align: center;
        }

        .summary-item .label {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .summary-item .value {
          color: #C9A227;
          font-size: 20px;
          font-weight: 600;
        }

        .btn-quote {
          width: 100%;
          padding: 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-quote:hover {
          background: #D4AF37;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .info-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-content h4 {
          color: #fff;
          font-size: 14px;
          margin: 0 0 4px;
        }

        .info-content p {
          color: #888;
          font-size: 13px;
          margin: 0;
          line-height: 1.4;
        }

        .trips-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
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

        .btn-new {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .trips-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trip-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .trip-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .destination {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          font-weight: 500;
        }

        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .trip-details {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .trip-details .detail {
          display: flex;
          flex-direction: column;
        }

        .trip-details .label {
          color: #888;
          font-size: 12px;
        }

        .trip-details .value {
          color: #fff;
          font-size: 14px;
        }

        .trip-actions {
          display: flex;
          gap: 12px;
        }

        .btn-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-action:hover {
          border-color: #C9A227;
          color: #C9A227;
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
          max-height: 90vh;
          overflow-y: auto;
        }

        .plans-modal {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
          position: sticky;
          top: 0;
          background: #1A1A1A;
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

        .plans-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .plan-card {
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          position: relative;
        }

        .plan-card.recommended {
          border-color: #C9A227;
        }

        .badge {
          position: absolute;
          top: -10px;
          right: 12px;
          background: #C9A227;
          color: #000;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .plan-card h4 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .coverage {
          color: #888;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .price {
          margin-bottom: 16px;
        }

        .price .daily {
          color: #C9A227;
          font-size: 20px;
          font-weight: 600;
          display: block;
        }

        .price .total {
          color: #fff;
          font-size: 14px;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
        }

        .features li {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .btn-select {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
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
      `}</style>
    </div>
  );
};

export default SeguroViagem;
