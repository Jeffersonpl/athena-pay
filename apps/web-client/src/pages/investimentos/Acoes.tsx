import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../ui/Toast';

interface Stock {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
}

interface ETF {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: string;
}

interface Position {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  profit: number;
  profitPercent: number;
}

const Acoes: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'stocks' | 'etfs' | 'portfolio'>('portfolio');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Stock | ETF | null>(null);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const stocks: Stock[] = [
    { id: '1', ticker: 'PETR4', name: 'Petrobras PN', price: 38.45, change: 0.82, changePercent: 2.18, volume: 45000000, marketCap: 520000000000, sector: 'Energia' },
    { id: '2', ticker: 'VALE3', name: 'Vale ON', price: 68.90, change: -1.23, changePercent: -1.75, volume: 32000000, marketCap: 310000000000, sector: 'Mineração' },
    { id: '3', ticker: 'ITUB4', name: 'Itaú Unibanco PN', price: 32.15, change: 0.45, changePercent: 1.42, volume: 28000000, marketCap: 280000000000, sector: 'Financeiro' },
    { id: '4', ticker: 'BBDC4', name: 'Bradesco PN', price: 14.82, change: -0.18, changePercent: -1.20, volume: 22000000, marketCap: 145000000000, sector: 'Financeiro' },
    { id: '5', ticker: 'ABEV3', name: 'Ambev ON', price: 12.45, change: 0.12, changePercent: 0.97, volume: 18000000, marketCap: 195000000000, sector: 'Consumo' },
    { id: '6', ticker: 'WEGE3', name: 'WEG ON', price: 42.80, change: 1.05, changePercent: 2.52, volume: 8000000, marketCap: 180000000000, sector: 'Indústria' },
    { id: '7', ticker: 'MGLU3', name: 'Magazine Luiza ON', price: 2.15, change: -0.08, changePercent: -3.59, volume: 65000000, marketCap: 14000000000, sector: 'Varejo' },
    { id: '8', ticker: 'B3SA3', name: 'B3 ON', price: 12.35, change: 0.22, changePercent: 1.81, volume: 15000000, marketCap: 68000000000, sector: 'Financeiro' },
  ];

  const etfs: ETF[] = [
    { id: '1', ticker: 'BOVA11', name: 'iShares Ibovespa', price: 112.45, change: 1.25, changePercent: 1.12, type: 'Índice Brasil' },
    { id: '2', ticker: 'IVVB11', name: 'iShares S&P 500', price: 285.30, change: 2.80, changePercent: 0.99, type: 'Índice EUA' },
    { id: '3', ticker: 'HASH11', name: 'Hashdex Nasdaq Crypto', price: 45.20, change: -1.50, changePercent: -3.21, type: 'Cripto' },
    { id: '4', ticker: 'SMAL11', name: 'iShares Small Cap', price: 98.75, change: 0.85, changePercent: 0.87, type: 'Small Caps' },
    { id: '5', ticker: 'DIVO11', name: 'It Now Dividendos', price: 78.40, change: 0.65, changePercent: 0.84, type: 'Dividendos' },
    { id: '6', ticker: 'GOLD11', name: 'Trend Ouro', price: 12.85, change: 0.15, changePercent: 1.18, type: 'Ouro' },
  ];

  const positions: Position[] = [
    { id: '1', ticker: 'PETR4', name: 'Petrobras PN', quantity: 100, avgPrice: 35.50, currentPrice: 38.45, totalValue: 3845, profit: 295, profitPercent: 8.31 },
    { id: '2', ticker: 'ITUB4', name: 'Itaú Unibanco PN', quantity: 200, avgPrice: 30.20, currentPrice: 32.15, totalValue: 6430, profit: 390, profitPercent: 6.46 },
    { id: '3', ticker: 'BOVA11', name: 'iShares Ibovespa', quantity: 50, avgPrice: 108.00, currentPrice: 112.45, totalValue: 5622.50, profit: 222.50, profitPercent: 4.12 },
    { id: '4', ticker: 'WEGE3', name: 'WEG ON', quantity: 80, avgPrice: 45.00, currentPrice: 42.80, totalValue: 3424, profit: -176, profitPercent: -4.89 },
  ];

  const totalPortfolio = positions.reduce((acc, p) => acc + p.totalValue, 0);
  const totalProfit = positions.reduce((acc, p) => acc + p.profit, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatVolume = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1000000000000) return `R$ ${(value / 1000000000000).toFixed(1)} tri`;
    if (value >= 1000000000) return `R$ ${(value / 1000000000).toFixed(0)} bi`;
    return formatCurrency(value);
  };

  const handleOrder = () => {
    if (!selectedAsset || !quantity) {
      showToast('Preencha a quantidade', 'error');
      return;
    }
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      showToast('Quantidade inválida', 'error');
      return;
    }
    const ticker = 'ticker' in selectedAsset ? selectedAsset.ticker : '';
    showToast(`Ordem de ${orderType === 'buy' ? 'compra' : 'venda'} de ${qty} ${ticker} enviada!`, 'success');
    setShowOrderModal(false);
    setQuantity('');
    setSelectedAsset(null);
  };

  const filteredStocks = stocks.filter(s =>
    s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredETFs = etfs.filter(e =>
    e.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="acoes-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/investimentos')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-content">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          </div>
          <div>
            <h1>Ações e ETFs</h1>
            <p>Invista na bolsa de valores</p>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="portfolio-summary">
        <div className="summary-card">
          <span className="label">Carteira de ações</span>
          <span className="value">{formatCurrency(totalPortfolio)}</span>
          <div className="yield-info">
            <span className={`yield ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
              {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
            </span>
            <span className="percent">({((totalProfit / (totalPortfolio - totalProfit)) * 100).toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
          Carteira
        </button>
        <button className={`tab ${activeTab === 'stocks' ? 'active' : ''}`} onClick={() => setActiveTab('stocks')}>
          Ações
        </button>
        <button className={`tab ${activeTab === 'etfs' ? 'active' : ''}`} onClick={() => setActiveTab('etfs')}>
          ETFs
        </button>
      </div>

      {/* Search */}
      {(activeTab === 'stocks' || activeTab === 'etfs') && (
        <div className="search-container">
          <div className="search-input">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por ticker ou nome..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="positions-list">
          <h3>Minhas posições</h3>
          {positions.map(pos => (
            <div key={pos.id} className="position-card">
              <div className="position-header">
                <div className="ticker-info">
                  <span className="ticker">{pos.ticker}</span>
                  <span className="name">{pos.name}</span>
                </div>
                <span className={`profit ${pos.profit >= 0 ? 'positive' : 'negative'}`}>
                  {pos.profit >= 0 ? '+' : ''}{pos.profitPercent.toFixed(2)}%
                </span>
              </div>
              <div className="position-details">
                <div className="detail">
                  <span className="label">Quantidade</span>
                  <span className="value">{pos.quantity}</span>
                </div>
                <div className="detail">
                  <span className="label">Preço médio</span>
                  <span className="value">{formatCurrency(pos.avgPrice)}</span>
                </div>
                <div className="detail">
                  <span className="label">Cotação</span>
                  <span className="value">{formatCurrency(pos.currentPrice)}</span>
                </div>
                <div className="detail">
                  <span className="label">Total</span>
                  <span className="value highlight">{formatCurrency(pos.totalValue)}</span>
                </div>
              </div>
              <div className="position-actions">
                <button onClick={() => { setSelectedAsset({ ...pos, price: pos.currentPrice, change: 0, changePercent: 0 } as any); setOrderType('buy'); setShowOrderModal(true); }}>Comprar</button>
                <button className="sell" onClick={() => { setSelectedAsset({ ...pos, price: pos.currentPrice, change: 0, changePercent: 0 } as any); setOrderType('sell'); setShowOrderModal(true); }}>Vender</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stocks List */}
      {activeTab === 'stocks' && (
        <div className="assets-list">
          {filteredStocks.map(stock => (
            <div key={stock.id} className="asset-card" onClick={() => { setSelectedAsset(stock); setOrderType('buy'); setShowOrderModal(true); }}>
              <div className="asset-main">
                <div className="ticker-info">
                  <span className="ticker">{stock.ticker}</span>
                  <span className="name">{stock.name}</span>
                </div>
                <div className="price-info">
                  <span className="price">{formatCurrency(stock.price)}</span>
                  <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="asset-details">
                <div className="detail">
                  <span className="label">Volume</span>
                  <span className="value">{formatVolume(stock.volume)}</span>
                </div>
                <div className="detail">
                  <span className="label">Market Cap</span>
                  <span className="value">{formatMarketCap(stock.marketCap)}</span>
                </div>
                <div className="detail">
                  <span className="label">Setor</span>
                  <span className="value">{stock.sector}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ETFs List */}
      {activeTab === 'etfs' && (
        <div className="assets-list">
          {filteredETFs.map(etf => (
            <div key={etf.id} className="asset-card" onClick={() => { setSelectedAsset(etf); setOrderType('buy'); setShowOrderModal(true); }}>
              <div className="asset-main">
                <div className="ticker-info">
                  <span className="ticker">{etf.ticker}</span>
                  <span className="name">{etf.name}</span>
                </div>
                <div className="price-info">
                  <span className="price">{formatCurrency(etf.price)}</span>
                  <span className={`change ${etf.change >= 0 ? 'positive' : 'negative'}`}>
                    {etf.change >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="asset-type">
                <span className="etf-badge">{etf.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedAsset && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{orderType === 'buy' ? 'Comprar' : 'Vender'}</h2>
              <button className="close-btn" onClick={() => setShowOrderModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="selected-asset">
                <span className="ticker">{'ticker' in selectedAsset ? selectedAsset.ticker : ''}</span>
                <span className="name">{'name' in selectedAsset ? selectedAsset.name : ''}</span>
                <span className="price">{formatCurrency(selectedAsset.price)}</span>
              </div>

              <div className="order-type-toggle">
                <button className={`toggle-btn ${orderType === 'buy' ? 'active buy' : ''}`} onClick={() => setOrderType('buy')}>Comprar</button>
                <button className={`toggle-btn ${orderType === 'sell' ? 'active sell' : ''}`} onClick={() => setOrderType('sell')}>Vender</button>
              </div>

              <div className="order-form">
                <label>Quantidade</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="0"
                  min="1"
                />
                {quantity && (
                  <div className="order-total">
                    <span>Total estimado:</span>
                    <span className="total-value">{formatCurrency(parseInt(quantity || '0') * selectedAsset.price)}</span>
                  </div>
                )}
              </div>

              <button className={`order-btn ${orderType}`} onClick={handleOrder}>
                {orderType === 'buy' ? 'Confirmar compra' : 'Confirmar venda'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .acoes-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          border-bottom: 1px solid #262626;
        }

        .back-btn {
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: none;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
        }

        .header-content { display: flex; align-items: center; gap: 12px; }

        .header-icon {
          width: 48px; height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 14px;
          color: #EF4444;
        }

        .header-content h1 { font-size: 18px; font-weight: 700; color: #fff; margin: 0; }
        .header-content p { font-size: 13px; color: #A3A3A3; margin: 0; }

        .portfolio-summary { padding: 20px; }
        .summary-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 20px;
        }
        .summary-card .label { font-size: 13px; color: #A3A3A3; }
        .summary-card .value { display: block; font-size: 28px; font-weight: 700; color: #fff; margin: 4px 0; }
        .yield-info { display: flex; align-items: center; gap: 8px; }
        .yield-info .yield { font-size: 14px; font-weight: 600; }
        .yield-info .yield.positive { color: #22C55E; }
        .yield-info .yield.negative { color: #EF4444; }
        .yield-info .percent { font-size: 13px; color: #A3A3A3; }

        .tabs-container { display: flex; gap: 8px; padding: 0 20px; margin-bottom: 16px; }
        .tab {
          flex: 1;
          padding: 12px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          color: #A3A3A3;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .tab.active { background: rgba(239, 68, 68, 0.15); border-color: #EF4444; color: #EF4444; }

        .search-container { padding: 0 20px 16px; }
        .search-input {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          color: #666;
        }
        .search-input input {
          flex: 1;
          background: none;
          border: none;
          font-size: 14px;
          color: #fff;
          outline: none;
        }
        .search-input input::placeholder { color: #666; }

        .positions-list, .assets-list { padding: 0 20px; }
        .positions-list h3 { font-size: 16px; font-weight: 600; color: #fff; margin: 0 0 16px; }

        .position-card, .asset-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .position-card:hover, .asset-card:hover { border-color: #EF4444; }

        .position-header, .asset-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .ticker-info { display: flex; flex-direction: column; gap: 2px; }
        .ticker { font-size: 16px; font-weight: 700; color: #fff; }
        .name { font-size: 13px; color: #666; }

        .profit, .change { font-size: 14px; font-weight: 600; padding: 4px 10px; border-radius: 8px; }
        .profit.positive, .change.positive { background: rgba(34, 197, 94, 0.15); color: #22C55E; }
        .profit.negative, .change.negative { background: rgba(239, 68, 68, 0.15); color: #EF4444; }

        .price-info { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .price { font-size: 16px; font-weight: 600; color: #fff; }

        .position-details, .asset-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #333;
          border-bottom: 1px solid #333;
        }
        .detail { display: flex; flex-direction: column; gap: 2px; }
        .detail .label { font-size: 11px; color: #666; }
        .detail .value { font-size: 13px; color: #fff; font-weight: 500; }
        .detail .value.highlight { color: #EF4444; }

        .asset-type { padding-top: 12px; }
        .etf-badge {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #8B5CF6;
        }

        .position-actions { display: flex; gap: 12px; margin-top: 12px; }
        .position-actions button {
          flex: 1;
          padding: 10px;
          background: #22C55E;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
        }
        .position-actions button.sell { background: #EF4444; }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: flex-end;
          z-index: 1000;
        }
        .modal-content {
          width: 100%;
          max-height: 90vh;
          background: #1A1A1A;
          border-radius: 24px 24px 0 0;
          overflow: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }
        .modal-header h2 { font-size: 18px; font-weight: 600; color: #fff; margin: 0; }
        .close-btn {
          width: 36px; height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: none;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
        }
        .modal-body { padding: 20px; }

        .selected-asset {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 20px;
          background: #262626;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .selected-asset .ticker { font-size: 24px; font-weight: 700; color: #fff; }
        .selected-asset .name { font-size: 14px; color: #666; }
        .selected-asset .price { font-size: 20px; font-weight: 600; color: #C9A227; margin-top: 8px; }

        .order-type-toggle { display: flex; gap: 8px; margin-bottom: 20px; }
        .toggle-btn {
          flex: 1;
          padding: 12px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #A3A3A3;
          cursor: pointer;
        }
        .toggle-btn.active.buy { background: rgba(34, 197, 94, 0.15); border-color: #22C55E; color: #22C55E; }
        .toggle-btn.active.sell { background: rgba(239, 68, 68, 0.15); border-color: #EF4444; color: #EF4444; }

        .order-form { margin-bottom: 20px; }
        .order-form label { display: block; font-size: 14px; color: #A3A3A3; margin-bottom: 8px; }
        .order-form input {
          width: 100%;
          padding: 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          text-align: center;
          outline: none;
        }

        .order-total {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          background: #262626;
          border-radius: 12px;
          margin-top: 12px;
        }
        .order-total span { font-size: 14px; color: #A3A3A3; }
        .order-total .total-value { font-size: 16px; font-weight: 600; color: #fff; }

        .order-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
        }
        .order-btn.buy { background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); }
        .order-btn.sell { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); }

        @media (max-width: 480px) {
          .position-details, .asset-details { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default Acoes;
