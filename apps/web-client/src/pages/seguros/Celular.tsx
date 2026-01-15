import React, { useState } from 'react';
import { useToast } from '../../ui/Toast';

interface Plan {
  id: string;
  name: string;
  coverage: string[];
  monthlyPrice: number;
  deductible: number;
}

interface Device {
  id: string;
  brand: string;
  model: string;
  imei: string;
  insured: boolean;
  plan?: string;
}

const SeguroCelular: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'plans' | 'devices' | 'claims'>('plans');
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [newDevice, setNewDevice] = useState({ brand: '', model: '', imei: '' });

  const [plans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Proteção Básica',
      coverage: ['Roubo e furto qualificado', 'Quebra acidental de tela'],
      monthlyPrice: 19.90,
      deductible: 150,
    },
    {
      id: '2',
      name: 'Proteção Completa',
      coverage: [
        'Roubo e furto qualificado',
        'Quebra acidental de tela',
        'Danos por líquidos',
        'Defeitos elétricos',
      ],
      monthlyPrice: 34.90,
      deductible: 100,
    },
    {
      id: '3',
      name: 'Proteção Premium',
      coverage: [
        'Roubo e furto qualificado',
        'Quebra acidental de tela',
        'Danos por líquidos',
        'Defeitos elétricos',
        'Acessórios (fone, carregador)',
        'Aparelho reserva durante reparo',
      ],
      monthlyPrice: 49.90,
      deductible: 50,
    },
  ]);

  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      brand: 'Apple',
      model: 'iPhone 14 Pro',
      imei: '352***********789',
      insured: true,
      plan: 'Proteção Completa',
    },
  ]);

  const [claims] = useState([
    {
      id: '1',
      device: 'iPhone 14 Pro',
      type: 'Quebra de tela',
      date: '2024-01-10',
      status: 'em_analise',
      protocol: 'SC-2024-0001',
    },
  ]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowAddDeviceModal(true);
  };

  const handleAddDevice = () => {
    if (!newDevice.brand || !newDevice.model || !newDevice.imei) {
      showToast('Preencha todos os campos', 'error');
      return;
    }
    if (newDevice.imei.length < 15) {
      showToast('IMEI deve ter 15 dígitos', 'error');
      return;
    }
    const device: Device = {
      id: Date.now().toString(),
      ...newDevice,
      insured: true,
      plan: selectedPlan?.name,
    };
    setDevices([...devices, device]);
    showToast(`Seguro ${selectedPlan?.name} contratado com sucesso!`, 'success');
    setShowAddDeviceModal(false);
    setNewDevice({ brand: '', model: '', imei: '' });
    setSelectedPlan(null);
  };

  const handleCancelInsurance = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId ? { ...d, insured: false, plan: undefined } : d
    ));
    showToast('Seguro cancelado', 'info');
  };

  const handleNewClaim = () => {
    showToast('Sinistro registrado. Acompanhe pelo protocolo enviado por e-mail.', 'success');
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      em_analise: { text: 'Em Análise', color: '#F59E0B' },
      aprovado: { text: 'Aprovado', color: '#22C55E' },
      negado: { text: 'Negado', color: '#EF4444' },
      concluido: { text: 'Concluído', color: '#3B82F6' },
    };
    return labels[status] || { text: status, color: '#888' };
  };

  return (
    <div className="seguro-celular-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => window.history.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-content">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12" y2="18"/>
            </svg>
          </div>
          <h1>Seguro Celular</h1>
          <p>Proteção completa para seu smartphone</p>
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
          className={`tab ${activeTab === 'devices' ? 'active' : ''}`}
          onClick={() => setActiveTab('devices')}
        >
          Meus Aparelhos
        </button>
        <button
          className={`tab ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          Sinistros
        </button>
      </div>

      {activeTab === 'plans' && (
        <div className="plans-section">
          <div className="plans-list">
            {plans.map(plan => (
              <div key={plan.id} className="plan-card">
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <span className="amount">{formatCurrency(plan.monthlyPrice)}</span>
                    <span className="period">/mês</span>
                  </div>
                </div>
                <div className="deductible">
                  <span className="label">Franquia</span>
                  <span className="value">{formatCurrency(plan.deductible)}</span>
                </div>
                <ul className="coverage-list">
                  {plan.coverage.map((item, idx) => (
                    <li key={idx}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <path d="M22 4L12 14.01l-3-3"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="btn-select" onClick={() => handleSelectPlan(plan)}>
                  Selecionar Plano
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="devices-section">
          {devices.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12" y2="18"/>
              </svg>
              <h3>Nenhum aparelho segurado</h3>
              <p>Proteja seu smartphone contra imprevistos</p>
              <button className="btn-add" onClick={() => setActiveTab('plans')}>
                Ver Planos
              </button>
            </div>
          ) : (
            <div className="devices-list">
              {devices.map(device => (
                <div key={device.id} className={`device-card ${device.insured ? 'insured' : ''}`}>
                  <div className="device-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={device.insured ? '#C9A227' : '#666'} strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12" y2="18"/>
                    </svg>
                  </div>
                  <div className="device-info">
                    <span className="brand">{device.brand}</span>
                    <span className="model">{device.model}</span>
                    <span className="imei">IMEI: {device.imei}</span>
                  </div>
                  <div className="device-status">
                    {device.insured ? (
                      <>
                        <span className="status insured">Segurado</span>
                        <span className="plan">{device.plan}</span>
                        <button className="btn-cancel" onClick={() => handleCancelInsurance(device.id)}>
                          Cancelar Seguro
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="status not-insured">Não segurado</span>
                        <button className="btn-insure" onClick={() => setActiveTab('plans')}>
                          Contratar Seguro
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="claims-section">
          <div className="section-header">
            <h2>Sinistros</h2>
            <button className="btn-new-claim" onClick={handleNewClaim}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Novo Sinistro
            </button>
          </div>

          {claims.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <h3>Nenhum sinistro registrado</h3>
              <p>Esperamos que você nunca precise usar</p>
            </div>
          ) : (
            <div className="claims-list">
              {claims.map(claim => {
                const status = getStatusLabel(claim.status);
                return (
                  <div key={claim.id} className="claim-card">
                    <div className="claim-header">
                      <div className="claim-info">
                        <span className="device">{claim.device}</span>
                        <span className="type">{claim.type}</span>
                      </div>
                      <span className="status" style={{ color: status.color, background: `${status.color}15` }}>
                        {status.text}
                      </span>
                    </div>
                    <div className="claim-details">
                      <div className="detail">
                        <span className="label">Protocolo</span>
                        <span className="value">{claim.protocol}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Data</span>
                        <span className="value">{new Date(claim.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <button className="btn-details" onClick={() => showToast('Detalhes do sinistro', 'info')}>
                      Ver Detalhes
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showAddDeviceModal && (
        <div className="modal-overlay" onClick={() => setShowAddDeviceModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adicionar Aparelho</h3>
              <button className="btn-close" onClick={() => setShowAddDeviceModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              {selectedPlan && (
                <div className="selected-plan">
                  <span className="label">Plano selecionado</span>
                  <span className="plan-name">{selectedPlan.name}</span>
                  <span className="plan-price">{formatCurrency(selectedPlan.monthlyPrice)}/mês</span>
                </div>
              )}
              <div className="form-group">
                <label>Marca</label>
                <select
                  value={newDevice.brand}
                  onChange={e => setNewDevice({ ...newDevice, brand: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Motorola">Motorola</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <input
                  type="text"
                  value={newDevice.model}
                  onChange={e => setNewDevice({ ...newDevice, model: e.target.value })}
                  placeholder="Ex: iPhone 14 Pro"
                />
              </div>
              <div className="form-group">
                <label>IMEI (15 dígitos)</label>
                <input
                  type="text"
                  value={newDevice.imei}
                  onChange={e => setNewDevice({ ...newDevice, imei: e.target.value.replace(/\D/g, '').slice(0, 15) })}
                  placeholder="Digite o IMEI"
                  maxLength={15}
                />
                <span className="hint">Encontre o IMEI em Configurações ou digitando *#06#</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddDeviceModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleAddDevice}>
                Contratar Seguro
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .seguro-celular-page {
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
        }

        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .plan-header h3 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .price .amount {
          color: #C9A227;
          font-size: 24px;
          font-weight: 600;
        }

        .price .period {
          color: #888;
          font-size: 14px;
        }

        .deductible {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: #252525;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .deductible .label {
          color: #888;
          font-size: 14px;
        }

        .deductible .value {
          color: #fff;
          font-weight: 500;
        }

        .coverage-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
        }

        .coverage-list li {
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
          background: #C9A227;
          border: none;
          border-radius: 10px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-select:hover {
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

        .btn-add {
          padding: 14px 32px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .devices-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .device-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 16px;
          align-items: center;
        }

        .device-card.insured {
          border-color: #C9A22740;
        }

        @media (max-width: 640px) {
          .device-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .device-icon {
            justify-content: center;
          }
        }

        .device-icon {
          width: 60px;
          height: 60px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .device-info {
          display: flex;
          flex-direction: column;
        }

        .device-info .brand {
          color: #888;
          font-size: 12px;
        }

        .device-info .model {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
        }

        .device-info .imei {
          color: #666;
          font-size: 12px;
          font-family: monospace;
        }

        .device-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        @media (max-width: 640px) {
          .device-status {
            align-items: center;
          }
        }

        .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status.insured {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .status.not-insured {
          background: rgba(136, 136, 136, 0.1);
          color: #888;
        }

        .device-status .plan {
          color: #C9A227;
          font-size: 12px;
        }

        .btn-cancel {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #EF4444;
          border-radius: 6px;
          color: #EF4444;
          font-size: 12px;
          cursor: pointer;
          margin-top: 8px;
        }

        .btn-insure {
          padding: 8px 16px;
          background: #C9A227;
          border: none;
          border-radius: 6px;
          color: #000;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 8px;
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

        .btn-new-claim {
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
        }

        .claims-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .claim-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .claim-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .claim-info .device {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .claim-info .type {
          color: #888;
          font-size: 12px;
        }

        .claim-header .status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .claim-details {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .claim-details .detail {
          display: flex;
          flex-direction: column;
        }

        .claim-details .label {
          color: #888;
          font-size: 12px;
        }

        .claim-details .value {
          color: #fff;
          font-size: 14px;
        }

        .btn-details {
          width: 100%;
          padding: 10px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-details:hover {
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

        .selected-plan {
          background: #252525;
          border: 1px solid #C9A227;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
          text-align: center;
        }

        .selected-plan .label {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .selected-plan .plan-name {
          color: #C9A227;
          font-size: 18px;
          font-weight: 600;
          display: block;
          margin: 4px 0;
        }

        .selected-plan .plan-price {
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

        .hint {
          display: block;
          color: #888;
          font-size: 11px;
          margin-top: 4px;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .modal-footer .btn-cancel {
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

export default SeguroCelular;
