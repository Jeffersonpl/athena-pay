import React, { useState } from 'react';
import { useToast } from '../../ui/Toast';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  insured: boolean;
  plan?: string;
  premium?: number;
}

interface Coverage {
  name: string;
  description: string;
  included: boolean;
}

const SeguroAuto: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'quote' | 'myVehicles' | 'assistance'>('quote');
  const [quoteStep, setQuoteStep] = useState(1);
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    fipeValue: 85000,
    zipCode: '',
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla XEi 2.0',
      year: 2022,
      plate: 'ABC-1234',
      insured: true,
      plan: 'Completo',
      premium: 189.90,
    },
  ]);

  const [coverages] = useState<Coverage[]>([
    { name: 'Colisão', description: 'Danos causados por batidas e capotamento', included: true },
    { name: 'Roubo e Furto', description: 'Cobertura em caso de roubo ou furto do veículo', included: true },
    { name: 'Incêndio', description: 'Danos por incêndio, raio e explosão', included: true },
    { name: 'Terceiros', description: 'Danos materiais e corporais a terceiros', included: true },
    { name: 'Vidros', description: 'Troca de para-brisas, vidros laterais e traseiro', included: true },
    { name: 'Carro Reserva', description: 'Veículo reserva por até 15 dias em caso de sinistro', included: false },
    { name: 'Assistência 24h', description: 'Guincho, chaveiro, troca de pneu, pane seca', included: true },
  ]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleQuoteSubmit = () => {
    if (quoteStep === 1) {
      if (!vehicleData.brand || !vehicleData.model || !vehicleData.year) {
        showToast('Preencha todos os campos do veículo', 'error');
        return;
      }
      setQuoteStep(2);
    } else if (quoteStep === 2) {
      if (!vehicleData.zipCode || !vehicleData.plate) {
        showToast('Preencha o CEP e a placa', 'error');
        return;
      }
      setQuoteStep(3);
    }
  };

  const handleContractInsurance = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: parseInt(vehicleData.year),
      plate: vehicleData.plate,
      insured: true,
      plan: 'Completo',
      premium: 189.90,
    };
    setVehicles([...vehicles, newVehicle]);
    showToast('Seguro contratado com sucesso!', 'success');
    setQuoteStep(1);
    setVehicleData({ brand: '', model: '', year: '', plate: '', fipeValue: 85000, zipCode: '' });
    setActiveTab('myVehicles');
  };

  const handleAssistance = (type: string) => {
    showToast(`Solicitação de ${type} enviada. Em breve entraremos em contato.`, 'success');
  };

  return (
    <div className="seguro-auto-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => window.history.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-content">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <h1>Seguro Auto</h1>
          <p>Proteção completa para seu veículo</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'quote' ? 'active' : ''}`}
          onClick={() => setActiveTab('quote')}
        >
          Cotar
        </button>
        <button
          className={`tab ${activeTab === 'myVehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('myVehicles')}
        >
          Meus Veículos
        </button>
        <button
          className={`tab ${activeTab === 'assistance' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistance')}
        >
          Assistência
        </button>
      </div>

      {activeTab === 'quote' && (
        <div className="quote-section">
          <div className="quote-progress">
            <div className={`step ${quoteStep >= 1 ? 'active' : ''}`}>
              <span className="number">1</span>
              <span className="label">Veículo</span>
            </div>
            <div className="line" />
            <div className={`step ${quoteStep >= 2 ? 'active' : ''}`}>
              <span className="number">2</span>
              <span className="label">Dados</span>
            </div>
            <div className="line" />
            <div className={`step ${quoteStep >= 3 ? 'active' : ''}`}>
              <span className="number">3</span>
              <span className="label">Cotação</span>
            </div>
          </div>

          {quoteStep === 1 && (
            <div className="quote-form">
              <h3>Dados do Veículo</h3>
              <div className="form-group">
                <label>Marca</label>
                <select
                  value={vehicleData.brand}
                  onChange={e => setVehicleData({ ...vehicleData, brand: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Ford">Ford</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Jeep">Jeep</option>
                </select>
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <input
                  type="text"
                  value={vehicleData.model}
                  onChange={e => setVehicleData({ ...vehicleData, model: e.target.value })}
                  placeholder="Ex: Corolla XEi 2.0"
                />
              </div>
              <div className="form-group">
                <label>Ano</label>
                <select
                  value={vehicleData.year}
                  onChange={e => setVehicleData({ ...vehicleData, year: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button className="btn-next" onClick={handleQuoteSubmit}>
                Continuar
              </button>
            </div>
          )}

          {quoteStep === 2 && (
            <div className="quote-form">
              <h3>Informações Adicionais</h3>
              <div className="form-group">
                <label>Placa do Veículo</label>
                <input
                  type="text"
                  value={vehicleData.plate}
                  onChange={e => setVehicleData({ ...vehicleData, plate: e.target.value.toUpperCase() })}
                  placeholder="ABC-1234"
                  maxLength={8}
                />
              </div>
              <div className="form-group">
                <label>CEP onde o veículo pernoita</label>
                <input
                  type="text"
                  value={vehicleData.zipCode}
                  onChange={e => setVehicleData({ ...vehicleData, zipCode: e.target.value.replace(/\D/g, '') })}
                  placeholder="00000-000"
                  maxLength={8}
                />
              </div>
              <div className="fipe-info">
                <span className="label">Valor FIPE estimado</span>
                <span className="value">{formatCurrency(vehicleData.fipeValue)}</span>
              </div>
              <div className="btn-group">
                <button className="btn-back-step" onClick={() => setQuoteStep(1)}>
                  Voltar
                </button>
                <button className="btn-next" onClick={handleQuoteSubmit}>
                  Ver Cotação
                </button>
              </div>
            </div>
          )}

          {quoteStep === 3 && (
            <div className="quote-result">
              <div className="result-header">
                <h3>Sua Cotação</h3>
                <div className="vehicle-summary">
                  <span className="vehicle-name">{vehicleData.brand} {vehicleData.model}</span>
                  <span className="vehicle-info">{vehicleData.year} • {vehicleData.plate}</span>
                </div>
              </div>

              <div className="premium-card">
                <span className="label">Valor Mensal</span>
                <span className="value">{formatCurrency(189.90)}</span>
                <span className="annual">ou {formatCurrency(2088.90)}/ano à vista</span>
              </div>

              <div className="coverages-section">
                <h4>Coberturas Incluídas</h4>
                <div className="coverages-list">
                  {coverages.map((coverage, idx) => (
                    <div key={idx} className={`coverage-item ${coverage.included ? 'included' : ''}`}>
                      <div className="coverage-icon">
                        {coverage.included ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <path d="M22 4L12 14.01l-3-3"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M15 9l-6 6M9 9l6 6"/>
                          </svg>
                        )}
                      </div>
                      <div className="coverage-info">
                        <span className="name">{coverage.name}</span>
                        <span className="description">{coverage.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="btn-group">
                <button className="btn-back-step" onClick={() => setQuoteStep(2)}>
                  Voltar
                </button>
                <button className="btn-contract" onClick={handleContractInsurance}>
                  Contratar Seguro
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'myVehicles' && (
        <div className="vehicles-section">
          {vehicles.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
              <h3>Nenhum veículo segurado</h3>
              <p>Faça uma cotação e proteja seu carro</p>
              <button className="btn-quote" onClick={() => setActiveTab('quote')}>
                Cotar Agora
              </button>
            </div>
          ) : (
            <div className="vehicles-list">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-card">
                  <div className="vehicle-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={vehicle.insured ? '#C9A227' : '#666'} strokeWidth="2">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                      <circle cx="7" cy="17" r="2"/>
                      <circle cx="17" cy="17" r="2"/>
                    </svg>
                  </div>
                  <div className="vehicle-info">
                    <span className="vehicle-name">{vehicle.brand} {vehicle.model}</span>
                    <span className="vehicle-details">{vehicle.year} • {vehicle.plate}</span>
                    {vehicle.insured && (
                      <span className="vehicle-plan">{vehicle.plan} • {formatCurrency(vehicle.premium || 0)}/mês</span>
                    )}
                  </div>
                  <div className="vehicle-status">
                    <span className={`status ${vehicle.insured ? 'insured' : ''}`}>
                      {vehicle.insured ? 'Segurado' : 'Não segurado'}
                    </span>
                    {vehicle.insured && (
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
          <h2>Assistência 24 Horas</h2>
          <p className="subtitle">Precisa de ajuda? Solicite assistência agora</p>

          <div className="assistance-grid">
            <button className="assistance-card" onClick={() => handleAssistance('Guincho')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M10 17h4V5H2v12h3"/>
                  <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"/>
                  <circle cx="7.5" cy="17.5" r="2.5"/>
                  <circle cx="17.5" cy="17.5" r="2.5"/>
                </svg>
              </div>
              <span className="title">Guincho</span>
              <span className="description">Reboque para oficina ou concessionária</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Chaveiro')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <span className="title">Chaveiro</span>
              <span className="description">Abertura de porta e chave reserva</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Pane Seca')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M3 22h18M5 18h14M7 14h10"/>
                  <path d="M12 6V2M8 10l-2-2M16 10l2-2"/>
                </svg>
              </div>
              <span className="title">Pane Seca</span>
              <span className="description">Entrega de combustível no local</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Troca de Pneu')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <span className="title">Troca de Pneu</span>
              <span className="description">Substituição pelo estepe</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Pane Elétrica')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <span className="title">Pane Elétrica</span>
              <span className="description">Carga na bateria ou troca</span>
            </button>

            <button className="assistance-card" onClick={() => handleAssistance('Socorro Mecânico')}>
              <div className="icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <span className="title">Socorro Mecânico</span>
              <span className="description">Reparo de pequenas panes</span>
            </button>
          </div>

          <div className="emergency-contact">
            <span className="label">Central de Atendimento 24h</span>
            <span className="phone">0800 123 4567</span>
          </div>
        </div>
      )}

      <style>{`
        .seguro-auto-page {
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

        .quote-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step .number {
          width: 32px;
          height: 32px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-weight: 600;
        }

        .step.active .number {
          background: #C9A227;
          color: #000;
        }

        .step .label {
          color: #888;
          font-size: 12px;
        }

        .step.active .label {
          color: #C9A227;
        }

        .line {
          width: 60px;
          height: 2px;
          background: #333;
          margin: 0 8px;
        }

        .quote-form {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .quote-form h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 20px;
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

        .fipe-info {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          background: #252525;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .fipe-info .label {
          color: #888;
        }

        .fipe-info .value {
          color: #C9A227;
          font-weight: 600;
        }

        .btn-group {
          display: flex;
          gap: 12px;
        }

        .btn-back-step {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 10px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-next, .btn-contract {
          flex: 2;
          padding: 14px;
          background: #C9A227;
          border: none;
          border-radius: 10px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-next:hover, .btn-contract:hover {
          background: #D4AF37;
        }

        .quote-result {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .result-header {
          margin-bottom: 24px;
        }

        .result-header h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 12px;
        }

        .vehicle-summary {
          display: flex;
          flex-direction: column;
        }

        .vehicle-name {
          color: #C9A227;
          font-size: 16px;
          font-weight: 500;
        }

        .vehicle-info {
          color: #888;
          font-size: 13px;
        }

        .premium-card {
          text-align: center;
          padding: 24px;
          background: #252525;
          border: 1px solid #C9A227;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .premium-card .label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .premium-card .value {
          color: #C9A227;
          font-size: 40px;
          font-weight: 700;
          display: block;
        }

        .premium-card .annual {
          color: #888;
          font-size: 13px;
        }

        .coverages-section {
          margin-bottom: 24px;
        }

        .coverages-section h4 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .coverages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .coverage-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #252525;
          border-radius: 10px;
          opacity: 0.5;
        }

        .coverage-item.included {
          opacity: 1;
        }

        .coverage-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .coverage-info {
          display: flex;
          flex-direction: column;
        }

        .coverage-info .name {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .coverage-info .description {
          color: #888;
          font-size: 12px;
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

        .btn-quote {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .vehicles-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vehicle-card {
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
          .vehicle-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .vehicle-icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vehicle-info {
          display: flex;
          flex-direction: column;
        }

        .vehicle-name {
          color: #fff;
          font-weight: 500;
        }

        .vehicle-details {
          color: #888;
          font-size: 13px;
        }

        .vehicle-plan {
          color: #C9A227;
          font-size: 12px;
          margin-top: 4px;
        }

        .vehicle-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        @media (max-width: 640px) {
          .vehicle-status {
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
      `}</style>
    </div>
  );
};

export default SeguroAuto;
