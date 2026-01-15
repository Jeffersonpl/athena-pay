import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useToast } from '../ui/Toast';

interface LoanSimulation {
  approved: boolean;
  approved_amount: number;
  installments: number;
  installment_value: number;
  total_amount: number;
  interest_rate: number;
  cet: number;
  first_due_date: string;
  iof: number;
}

interface CreditScore {
  score: number;
  band: string;
  factors: string[];
  limit: number;
}

const CreditIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(date));

const getScoreColor = (band: string) => {
  const colors: Record<string, string> = {
    A: '#16a34a',
    B: '#22c55e',
    C: '#eab308',
    D: '#f97316',
    E: '#ef4444',
  };
  return colors[band] || '#71717a';
};

export default function Loans() {
  const { showToast } = useToast();
  const [step, setStep] = useState<'score' | 'simulate' | 'confirm' | 'success'>('score');
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [simulation, setSimulation] = useState<LoanSimulation | null>(null);

  // Form state
  const [amount, setAmount] = useState(5000);
  const [installments, setInstallments] = useState(12);
  const [purpose, setPurpose] = useState('PERSONAL');

  // Load credit score
  useEffect(() => {
    let mounted = true;

    const loadScore = async () => {
      try {
        const result = await api._unsafeFetch('/loans/credit/score/cust-001');
        if (!mounted) return;
        setCreditScore(result);
      } catch (e) {
        console.error('Error loading credit score:', e);
        // Mock data for demo
        setCreditScore({
          score: 720,
          band: 'B',
          factors: [
            'Historico de pagamentos positivo',
            'Tempo de conta satisfatorio',
            'Saldo medio bom',
          ],
          limit: 25000,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadScore();
    return () => { mounted = false; };
  }, []);

  const handleSimulate = useCallback(async () => {
    setSimulating(true);
    try {
      const result = await api._unsafeFetch('/loans/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 'cust-001',
          requested_amount: amount,
          installments,
          purpose,
        }),
      });
      setSimulation(result);
      setStep('simulate');
      showToast('success', 'Simulação realizada!');
    } catch (e) {
      console.error('Error simulating loan:', e);
      // Mock simulation for demo
      const rate = 0.025;
      const installmentValue = (amount * (1 + rate * installments)) / installments;
      setSimulation({
        approved: true,
        approved_amount: amount,
        installments,
        installment_value: installmentValue,
        total_amount: installmentValue * installments,
        interest_rate: rate,
        cet: rate * 1.15,
        first_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        iof: amount * 0.0038,
      });
      setStep('simulate');
      showToast('success', 'Simulação realizada!');
    } finally {
      setSimulating(false);
    }
  }, [amount, installments, purpose, showToast]);

  const handleApply = useCallback(async () => {
    setApplying(true);
    try {
      await api._unsafeFetch('/loans/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 'cust-001',
          requested_amount: amount,
          installments,
          purpose,
        }),
      });
      setStep('success');
      showToast('success', 'Empréstimo aprovado!');
    } catch (e) {
      console.error('Error applying for loan:', e);
      // Demo success
      setStep('success');
      showToast('success', 'Empréstimo aprovado!');
    } finally {
      setApplying(false);
    }
  }, [amount, installments, purpose, showToast]);

  if (loading) {
    return (
      <div className="loans-loading">
        <div className="spinner" />
        <span>Carregando seu perfil de credito...</span>
      </div>
    );
  }

  return (
    <div className="loans-page">
      <header className="loans-header">
        <a href="#/" className="back-btn">← Voltar</a>
        <h1>Emprestimo Pessoal</h1>
      </header>

      <main className="loans-main">
        {/* Credit Score Section */}
        {step === 'score' && creditScore && (
          <>
            <section className="score-card">
              <div className="score-header">
                <CreditIcon />
                <span>Seu Score Athena</span>
              </div>
              <div className="score-value">
                <span className="score-number">{creditScore.score}</span>
                <span
                  className="score-band"
                  style={{ backgroundColor: getScoreColor(creditScore.band) }}
                >
                  Faixa {creditScore.band}
                </span>
              </div>
              <div className="score-bar">
                <div
                  className="score-bar-fill"
                  style={{
                    width: `${(creditScore.score / 1000) * 100}%`,
                    backgroundColor: getScoreColor(creditScore.band),
                  }}
                />
              </div>
              <div className="score-range">
                <span>0</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </section>

            <section className="limit-card">
              <div className="limit-header">
                <span>Limite disponivel</span>
                <InfoIcon />
              </div>
              <div className="limit-value">{formatCurrency(creditScore.limit)}</div>
              <p className="limit-description">
                Valor maximo pre-aprovado baseado no seu perfil
              </p>
            </section>

            <section className="factors-card">
              <h3>O que influencia seu score</h3>
              <ul className="factors-list">
                {creditScore.factors.map((factor, i) => (
                  <li key={i}>
                    <CheckIcon />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="simulate-form">
              <h3>Simule seu emprestimo</h3>

              <div className="form-group">
                <label>Quanto voce precisa?</label>
                <div className="amount-input">
                  <span className="currency">R$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.min(Number(e.target.value), creditScore.limit))}
                    min={500}
                    max={creditScore.limit}
                  />
                </div>
                <input
                  type="range"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={500}
                  max={creditScore.limit}
                  step={100}
                  className="amount-slider"
                />
                <div className="amount-range">
                  <span>R$ 500</span>
                  <span>{formatCurrency(creditScore.limit)}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Em quantas vezes?</label>
                <div className="installments-options">
                  {[6, 12, 18, 24, 36].map((n) => (
                    <button
                      key={n}
                      className={`installment-option ${installments === n ? 'active' : ''}`}
                      onClick={() => setInstallments(n)}
                    >
                      {n}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Para que voce precisa?</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="purpose-select"
                >
                  <option value="PERSONAL">Uso pessoal</option>
                  <option value="DEBT_CONSOLIDATION">Quitar dividas</option>
                  <option value="HOME_IMPROVEMENT">Reforma da casa</option>
                  <option value="EDUCATION">Educacao</option>
                  <option value="HEALTH">Saude</option>
                  <option value="VEHICLE">Veiculo</option>
                  <option value="TRAVEL">Viagem</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>

              <button
                className="simulate-btn"
                onClick={handleSimulate}
                disabled={simulating}
              >
                {simulating ? 'Simulando...' : 'Simular emprestimo'}
              </button>
            </section>
          </>
        )}

        {/* Simulation Results */}
        {step === 'simulate' && simulation && (
          <>
            <section className="simulation-result">
              <div className="result-header">
                {simulation.approved ? (
                  <div className="approved-badge">
                    <CheckIcon />
                    <span>Pre-aprovado!</span>
                  </div>
                ) : (
                  <div className="denied-badge">
                    <AlertIcon />
                    <span>Nao aprovado</span>
                  </div>
                )}
              </div>

              <div className="result-amount">
                <span className="label">Valor do emprestimo</span>
                <span className="value">{formatCurrency(simulation.approved_amount)}</span>
              </div>

              <div className="result-grid">
                <div className="result-item">
                  <span className="label">{simulation.installments}x de</span>
                  <span className="value">{formatCurrency(simulation.installment_value)}</span>
                </div>
                <div className="result-item">
                  <span className="label">Taxa de juros</span>
                  <span className="value">{formatPercent(simulation.interest_rate)} a.m.</span>
                </div>
                <div className="result-item">
                  <span className="label">CET</span>
                  <span className="value">{formatPercent(simulation.cet)} a.m.</span>
                </div>
                <div className="result-item">
                  <span className="label">Total a pagar</span>
                  <span className="value">{formatCurrency(simulation.total_amount)}</span>
                </div>
              </div>

              <div className="result-details">
                <div className="detail-row">
                  <span>Primeira parcela em</span>
                  <span>{formatDate(simulation.first_due_date)}</span>
                </div>
                <div className="detail-row">
                  <span>IOF</span>
                  <span>{formatCurrency(simulation.iof)}</span>
                </div>
              </div>
            </section>

            <div className="simulation-actions">
              <button className="back-btn-secondary" onClick={() => setStep('score')}>
                Voltar e ajustar
              </button>
              <button
                className="continue-btn"
                onClick={() => setStep('confirm')}
                disabled={!simulation.approved}
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Confirmation */}
        {step === 'confirm' && simulation && (
          <>
            <section className="confirm-section">
              <h2>Confirme seu emprestimo</h2>
              <p>Revise os detalhes antes de finalizar</p>

              <div className="confirm-card">
                <div className="confirm-row main">
                  <span>Valor do emprestimo</span>
                  <span>{formatCurrency(simulation.approved_amount)}</span>
                </div>
                <div className="confirm-row">
                  <span>Parcelas</span>
                  <span>{simulation.installments}x de {formatCurrency(simulation.installment_value)}</span>
                </div>
                <div className="confirm-row">
                  <span>Primeira parcela</span>
                  <span>{formatDate(simulation.first_due_date)}</span>
                </div>
                <div className="confirm-row">
                  <span>Taxa de juros</span>
                  <span>{formatPercent(simulation.interest_rate)} a.m.</span>
                </div>
                <div className="confirm-row">
                  <span>CET</span>
                  <span>{formatPercent(simulation.cet)} a.m.</span>
                </div>
                <div className="confirm-row">
                  <span>IOF</span>
                  <span>{formatCurrency(simulation.iof)}</span>
                </div>
                <div className="confirm-row total">
                  <span>Total a pagar</span>
                  <span>{formatCurrency(simulation.total_amount)}</span>
                </div>
              </div>

              <div className="terms-check">
                <label>
                  <input type="checkbox" defaultChecked />
                  <span>Li e concordo com os termos e condicoes do emprestimo</span>
                </label>
              </div>
            </section>

            <div className="confirm-actions">
              <button className="back-btn-secondary" onClick={() => setStep('simulate')}>
                Voltar
              </button>
              <button
                className="confirm-btn"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? 'Processando...' : 'Confirmar emprestimo'}
              </button>
            </div>
          </>
        )}

        {/* Success */}
        {step === 'success' && simulation && (
          <section className="success-section">
            <div className="success-icon">
              <CheckIcon />
            </div>
            <h2>Emprestimo aprovado!</h2>
            <p>O valor sera creditado em sua conta em ate 1 hora.</p>

            <div className="success-details">
              <div className="success-row">
                <span>Valor</span>
                <span>{formatCurrency(simulation.approved_amount)}</span>
              </div>
              <div className="success-row">
                <span>Parcelas</span>
                <span>{simulation.installments}x de {formatCurrency(simulation.installment_value)}</span>
              </div>
            </div>

            <a href="#/" className="home-btn">
              Voltar para o inicio
            </a>
          </section>
        )}
      </main>

      <style>{`
        .loans-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        .loans-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 16px;
          color: #A3A3A3;
          background: #0D0D0D;
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

        .loans-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          color: white;
          padding: 24px 20px;
          border-bottom: 1px solid #262626;
        }

        .loans-header .back-btn {
          color: #A3A3A3;
          text-decoration: none;
          font-size: 14px;
          display: block;
          margin-bottom: 12px;
        }

        .loans-header h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: #fff;
        }

        .loans-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 16px 24px;
        }

        .score-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
        }

        .score-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #C9A227;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .score-value {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .score-number {
          font-size: 48px;
          font-weight: 800;
          color: #fff;
        }

        .score-band {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .score-bar {
          height: 8px;
          background: #262626;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .score-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .score-range {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
        }

        .limit-card {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          padding: 24px;
          color: white;
          margin-bottom: 16px;
        }

        .limit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .limit-value {
          font-size: 32px;
          font-weight: 700;
          color: #C9A227;
          margin-bottom: 8px;
        }

        .limit-description {
          font-size: 13px;
          color: #A3A3A3;
          margin: 0;
        }

        .factors-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .factors-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 16px;
        }

        .factors-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .factors-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #262626;
          font-size: 14px;
          color: #A3A3A3;
        }

        .factors-list li:last-child {
          border-bottom: none;
        }

        .factors-list li svg {
          color: #22C55E;
        }

        .simulate-form {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
        }

        .simulate-form h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 20px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .amount-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 12px;
        }

        .amount-input .currency {
          color: #666;
          font-size: 18px;
        }

        .amount-input input {
          flex: 1;
          border: none;
          background: none;
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          outline: none;
          width: 100%;
        }

        .amount-slider {
          width: 100%;
          height: 8px;
          background: #262626;
          border-radius: 4px;
          appearance: none;
          outline: none;
        }

        .amount-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(201, 162, 39, 0.4);
        }

        .amount-range {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          margin-top: 8px;
        }

        .installments-options {
          display: flex;
          gap: 8px;
        }

        .installment-option {
          flex: 1;
          padding: 12px;
          border: 1px solid #333;
          border-radius: 12px;
          background: #262626;
          font-size: 16px;
          font-weight: 600;
          color: #A3A3A3;
          cursor: pointer;
          transition: all 0.2s;
        }

        .installment-option:hover {
          border-color: #C9A227;
        }

        .installment-option.active {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .purpose-select {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #333;
          border-radius: 12px;
          font-size: 16px;
          color: #fff;
          background: #262626;
          cursor: pointer;
          outline: none;
        }

        .purpose-select:focus {
          border-color: #C9A227;
        }

        .simulate-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          color: #0D0D0D;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .simulate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        .simulate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .simulation-result {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
        }

        .result-header {
          margin-bottom: 20px;
        }

        .approved-badge, .denied-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .approved-badge {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .denied-badge {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .result-amount {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #262626;
          margin-bottom: 20px;
        }

        .result-amount .label {
          display: block;
          font-size: 14px;
          color: #A3A3A3;
          margin-bottom: 4px;
        }

        .result-amount .value {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .result-item {
          text-align: center;
          padding: 16px;
          background: #262626;
          border-radius: 12px;
        }

        .result-item .label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .result-item .value {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }

        .result-details {
          border-top: 1px solid #262626;
          padding-top: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 8px 0;
          color: #A3A3A3;
        }

        .simulation-actions {
          display: flex;
          gap: 12px;
        }

        .back-btn-secondary {
          flex: 1;
          padding: 14px;
          background: #262626;
          color: #A3A3A3;
          border: 1px solid #333;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .continue-btn, .confirm-btn {
          flex: 2;
          padding: 14px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          color: #0D0D0D;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .continue-btn:disabled, .confirm-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .confirm-section {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 16px;
        }

        .confirm-section h2 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .confirm-section p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 20px;
        }

        .confirm-card {
          background: #262626;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .confirm-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: #A3A3A3;
          border-bottom: 1px solid #333;
        }

        .confirm-row:last-child {
          border-bottom: none;
        }

        .confirm-row.main {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .confirm-row.total {
          font-size: 18px;
          font-weight: 700;
          color: #C9A227;
          padding-top: 12px;
          margin-top: 8px;
          border-top: 1px solid #333;
        }

        .terms-check {
          font-size: 13px;
          color: #A3A3A3;
        }

        .terms-check label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .terms-check input {
          margin-top: 2px;
          accent-color: #C9A227;
        }

        .confirm-actions {
          display: flex;
          gap: 12px;
        }

        .success-section {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 40px 24px;
          text-align: center;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #22C55E;
        }

        .success-icon svg {
          width: 32px;
          height: 32px;
        }

        .success-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .success-section p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 24px;
        }

        .success-details {
          background: #262626;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .success-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #A3A3A3;
        }

        .home-btn {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          color: #0D0D0D;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
