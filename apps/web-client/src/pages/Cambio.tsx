import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
  balance: number;
}

interface ExchangeHistory {
  id: string;
  from: string;
  to: string;
  amountFrom: number;
  amountTo: number;
  rate: number;
  date: string;
}

const Cambio: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'exchange' | 'accounts' | 'history'>('exchange');
  const [fromCurrency, setFromCurrency] = useState<string>('BRL');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [amount, setAmount] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [currencies] = useState<Currency[]>([
    { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', flag: '🇧🇷', rate: 1, balance: 15000.00 },
    { code: 'USD', name: 'Dólar Americano', symbol: '$', flag: '🇺🇸', rate: 5.05, balance: 500.00 },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 5.45, balance: 250.00 },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧', rate: 6.35, balance: 100.00 },
    { code: 'JPY', name: 'Iene Japonês', symbol: '¥', flag: '🇯🇵', rate: 0.034, balance: 0 },
    { code: 'CHF', name: 'Franco Suíço', symbol: 'CHF', flag: '🇨🇭', rate: 5.65, balance: 0 },
    { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$', flag: '🇨🇦', rate: 3.75, balance: 0 },
    { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$', flag: '🇦🇺', rate: 3.30, balance: 0 },
  ]);

  const [history] = useState<ExchangeHistory[]>([
    { id: '1', from: 'BRL', to: 'USD', amountFrom: 1000, amountTo: 198.02, rate: 5.05, date: '2024-01-15' },
    { id: '2', from: 'BRL', to: 'EUR', amountFrom: 2000, amountTo: 367.00, rate: 5.45, date: '2024-01-12' },
    { id: '3', from: 'USD', to: 'BRL', amountFrom: 100, amountTo: 505.00, rate: 5.05, date: '2024-01-10' },
    { id: '4', from: 'BRL', to: 'GBP', amountFrom: 500, amountTo: 78.74, rate: 6.35, date: '2024-01-08' },
  ]);

  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  const calculateExchange = () => {
    if (!amount || !fromCurrencyData || !toCurrencyData) return 0;
    const value = parseFloat(amount);
    if (isNaN(value)) return 0;

    // Convert to BRL first, then to target
    const inBRL = fromCurrency === 'BRL' ? value : value * fromCurrencyData.rate;
    const result = toCurrency === 'BRL' ? inBRL : inBRL / toCurrencyData.rate;
    return result;
  };

  const getExchangeRate = () => {
    if (!fromCurrencyData || !toCurrencyData) return 0;
    if (fromCurrency === 'BRL') {
      return 1 / toCurrencyData.rate;
    }
    if (toCurrency === 'BRL') {
      return fromCurrencyData.rate;
    }
    return fromCurrencyData.rate / toCurrencyData.rate;
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleExchange = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Digite um valor válido', 'error');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmExchange = () => {
    showToast(`Câmbio realizado com sucesso! ${formatCurrency(calculateExchange(), toCurrency)}`, 'success');
    setShowConfirmModal(false);
    setAmount('');
  };

  const formatCurrency = (value: number, code: string) => {
    const currency = currencies.find(c => c.code === code);
    if (code === 'BRL') {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return `${currency?.symbol || ''}${value.toFixed(2)}`;
  };

  const totalBalanceInBRL = currencies.reduce((acc, curr) => {
    return acc + (curr.balance * curr.rate);
  }, 0);

  return (
    <div className="cambio-page">
      <div className="cambio-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <h1>Conta Global</h1>
        <p>Câmbio e contas em moeda estrangeira</p>
      </div>

      <div className="total-balance-card">
        <span className="balance-label">Patrimônio Total (em BRL)</span>
        <span className="balance-value">{formatCurrency(totalBalanceInBRL, 'BRL')}</span>
        <div className="multi-currency">
          {currencies.filter(c => c.balance > 0).map(curr => (
            <div key={curr.code} className="currency-badge">
              <span className="flag">{curr.flag}</span>
              <span className="amount">{curr.symbol}{curr.balance.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'exchange' ? 'active' : ''}`}
          onClick={() => setActiveTab('exchange')}
        >
          Câmbio
        </button>
        <button
          className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Contas
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </button>
      </div>

      {activeTab === 'exchange' && (
        <div className="exchange-section">
          <div className="exchange-card">
            <div className="exchange-input">
              <label>De</label>
              <div className="input-row">
                <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              {fromCurrencyData && (
                <span className="available">
                  Disponível: {formatCurrency(fromCurrencyData.balance, fromCurrency)}
                </span>
              )}
            </div>

            <button className="btn-swap" onClick={swapCurrencies}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4M7 4L3 8M7 4l4 4"/>
                <path d="M17 8v12M17 20l4-4M17 20l-4-4"/>
              </svg>
            </button>

            <div className="exchange-input">
              <label>Para</label>
              <div className="input-row">
                <select value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code}
                    </option>
                  ))}
                </select>
                <div className="result-display">
                  {calculateExchange().toFixed(2)}
                </div>
              </div>
            </div>

            <div className="exchange-rate">
              <span className="rate-label">Taxa de câmbio</span>
              <span className="rate-value">
                1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
              </span>
            </div>

            <button className="btn-exchange" onClick={handleExchange}>
              Converter
            </button>
          </div>

          <div className="rates-card">
            <h3>Cotações do Dia</h3>
            <div className="rates-list">
              {currencies.filter(c => c.code !== 'BRL').map(curr => (
                <div key={curr.code} className="rate-item">
                  <div className="currency-info">
                    <span className="flag">{curr.flag}</span>
                    <div className="currency-details">
                      <span className="currency-code">{curr.code}</span>
                      <span className="currency-name">{curr.name}</span>
                    </div>
                  </div>
                  <div className="rate-values">
                    <span className="buy">Compra: R$ {curr.rate.toFixed(2)}</span>
                    <span className="sell">Venda: R$ {(curr.rate * 1.02).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="accounts-section">
          <h2>Suas Contas em Moeda Estrangeira</h2>
          <div className="accounts-list">
            {currencies.map(curr => (
              <div key={curr.code} className={`account-card ${curr.balance > 0 ? 'active' : ''}`}>
                <div className="account-info">
                  <span className="flag">{curr.flag}</span>
                  <div className="account-details">
                    <span className="currency-name">{curr.name}</span>
                    <span className="currency-code">{curr.code}</span>
                  </div>
                </div>
                <div className="account-balance">
                  <span className="balance">{curr.symbol}{curr.balance.toFixed(2)}</span>
                  <span className="balance-brl">≈ {formatCurrency(curr.balance * curr.rate, 'BRL')}</span>
                </div>
                <div className="account-actions">
                  {curr.balance > 0 ? (
                    <>
                      <button className="btn-action" onClick={() => {
                        setFromCurrency('BRL');
                        setToCurrency(curr.code);
                        setActiveTab('exchange');
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12l7-7 7 7"/>
                        </svg>
                        Adicionar
                      </button>
                      <button className="btn-action" onClick={() => {
                        setFromCurrency(curr.code);
                        setToCurrency('BRL');
                        setActiveTab('exchange');
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 19V5M5 12l7 7 7-7"/>
                        </svg>
                        Resgatar
                      </button>
                    </>
                  ) : (
                    <button className="btn-activate" onClick={() => {
                      setFromCurrency('BRL');
                      setToCurrency(curr.code);
                      setActiveTab('exchange');
                    }}>
                      Ativar Conta
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card-section">
            <h3>Cartão Internacional</h3>
            <div className="international-card">
              <div className="card-visual">
                <div className="card-brand">ATHENA</div>
                <div className="card-number">•••• •••• •••• 4589</div>
                <div className="card-info">
                  <div className="card-holder">
                    <span className="label">TITULAR</span>
                    <span className="value">USUARIO ATHENA</span>
                  </div>
                  <div className="card-valid">
                    <span className="label">VÁLIDO ATÉ</span>
                    <span className="value">12/28</span>
                  </div>
                </div>
                <div className="card-flag">VISA</div>
              </div>
              <div className="card-features">
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="M22 4 12 14.01l-3-3"/>
                  </svg>
                  <span>Aceito em mais de 200 países</span>
                </div>
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="M22 4 12 14.01l-3-3"/>
                  </svg>
                  <span>Sem anuidade</span>
                </div>
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="M22 4 12 14.01l-3-3"/>
                  </svg>
                  <span>Compras na moeda local</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="history-section">
          <h2>Histórico de Câmbio</h2>
          {history.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <p>Nenhuma operação de câmbio realizada</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map(item => {
                const fromCurr = currencies.find(c => c.code === item.from);
                const toCurr = currencies.find(c => c.code === item.to);
                return (
                  <div key={item.id} className="history-card">
                    <div className="exchange-visual">
                      <div className="from">
                        <span className="flag">{fromCurr?.flag}</span>
                        <span className="code">{item.from}</span>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      <div className="to">
                        <span className="flag">{toCurr?.flag}</span>
                        <span className="code">{item.to}</span>
                      </div>
                    </div>
                    <div className="exchange-amounts">
                      <span className="amount-from">
                        -{formatCurrency(item.amountFrom, item.from)}
                      </span>
                      <span className="amount-to">
                        +{formatCurrency(item.amountTo, item.to)}
                      </span>
                    </div>
                    <div className="exchange-meta">
                      <span className="rate">Taxa: {item.rate.toFixed(4)}</span>
                      <span className="date">{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmar Câmbio</h3>
              <button className="btn-close" onClick={() => setShowConfirmModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="confirm-exchange">
                <div className="exchange-summary">
                  <div className="from-amount">
                    <span className="flag">{fromCurrencyData?.flag}</span>
                    <span className="value">{formatCurrency(parseFloat(amount || '0'), fromCurrency)}</span>
                  </div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                  <div className="to-amount">
                    <span className="flag">{toCurrencyData?.flag}</span>
                    <span className="value">{formatCurrency(calculateExchange(), toCurrency)}</span>
                  </div>
                </div>
                <div className="exchange-details">
                  <div className="detail-row">
                    <span className="label">Taxa de câmbio</span>
                    <span className="value">1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">IOF (1.1%)</span>
                    <span className="value">{formatCurrency(parseFloat(amount || '0') * 0.011, fromCurrency)}</span>
                  </div>
                  <div className="detail-row total">
                    <span className="label">Você receberá</span>
                    <span className="value">{formatCurrency(calculateExchange(), toCurrency)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={confirmExchange}>
                Confirmar Câmbio
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cambio-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .cambio-header {
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

        .cambio-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .cambio-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .total-balance-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #252525 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }

        .balance-label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .balance-value {
          color: #C9A227;
          font-size: 32px;
          font-weight: 700;
          display: block;
          margin-bottom: 16px;
        }

        .multi-currency {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .currency-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #252525;
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid #333;
        }

        .currency-badge .flag {
          font-size: 16px;
        }

        .currency-badge .amount {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
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

        h2, h3 {
          color: #fff;
          margin: 0 0 16px;
        }

        h2 {
          font-size: 18px;
        }

        h3 {
          font-size: 16px;
        }

        .exchange-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .exchange-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .exchange-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .exchange-input label {
          color: #888;
          font-size: 12px;
        }

        .input-row {
          display: flex;
          gap: 12px;
        }

        .input-row select {
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          min-width: 120px;
          cursor: pointer;
        }

        .input-row select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .input-row input {
          flex: 1;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 18px;
          text-align: right;
        }

        .input-row input:focus {
          border-color: #C9A227;
          outline: none;
        }

        .result-display {
          flex: 1;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #C9A227;
          font-size: 18px;
          text-align: right;
          font-weight: 600;
        }

        .available {
          color: #888;
          font-size: 12px;
        }

        .btn-swap {
          align-self: center;
          width: 48px;
          height: 48px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          color: #C9A227;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .btn-swap:hover {
          background: #333;
          border-color: #C9A227;
        }

        .exchange-rate {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: #252525;
          border-radius: 8px;
        }

        .rate-label {
          color: #888;
          font-size: 14px;
        }

        .rate-value {
          color: #C9A227;
          font-size: 14px;
          font-weight: 500;
        }

        .btn-exchange {
          padding: 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-exchange:hover {
          background: #D4AF37;
        }

        .rates-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .rates-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rate-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .rate-item:last-child {
          border-bottom: none;
        }

        .currency-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .currency-info .flag {
          font-size: 24px;
        }

        .currency-details {
          display: flex;
          flex-direction: column;
        }

        .currency-code {
          color: #fff;
          font-weight: 500;
        }

        .currency-name {
          color: #888;
          font-size: 12px;
        }

        .rate-values {
          display: flex;
          flex-direction: column;
          text-align: right;
          gap: 2px;
        }

        .rate-values .buy {
          color: #22C55E;
          font-size: 13px;
        }

        .rate-values .sell {
          color: #EF4444;
          font-size: 13px;
        }

        .accounts-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .accounts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .account-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          opacity: 0.6;
        }

        .account-card.active {
          opacity: 1;
          border-color: #C9A227;
        }

        @media (max-width: 640px) {
          .account-card {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }

        .account-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .account-info .flag {
          font-size: 32px;
        }

        .account-details {
          display: flex;
          flex-direction: column;
        }

        .account-details .currency-name {
          color: #fff;
          font-weight: 500;
          font-size: 14px;
        }

        .account-details .currency-code {
          color: #888;
          font-size: 12px;
        }

        .account-balance {
          text-align: right;
        }

        @media (max-width: 640px) {
          .account-balance {
            text-align: center;
          }
        }

        .account-balance .balance {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          display: block;
        }

        .account-balance .balance-brl {
          color: #888;
          font-size: 12px;
        }

        .account-actions {
          display: flex;
          gap: 8px;
        }

        @media (max-width: 640px) {
          .account-actions {
            justify-content: center;
          }
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-action:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-activate {
          padding: 10px 20px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-activate:hover {
          background: #D4AF37;
        }

        .card-section {
          margin-top: 24px;
        }

        .international-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
        }

        .card-visual {
          background: linear-gradient(135deg, #1A1A1A 0%, #333 100%);
          border: 1px solid #C9A227;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          position: relative;
        }

        .card-brand {
          color: #C9A227;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .card-number {
          color: #fff;
          font-size: 18px;
          letter-spacing: 4px;
          margin: 24px 0;
        }

        .card-info {
          display: flex;
          gap: 32px;
        }

        .card-holder, .card-valid {
          display: flex;
          flex-direction: column;
        }

        .card-holder .label, .card-valid .label {
          color: #888;
          font-size: 10px;
        }

        .card-holder .value, .card-valid .value {
          color: #fff;
          font-size: 12px;
        }

        .card-flag {
          position: absolute;
          bottom: 20px;
          right: 20px;
          color: #C9A227;
          font-size: 20px;
          font-weight: 700;
          font-style: italic;
        }

        .card-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #888;
          font-size: 14px;
        }

        .history-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #666;
        }

        .empty-state svg {
          margin-bottom: 16px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .exchange-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .exchange-visual .from,
        .exchange-visual .to {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .exchange-visual .flag {
          font-size: 24px;
        }

        .exchange-visual .code {
          color: #fff;
          font-weight: 500;
        }

        .exchange-amounts {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .amount-from {
          color: #EF4444;
        }

        .amount-to {
          color: #22C55E;
        }

        .exchange-meta {
          display: flex;
          justify-content: space-between;
          color: #888;
          font-size: 12px;
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
          max-height: 90vh;
          overflow-y: auto;
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
          padding: 4px;
        }

        .btn-close:hover {
          color: #fff;
        }

        .modal-content {
          padding: 20px;
        }

        .confirm-exchange {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .exchange-summary {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: #252525;
          border-radius: 12px;
        }

        .from-amount,
        .to-amount {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .from-amount .flag,
        .to-amount .flag {
          font-size: 32px;
        }

        .from-amount .value {
          color: #EF4444;
          font-size: 24px;
          font-weight: 600;
        }

        .to-amount .value {
          color: #22C55E;
          font-size: 24px;
          font-weight: 600;
        }

        .exchange-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #252525;
        }

        .detail-row.total {
          border-bottom: none;
          padding-top: 12px;
          border-top: 1px solid #333;
        }

        .detail-row .label {
          color: #888;
          font-size: 14px;
        }

        .detail-row .value {
          color: #fff;
          font-size: 14px;
        }

        .detail-row.total .value {
          color: #C9A227;
          font-weight: 600;
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
          transition: all 0.3s;
        }

        .btn-cancel:hover {
          border-color: #888;
          color: #fff;
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
          transition: all 0.3s;
        }

        .btn-confirm:hover {
          background: #D4AF37;
        }
      `}</style>
    </div>
  );
};

export default Cambio;
