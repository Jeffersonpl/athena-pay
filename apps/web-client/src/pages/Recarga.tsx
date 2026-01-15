import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Operadora {
  id: string;
  name: string;
  color: string;
  logo: string;
}

interface Favorito {
  id: string;
  name: string;
  phone: string;
  operadora: string;
}

const operadoras: Operadora[] = [
  { id: 'vivo', name: 'Vivo', color: '#660099', logo: 'V' },
  { id: 'claro', name: 'Claro', color: '#DA291C', logo: 'C' },
  { id: 'tim', name: 'TIM', color: '#004B87', logo: 'T' },
  { id: 'oi', name: 'Oi', color: '#F5A623', logo: 'O' },
];

const valores = [10, 15, 20, 25, 30, 40, 50, 100];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

export default function Recarga() {
  const { showToast } = useToast();
  const [step, setStep] = useState<'phone' | 'value' | 'confirm' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [selectedOperadora, setSelectedOperadora] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [favoritos] = useState<Favorito[]>([
    { id: '1', name: 'Meu Celular', phone: '11999887766', operadora: 'vivo' },
    { id: '2', name: 'Maria', phone: '11988776655', operadora: 'claro' },
  ]);

  const [historico] = useState([
    { id: '1', phone: '11999887766', operadora: 'vivo', value: 30, date: '2025-01-10' },
    { id: '2', phone: '11988776655', operadora: 'claro', value: 20, date: '2025-01-05' },
    { id: '3', phone: '11999887766', operadora: 'vivo', value: 50, date: '2024-12-28' },
  ]);

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setPhone(cleaned.slice(0, 11));
  };

  const handleSelectFavorito = (fav: Favorito) => {
    setPhone(fav.phone);
    setSelectedOperadora(fav.operadora);
    setStep('value');
  };

  const handleContinueToValue = () => {
    if (phone.length !== 11) {
      showToast('error', 'Digite um número válido com DDD');
      return;
    }
    if (!selectedOperadora) {
      showToast('error', 'Selecione a operadora');
      return;
    }
    setStep('value');
  };

  const handleSelectValue = (value: number) => {
    setSelectedValue(value);
    setCustomValue('');
  };

  const handleContinueToConfirm = () => {
    const value = selectedValue || parseFloat(customValue);
    if (!value || value < 10) {
      showToast('error', 'Selecione um valor mínimo de R$ 10');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('success');
    showToast('success', 'Recarga realizada com sucesso!');
  };

  const handleNewRecarga = () => {
    setPhone('');
    setSelectedOperadora(null);
    setSelectedValue(null);
    setCustomValue('');
    setStep('phone');
  };

  const finalValue = selectedValue || parseFloat(customValue) || 0;
  const operadora = operadoras.find(o => o.id === selectedOperadora);

  return (
    <div className="recarga-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>
        <h1>Recarga de Celular</h1>
        <p>Recarregue qualquer operadora</p>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${step === 'phone' ? 'active' : step !== 'phone' ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span>Número</span>
        </div>
        <div className="step-line" />
        <div className={`step ${step === 'value' ? 'active' : ['confirm', 'success'].includes(step) ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span>Valor</span>
        </div>
        <div className="step-line" />
        <div className={`step ${step === 'confirm' ? 'active' : step === 'success' ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <span>Confirmar</span>
        </div>
      </div>

      {/* Step 1: Phone */}
      {step === 'phone' && (
        <div className="step-content">
          {/* Favoritos */}
          {favoritos.length > 0 && (
            <div className="section">
              <h3>Favoritos</h3>
              <div className="favoritos-list">
                {favoritos.map(fav => {
                  const op = operadoras.find(o => o.id === fav.operadora);
                  return (
                    <button
                      key={fav.id}
                      className="favorito-item"
                      onClick={() => handleSelectFavorito(fav)}
                    >
                      <div className="favorito-avatar" style={{ background: op?.color }}>
                        {fav.name.charAt(0)}
                      </div>
                      <div className="favorito-info">
                        <span className="favorito-name">{fav.name}</span>
                        <span className="favorito-phone">{formatPhone(fav.phone)}</span>
                      </div>
                      <div className="favorito-op" style={{ background: `${op?.color}20`, color: op?.color }}>
                        {op?.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Phone Input */}
          <div className="section">
            <h3>Ou digite o número</h3>
            <div className="phone-input">
              <span className="phone-prefix">+55</span>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={formatPhone(phone)}
                onChange={e => handlePhoneChange(e.target.value)}
                maxLength={16}
              />
            </div>
          </div>

          {/* Operadoras */}
          <div className="section">
            <h3>Operadora</h3>
            <div className="operadoras-grid">
              {operadoras.map(op => (
                <button
                  key={op.id}
                  className={`operadora-item ${selectedOperadora === op.id ? 'active' : ''}`}
                  onClick={() => setSelectedOperadora(op.id)}
                  style={{ '--op-color': op.color } as React.CSSProperties}
                >
                  <div className="operadora-logo" style={{ background: op.color }}>
                    {op.logo}
                  </div>
                  <span>{op.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="btn-continue" onClick={handleContinueToValue}>
            Continuar
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}

      {/* Step 2: Value */}
      {step === 'value' && (
        <div className="step-content">
          <div className="selected-phone">
            <div className="phone-avatar" style={{ background: operadora?.color }}>
              {operadora?.logo}
            </div>
            <div className="phone-details">
              <span className="phone-number">{formatPhone(phone)}</span>
              <span className="phone-operadora">{operadora?.name}</span>
            </div>
            <button className="btn-edit" onClick={() => setStep('phone')}>Alterar</button>
          </div>

          <div className="section">
            <h3>Selecione o valor</h3>
            <div className="values-grid">
              {valores.map(value => (
                <button
                  key={value}
                  className={`value-item ${selectedValue === value ? 'active' : ''}`}
                  onClick={() => handleSelectValue(value)}
                >
                  {formatCurrency(value)}
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Ou digite outro valor</h3>
            <div className="custom-value-input">
              <span>R$</span>
              <input
                type="number"
                placeholder="0,00"
                value={customValue}
                onChange={e => {
                  setCustomValue(e.target.value);
                  setSelectedValue(null);
                }}
              />
            </div>
            <span className="value-hint">Valor mínimo: R$ 10,00</span>
          </div>

          <div className="step-actions">
            <button className="btn-back" onClick={() => setStep('phone')}>Voltar</button>
            <button className="btn-continue" onClick={handleContinueToConfirm}>
              Continuar
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 'confirm' && (
        <div className="step-content">
          <div className="confirm-card">
            <div className="confirm-header">
              <div className="confirm-icon" style={{ background: operadora?.color }}>
                {operadora?.logo}
              </div>
              <h3>Confirme sua recarga</h3>
            </div>

            <div className="confirm-details">
              <div className="detail-row">
                <span>Número</span>
                <span>{formatPhone(phone)}</span>
              </div>
              <div className="detail-row">
                <span>Operadora</span>
                <span>{operadora?.name}</span>
              </div>
              <div className="detail-row highlight">
                <span>Valor</span>
                <span className="gold">{formatCurrency(finalValue)}</span>
              </div>
            </div>
          </div>

          <div className="step-actions">
            <button className="btn-back" onClick={() => setStep('value')}>Voltar</button>
            <button className="btn-confirm" onClick={handleConfirm} disabled={loading}>
              {loading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  Confirmar Recarga
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <div className="step-content success-content">
          <div className="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2>Recarga realizada!</h2>
          <p>Sua recarga foi processada com sucesso</p>

          <div className="success-card">
            <div className="detail-row">
              <span>Número</span>
              <span>{formatPhone(phone)}</span>
            </div>
            <div className="detail-row">
              <span>Operadora</span>
              <span>{operadora?.name}</span>
            </div>
            <div className="detail-row">
              <span>Valor</span>
              <span className="gold">{formatCurrency(finalValue)}</span>
            </div>
          </div>

          <button className="btn-new" onClick={handleNewRecarga}>
            Nova Recarga
          </button>
        </div>
      )}

      {/* Histórico */}
      {step === 'phone' && historico.length > 0 && (
        <div className="historico-section">
          <h3>Últimas recargas</h3>
          <div className="historico-list">
            {historico.map(item => {
              const op = operadoras.find(o => o.id === item.operadora);
              return (
                <div key={item.id} className="historico-item">
                  <div className="historico-avatar" style={{ background: op?.color }}>
                    {op?.logo}
                  </div>
                  <div className="historico-info">
                    <span className="historico-phone">{formatPhone(item.phone)}</span>
                    <span className="historico-date">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <span className="historico-value">{formatCurrency(item.value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .recarga-page {
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

        /* Progress Steps */
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 2px solid #333;
          border-radius: 50%;
          color: #666;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .step span {
          font-size: 12px;
          color: #666;
        }

        .step.active .step-number {
          background: #C9A227;
          border-color: #C9A227;
          color: #0D0D0D;
        }

        .step.active span {
          color: #C9A227;
        }

        .step.completed .step-number {
          background: #22C55E;
          border-color: #22C55E;
          color: #fff;
        }

        .step.completed span {
          color: #22C55E;
        }

        .step-line {
          width: 40px;
          height: 2px;
          background: #333;
          margin-bottom: 20px;
        }

        /* Step Content */
        .step-content {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section {
          margin-bottom: 24px;
        }

        .section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 12px;
        }

        /* Favoritos */
        .favoritos-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .favorito-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .favorito-item:hover {
          border-color: #C9A227;
        }

        .favorito-avatar {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }

        .favorito-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .favorito-name {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .favorito-phone {
          font-size: 13px;
          color: #666;
        }

        .favorito-op {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Phone Input */
        .phone-input {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          padding: 16px;
          transition: border-color 0.2s;
        }

        .phone-input:focus-within {
          border-color: #C9A227;
        }

        .phone-prefix {
          font-size: 16px;
          font-weight: 600;
          color: #666;
        }

        .phone-input input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          outline: none;
        }

        /* Operadoras */
        .operadoras-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .operadora-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: #1A1A1A;
          border: 2px solid #333;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .operadora-item:hover, .operadora-item.active {
          border-color: var(--op-color);
          background: color-mix(in srgb, var(--op-color) 10%, #1A1A1A);
        }

        .operadora-logo {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
        }

        .operadora-item span {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }

        /* Selected Phone */
        .selected-phone {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          margin-bottom: 24px;
        }

        .phone-avatar {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
        }

        .phone-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .phone-number {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .phone-operadora {
          font-size: 13px;
          color: #666;
        }

        .btn-edit {
          padding: 8px 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #C9A227;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Values Grid */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .value-item {
          padding: 16px;
          background: #1A1A1A;
          border: 2px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .value-item:hover, .value-item.active {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
          color: #C9A227;
        }

        /* Custom Value */
        .custom-value-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          padding: 16px;
        }

        .custom-value-input span {
          font-size: 20px;
          color: #666;
        }

        .custom-value-input input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
        }

        .value-hint {
          font-size: 12px;
          color: #666;
          margin-top: 8px;
          display: block;
        }

        /* Buttons */
        .btn-continue, .btn-confirm {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-continue:hover, .btn-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201, 162, 39, 0.3);
        }

        .btn-confirm {
          background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
          color: #fff;
        }

        .btn-confirm:hover {
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
        }

        .btn-back {
          flex: 1;
          padding: 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .step-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .step-actions .btn-continue,
        .step-actions .btn-confirm {
          flex: 2;
        }

        /* Confirm Card */
        .confirm-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
        }

        .confirm-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .confirm-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          color: #fff;
          font-size: 28px;
          font-weight: 800;
        }

        .confirm-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .confirm-details {
          background: #262626;
          border-radius: 14px;
          overflow: hidden;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid #333;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row span:first-child {
          color: #A3A3A3;
          font-size: 14px;
        }

        .detail-row span:last-child {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }

        .detail-row.highlight {
          background: #1A1A1A;
        }

        .gold {
          color: #C9A227 !important;
        }

        /* Success */
        .success-content {
          text-align: center;
          padding: 40px 0;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.15);
          border: 2px solid #22C55E;
          border-radius: 50%;
          color: #22C55E;
          animation: scaleIn 0.3s ease-out;
        }

        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .success-content h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .success-content > p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 32px;
        }

        .success-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          margin-bottom: 24px;
          text-align: left;
        }

        .btn-new {
          padding: 14px 32px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-new:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* Loading */
        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Histórico */
        .historico-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #262626;
        }

        .historico-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 16px;
        }

        .historico-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .historico-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 14px;
        }

        .historico-avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
        }

        .historico-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .historico-phone {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .historico-date {
          font-size: 12px;
          color: #666;
        }

        .historico-value {
          font-size: 14px;
          font-weight: 600;
          color: #C9A227;
        }

        @media (max-width: 480px) {
          .operadoras-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
