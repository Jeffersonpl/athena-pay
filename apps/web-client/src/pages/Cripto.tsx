import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  balance: number;
  icon: string;
  color: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'receive' | 'send';
  crypto: string;
  amount: number;
  price: number;
  date: string;
}

interface PriceAlert {
  id: string;
  crypto: string;
  targetPrice: number;
  type: 'above' | 'below';
  active: boolean;
}

const Cripto: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'market' | 'history' | 'alerts'>('portfolio');
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertCrypto, setAlertCrypto] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');

  const [cryptos] = useState<Crypto[]>([
    { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 352450.00, change24h: 2.34, balance: 0.0523, icon: '₿', color: '#F7931A' },
    { id: '2', symbol: 'ETH', name: 'Ethereum', price: 18750.00, change24h: -1.23, balance: 0.85, icon: 'Ξ', color: '#627EEA' },
    { id: '3', symbol: 'SOL', name: 'Solana', price: 892.50, change24h: 5.67, balance: 12.5, icon: '◎', color: '#00FFA3' },
    { id: '4', symbol: 'ADA', name: 'Cardano', price: 3.85, change24h: -0.45, balance: 500, icon: '₳', color: '#0033AD' },
    { id: '5', symbol: 'DOT', name: 'Polkadot', price: 42.30, change24h: 1.89, balance: 25, icon: '●', color: '#E6007A' },
    { id: '6', symbol: 'MATIC', name: 'Polygon', price: 5.12, change24h: 3.21, balance: 200, icon: '⬡', color: '#8247E5' },
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'buy', crypto: 'BTC', amount: 0.01, price: 350000, date: '2024-01-15' },
    { id: '2', type: 'sell', crypto: 'ETH', amount: 0.5, price: 19000, date: '2024-01-14' },
    { id: '3', type: 'buy', crypto: 'SOL', amount: 10, price: 850, date: '2024-01-13' },
    { id: '4', type: 'receive', crypto: 'BTC', amount: 0.005, price: 345000, date: '2024-01-12' },
    { id: '5', type: 'buy', crypto: 'ADA', amount: 200, price: 3.50, date: '2024-01-11' },
  ]);

  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: '1', crypto: 'BTC', targetPrice: 400000, type: 'above', active: true },
    { id: '2', crypto: 'ETH', targetPrice: 15000, type: 'below', active: true },
  ]);

  const totalBalance = cryptos.reduce((acc, crypto) => acc + (crypto.balance * crypto.price), 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatCrypto = (value: number, decimals: number = 8) => {
    return value.toFixed(decimals);
  };

  const handleTrade = () => {
    if (!selectedCrypto || !tradeAmount) {
      showToast('Preencha todos os campos', 'error');
      return;
    }
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Valor inválido', 'error');
      return;
    }
    showToast(
      `${tradeType === 'buy' ? 'Compra' : 'Venda'} de ${amount} ${selectedCrypto.symbol} realizada com sucesso!`,
      'success'
    );
    setShowTradeModal(false);
    setTradeAmount('');
    setSelectedCrypto(null);
  };

  const handleCreateAlert = () => {
    if (!alertCrypto || !alertPrice) {
      showToast('Preencha todos os campos', 'error');
      return;
    }
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      crypto: alertCrypto,
      targetPrice: parseFloat(alertPrice),
      type: alertType,
      active: true,
    };
    setAlerts([...alerts, newAlert]);
    showToast('Alerta criado com sucesso!', 'success');
    setShowAlertModal(false);
    setAlertCrypto('');
    setAlertPrice('');
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
    showToast('Alerta atualizado', 'info');
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    showToast('Alerta removido', 'info');
  };

  const openTradeModal = (crypto: Crypto, type: 'buy' | 'sell') => {
    setSelectedCrypto(crypto);
    setTradeType(type);
    setShowTradeModal(true);
  };

  return (
    <div className="cripto-page">
      <div className="cripto-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.5 9.5c0-1 1-2 2.5-2s2.5 1 2.5 2-1 1.5-2.5 2-2.5 1-2.5 2 1 2 2.5 2 2.5-1 2.5-2"/>
            <path d="M12 6v2m0 8v2"/>
          </svg>
        </div>
        <h1>Athena Cripto</h1>
        <p>Compre, venda e acompanhe suas criptomoedas</p>
      </div>

      <div className="total-balance-card">
        <span className="balance-label">Patrimônio em Cripto</span>
        <span className="balance-value">{formatCurrency(totalBalance)}</span>
        <div className="balance-change positive">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
          +R$ 1.234,56 (2.34%) hoje
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Carteira
        </button>
        <button
          className={`tab ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          Mercado
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </button>
        <button
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alertas
        </button>
      </div>

      {activeTab === 'portfolio' && (
        <div className="portfolio-section">
          <h2>Suas Criptomoedas</h2>
          <div className="crypto-list">
            {cryptos.filter(c => c.balance > 0).map(crypto => (
              <div key={crypto.id} className="crypto-card">
                <div className="crypto-info">
                  <div className="crypto-icon" style={{ backgroundColor: `${crypto.color}20`, color: crypto.color }}>
                    {crypto.icon}
                  </div>
                  <div className="crypto-details">
                    <span className="crypto-name">{crypto.name}</span>
                    <span className="crypto-symbol">{crypto.symbol}</span>
                  </div>
                </div>
                <div className="crypto-price">
                  <span className="price">{formatCurrency(crypto.price)}</span>
                  <span className={`change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="crypto-balance">
                  <span className="balance-crypto">{formatCrypto(crypto.balance, 4)} {crypto.symbol}</span>
                  <span className="balance-fiat">{formatCurrency(crypto.balance * crypto.price)}</span>
                </div>
                <div className="crypto-actions">
                  <button className="btn-trade buy" onClick={() => openTradeModal(crypto, 'buy')}>
                    Comprar
                  </button>
                  <button className="btn-trade sell" onClick={() => openTradeModal(crypto, 'sell')}>
                    Vender
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'market' && (
        <div className="market-section">
          <h2>Mercado de Criptomoedas</h2>
          <div className="market-list">
            {cryptos.map(crypto => (
              <div key={crypto.id} className="market-card">
                <div className="market-info">
                  <div className="crypto-icon" style={{ backgroundColor: `${crypto.color}20`, color: crypto.color }}>
                    {crypto.icon}
                  </div>
                  <div className="crypto-details">
                    <span className="crypto-name">{crypto.name}</span>
                    <span className="crypto-symbol">{crypto.symbol}</span>
                  </div>
                </div>
                <div className="price-chart">
                  <svg viewBox="0 0 100 40" className={crypto.change24h >= 0 ? 'positive' : 'negative'}>
                    <path
                      d={crypto.change24h >= 0
                        ? "M0,35 L15,30 L30,32 L45,25 L60,20 L75,15 L90,10 L100,5"
                        : "M0,10 L15,15 L30,12 L45,20 L60,25 L75,28 L90,32 L100,35"
                      }
                      fill="none"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="market-price">
                  <span className="price">{formatCurrency(crypto.price)}</span>
                  <span className={`change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                  </span>
                </div>
                <button className="btn-buy-market" onClick={() => openTradeModal(crypto, 'buy')}>
                  Comprar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="history-section">
          <h2>Histórico de Transações</h2>
          <div className="transactions-list">
            {transactions.map(tx => {
              const crypto = cryptos.find(c => c.symbol === tx.crypto);
              return (
                <div key={tx.id} className="transaction-card">
                  <div className={`tx-icon ${tx.type}`}>
                    {tx.type === 'buy' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                      </svg>
                    )}
                    {tx.type === 'sell' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7"/>
                      </svg>
                    )}
                    {tx.type === 'receive' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18M12 3l9 9-9 9"/>
                      </svg>
                    )}
                    {tx.type === 'send' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12H3M12 3L3 12l9 9"/>
                      </svg>
                    )}
                  </div>
                  <div className="tx-info">
                    <span className="tx-type">
                      {tx.type === 'buy' && 'Compra'}
                      {tx.type === 'sell' && 'Venda'}
                      {tx.type === 'receive' && 'Recebido'}
                      {tx.type === 'send' && 'Enviado'}
                    </span>
                    <span className="tx-crypto">{tx.amount} {tx.crypto}</span>
                  </div>
                  <div className="tx-details">
                    <span className="tx-value">{formatCurrency(tx.amount * tx.price)}</span>
                    <span className="tx-date">{new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="alerts-section">
          <div className="alerts-header">
            <h2>Alertas de Preço</h2>
            <button className="btn-add-alert" onClick={() => setShowAlertModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Novo Alerta
            </button>
          </div>
          {alerts.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <p>Nenhum alerta configurado</p>
            </div>
          ) : (
            <div className="alerts-list">
              {alerts.map(alert => {
                const crypto = cryptos.find(c => c.symbol === alert.crypto);
                return (
                  <div key={alert.id} className={`alert-card ${!alert.active ? 'inactive' : ''}`}>
                    <div className="alert-info">
                      <div className="alert-crypto">
                        <span className="crypto-symbol">{alert.crypto}</span>
                        <span className="alert-condition">
                          {alert.type === 'above' ? 'Acima de' : 'Abaixo de'} {formatCurrency(alert.targetPrice)}
                        </span>
                      </div>
                      {crypto && (
                        <span className="current-price">
                          Atual: {formatCurrency(crypto.price)}
                        </span>
                      )}
                    </div>
                    <div className="alert-actions">
                      <button
                        className={`btn-toggle ${alert.active ? 'active' : ''}`}
                        onClick={() => toggleAlert(alert.id)}
                      >
                        {alert.active ? 'Ativo' : 'Inativo'}
                      </button>
                      <button className="btn-delete" onClick={() => deleteAlert(alert.id)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showTradeModal && selectedCrypto && (
        <div className="modal-overlay" onClick={() => setShowTradeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{tradeType === 'buy' ? 'Comprar' : 'Vender'} {selectedCrypto.name}</h3>
              <button className="btn-close" onClick={() => setShowTradeModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="trade-info">
                <div className="crypto-icon" style={{ backgroundColor: `${selectedCrypto.color}20`, color: selectedCrypto.color }}>
                  {selectedCrypto.icon}
                </div>
                <div className="crypto-details">
                  <span className="crypto-name">{selectedCrypto.name}</span>
                  <span className="crypto-price">{formatCurrency(selectedCrypto.price)}</span>
                </div>
              </div>

              <div className="trade-tabs">
                <button
                  className={`trade-tab ${tradeType === 'buy' ? 'active' : ''}`}
                  onClick={() => setTradeType('buy')}
                >
                  Comprar
                </button>
                <button
                  className={`trade-tab ${tradeType === 'sell' ? 'active' : ''}`}
                  onClick={() => setTradeType('sell')}
                >
                  Vender
                </button>
              </div>

              <div className="form-group">
                <label>Quantidade ({selectedCrypto.symbol})</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={e => setTradeAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.0001"
                />
                {tradeAmount && (
                  <span className="estimated-value">
                    ≈ {formatCurrency(parseFloat(tradeAmount || '0') * selectedCrypto.price)}
                  </span>
                )}
              </div>

              <div className="quick-amounts">
                <button onClick={() => setTradeAmount('0.001')}>0.001</button>
                <button onClick={() => setTradeAmount('0.01')}>0.01</button>
                <button onClick={() => setTradeAmount('0.1')}>0.1</button>
                {tradeType === 'sell' && (
                  <button onClick={() => setTradeAmount(selectedCrypto.balance.toString())}>MAX</button>
                )}
              </div>

              {tradeType === 'sell' && (
                <div className="available-balance">
                  Disponível: {formatCrypto(selectedCrypto.balance, 4)} {selectedCrypto.symbol}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowTradeModal(false)}>
                Cancelar
              </button>
              <button
                className={`btn-confirm ${tradeType}`}
                onClick={handleTrade}
              >
                {tradeType === 'buy' ? 'Confirmar Compra' : 'Confirmar Venda'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Criar Alerta de Preço</h3>
              <button className="btn-close" onClick={() => setShowAlertModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Criptomoeda</label>
                <select value={alertCrypto} onChange={e => setAlertCrypto(e.target.value)}>
                  <option value="">Selecione...</option>
                  {cryptos.map(crypto => (
                    <option key={crypto.id} value={crypto.symbol}>
                      {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Condição</label>
                <div className="alert-type-buttons">
                  <button
                    className={`type-btn ${alertType === 'above' ? 'active' : ''}`}
                    onClick={() => setAlertType('above')}
                  >
                    Acima de
                  </button>
                  <button
                    className={`type-btn ${alertType === 'below' ? 'active' : ''}`}
                    onClick={() => setAlertType('below')}
                  >
                    Abaixo de
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Preço Alvo (R$)</label>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={e => setAlertPrice(e.target.value)}
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAlertModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleCreateAlert}>
                Criar Alerta
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cripto-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .cripto-header {
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

        .cripto-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .cripto-header p {
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
          font-size: 36px;
          font-weight: 700;
          display: block;
          margin-bottom: 8px;
        }

        .balance-change {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
        }

        .balance-change.positive {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .balance-change.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
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

        h2 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 16px;
        }

        .crypto-list, .market-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .crypto-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 16px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .crypto-card {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
          }
          .crypto-actions {
            grid-column: 1 / -1;
          }
        }

        .crypto-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .crypto-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
        }

        .crypto-details {
          display: flex;
          flex-direction: column;
        }

        .crypto-name {
          color: #fff;
          font-weight: 500;
        }

        .crypto-symbol {
          color: #888;
          font-size: 12px;
        }

        .crypto-price {
          text-align: right;
        }

        .price {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .change {
          font-size: 12px;
          display: block;
        }

        .change.positive {
          color: #22C55E;
        }

        .change.negative {
          color: #EF4444;
        }

        .crypto-balance {
          text-align: right;
        }

        .balance-crypto {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .balance-fiat {
          color: #888;
          font-size: 12px;
          display: block;
        }

        .crypto-actions {
          display: flex;
          gap: 8px;
        }

        .btn-trade {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-trade.buy {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
          border: 1px solid #22C55E;
        }

        .btn-trade.buy:hover {
          background: #22C55E;
          color: #000;
        }

        .btn-trade.sell {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid #EF4444;
        }

        .btn-trade.sell:hover {
          background: #EF4444;
          color: #fff;
        }

        .market-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: 1fr 100px 1fr auto;
          gap: 16px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .market-card {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
          }
          .price-chart {
            display: none;
          }
          .btn-buy-market {
            grid-column: 1 / -1;
          }
        }

        .market-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .price-chart svg {
          width: 100%;
          height: 40px;
        }

        .price-chart svg.positive path {
          stroke: #22C55E;
        }

        .price-chart svg.negative path {
          stroke: #EF4444;
        }

        .market-price {
          text-align: right;
        }

        .btn-buy-market {
          padding: 10px 20px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-buy-market:hover {
          background: #D4AF37;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .transaction-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .tx-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tx-icon.buy {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .tx-icon.sell {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .tx-icon.receive {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
        }

        .tx-icon.send {
          background: rgba(168, 85, 247, 0.1);
          color: #A855F7;
        }

        .tx-info {
          flex: 1;
        }

        .tx-type {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .tx-crypto {
          color: #888;
          font-size: 12px;
        }

        .tx-details {
          text-align: right;
        }

        .tx-value {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .tx-date {
          color: #888;
          font-size: 12px;
        }

        .alerts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .alerts-header h2 {
          margin: 0;
        }

        .btn-add-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #C9A227;
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-add-alert:hover {
          background: #D4AF37;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #666;
        }

        .empty-state svg {
          margin-bottom: 16px;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .alert-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-card.inactive {
          opacity: 0.5;
        }

        .alert-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .alert-crypto {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alert-crypto .crypto-symbol {
          background: #333;
          padding: 4px 8px;
          border-radius: 4px;
          color: #C9A227;
          font-weight: 600;
          font-size: 12px;
        }

        .alert-condition {
          color: #fff;
          font-size: 14px;
        }

        .current-price {
          color: #888;
          font-size: 12px;
        }

        .alert-actions {
          display: flex;
          gap: 8px;
        }

        .btn-toggle {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          border: 1px solid #333;
          background: transparent;
          color: #888;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-toggle.active {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22C55E;
          color: #22C55E;
        }

        .btn-delete {
          padding: 6px;
          border: none;
          background: transparent;
          color: #888;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-delete:hover {
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

        .trade-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px;
          background: #252525;
          border-radius: 12px;
        }

        .trade-info .crypto-details {
          display: flex;
          flex-direction: column;
        }

        .trade-info .crypto-name {
          color: #fff;
          font-weight: 500;
        }

        .trade-info .crypto-price {
          color: #C9A227;
          font-size: 18px;
          font-weight: 600;
        }

        .trade-tabs {
          display: flex;
          background: #252525;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 20px;
        }

        .trade-tab {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          color: #888;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .trade-tab.active {
          background: #C9A227;
          color: #000;
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
          font-size: 16px;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #C9A227;
          outline: none;
        }

        .estimated-value {
          display: block;
          color: #C9A227;
          font-size: 14px;
          margin-top: 8px;
        }

        .quick-amounts {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .quick-amounts button {
          flex: 1;
          padding: 8px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-amounts button:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .available-balance {
          color: #888;
          font-size: 12px;
          text-align: center;
        }

        .alert-type-buttons {
          display: flex;
          gap: 8px;
        }

        .type-btn {
          flex: 1;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .type-btn.active {
          border-color: #C9A227;
          color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
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

        .btn-confirm.buy {
          background: #22C55E;
        }

        .btn-confirm.buy:hover {
          background: #16A34A;
        }

        .btn-confirm.sell {
          background: #EF4444;
          color: #fff;
        }

        .btn-confirm.sell:hover {
          background: #DC2626;
        }
      `}</style>
    </div>
  );
};

export default Cripto;
