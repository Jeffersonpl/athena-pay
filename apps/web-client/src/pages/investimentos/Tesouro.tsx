import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../ui/Toast';

interface TesouroBond {
  id: string;
  name: string;
  type: 'Selic' | 'IPCA+' | 'Prefixado';
  maturity: string;
  rate: string;
  minValue: number;
  unitPrice: number;
  rentability30d: number;
  liquidity: string;
}

interface MyBond {
  id: string;
  name: string;
  type: 'Selic' | 'IPCA+' | 'Prefixado';
  maturity: string;
  invested: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  quantity: number;
}

const Tesouro: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'invest' | 'my-bonds'>('invest');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedBond, setSelectedBond] = useState<TesouroBond | null>(null);
  const [investAmount, setInvestAmount] = useState('');

  const bonds: TesouroBond[] = [
    { id: '1', name: 'Tesouro Selic 2027', type: 'Selic', maturity: '01/03/2027', rate: 'Selic + 0.1618%', minValue: 155.38, unitPrice: 15538.24, rentability30d: 0.92, liquidity: 'D+1' },
    { id: '2', name: 'Tesouro Selic 2029', type: 'Selic', maturity: '01/03/2029', rate: 'Selic + 0.1892%', minValue: 156.12, unitPrice: 15612.45, rentability30d: 0.94, liquidity: 'D+1' },
    { id: '3', name: 'Tesouro IPCA+ 2029', type: 'IPCA+', maturity: '15/05/2029', rate: 'IPCA + 6.42%', minValue: 32.45, unitPrice: 3245.67, rentability30d: 1.15, liquidity: 'D+1' },
    { id: '4', name: 'Tesouro IPCA+ 2035', type: 'IPCA+', maturity: '15/05/2035', rate: 'IPCA + 6.58%', minValue: 45.23, unitPrice: 4523.12, rentability30d: 1.22, liquidity: 'D+1' },
    { id: '5', name: 'Tesouro IPCA+ 2045 c/ Juros', type: 'IPCA+', maturity: '15/05/2045', rate: 'IPCA + 6.45%', minValue: 48.90, unitPrice: 4890.34, rentability30d: 0.85, liquidity: 'D+1' },
    { id: '6', name: 'Tesouro Prefixado 2027', type: 'Prefixado', maturity: '01/01/2027', rate: '12.38% a.a.', minValue: 32.18, unitPrice: 3218.56, rentability30d: 1.05, liquidity: 'D+1' },
    { id: '7', name: 'Tesouro Prefixado 2031', type: 'Prefixado', maturity: '01/01/2031', rate: '13.15% a.a.', minValue: 28.45, unitPrice: 2845.23, rentability30d: 1.12, liquidity: 'D+1' },
    { id: '8', name: 'Tesouro Prefixado c/ Juros 2035', type: 'Prefixado', maturity: '01/01/2035', rate: '12.92% a.a.', minValue: 35.67, unitPrice: 3567.89, rentability30d: 0.78, liquidity: 'D+1' },
  ];

  const myBonds: MyBond[] = [
    { id: '1', name: 'Tesouro Selic 2027', type: 'Selic', maturity: '01/03/2027', invested: 5000, currentValue: 5156.23, profit: 156.23, profitPercent: 3.12, quantity: 0.3215 },
    { id: '2', name: 'Tesouro IPCA+ 2035', type: 'IPCA+', maturity: '15/05/2035', invested: 10000, currentValue: 10845.50, profit: 845.50, profitPercent: 8.46, quantity: 2.2134 },
    { id: '3', name: 'Tesouro Prefixado 2027', type: 'Prefixado', maturity: '01/01/2027', invested: 3000, currentValue: 3245.80, profit: 245.80, profitPercent: 8.19, quantity: 0.9325 },
  ];

  const bondTypes = ['all', 'Selic', 'IPCA+', 'Prefixado'];

  const filteredBonds = selectedType === 'all'
    ? bonds
    : bonds.filter(b => b.type === selectedType);

  const totalInvested = myBonds.reduce((acc, b) => acc + b.invested, 0);
  const totalCurrent = myBonds.reduce((acc, b) => acc + b.currentValue, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleInvest = () => {
    if (!selectedBond || !investAmount) {
      showToast('Preencha o valor do investimento', 'error');
      return;
    }
    const amount = parseFloat(investAmount.replace(/\D/g, '')) / 100;
    if (amount < selectedBond.minValue) {
      showToast(`Valor mínimo: ${formatCurrency(selectedBond.minValue)}`, 'error');
      return;
    }
    showToast(`Investimento de ${formatCurrency(amount)} em ${selectedBond.name} realizado!`, 'success');
    setShowInvestModal(false);
    setInvestAmount('');
    setSelectedBond(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(value) / 100;
    setInvestAmount(numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Selic': return '#22C55E';
      case 'IPCA+': return '#3B82F6';
      case 'Prefixado': return '#C9A227';
      default: return '#A3A3A3';
    }
  };

  return (
    <div className="tesouro-page">
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
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1>Tesouro Direto</h1>
            <p>Títulos públicos federais</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <div className="info-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
        </div>
        <p>Títulos garantidos pelo Tesouro Nacional. Investimento mais seguro do Brasil.</p>
      </div>

      {/* Portfolio Summary */}
      <div className="portfolio-summary">
        <div className="summary-card">
          <span className="label">Total em Tesouro Direto</span>
          <span className="value">{formatCurrency(totalCurrent)}</span>
          <div className="yield-info">
            <span className="yield positive">+{formatCurrency(totalCurrent - totalInvested)}</span>
            <span className="percent">({((totalCurrent - totalInvested) / totalInvested * 100).toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab ${activeTab === 'invest' ? 'active' : ''}`} onClick={() => setActiveTab('invest')}>
          Investir
        </button>
        <button className={`tab ${activeTab === 'my-bonds' ? 'active' : ''}`} onClick={() => setActiveTab('my-bonds')}>
          Meus Títulos
        </button>
      </div>

      {activeTab === 'invest' && (
        <>
          {/* Type Filter */}
          <div className="type-filter">
            {bondTypes.map(type => (
              <button
                key={type}
                className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
                style={selectedType === type ? { borderColor: getTypeColor(type), color: getTypeColor(type) } : {}}
              >
                {type === 'all' ? 'Todos' : type}
              </button>
            ))}
          </div>

          {/* Type Legend */}
          <div className="type-legend">
            <div className="legend-item">
              <span className="dot" style={{ background: '#22C55E' }}/>
              <span>Selic - Pós-fixado, baixa volatilidade</span>
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: '#3B82F6' }}/>
              <span>IPCA+ - Proteção contra inflação</span>
            </div>
            <div className="legend-item">
              <span className="dot" style={{ background: '#C9A227' }}/>
              <span>Prefixado - Taxa definida na compra</span>
            </div>
          </div>

          {/* Bonds List */}
          <div className="bonds-list">
            {filteredBonds.map(bond => (
              <div key={bond.id} className="bond-card" onClick={() => { setSelectedBond(bond); setShowInvestModal(true); }}>
                <div className="bond-header">
                  <span className="bond-type" style={{ background: `${getTypeColor(bond.type)}20`, color: getTypeColor(bond.type) }}>
                    {bond.type}
                  </span>
                  <span className="bond-liquidity">{bond.liquidity}</span>
                </div>
                <div className="bond-name">{bond.name}</div>
                <div className="bond-rate">{bond.rate}</div>
                <div className="bond-details">
                  <div className="detail">
                    <span className="label">Vencimento</span>
                    <span className="value">{bond.maturity}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Mínimo</span>
                    <span className="value">{formatCurrency(bond.minValue)}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Rent. 30d</span>
                    <span className="value positive">+{bond.rentability30d.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'my-bonds' && (
        <div className="my-bonds-list">
          {myBonds.map(bond => (
            <div key={bond.id} className="my-bond-card">
              <div className="bond-header">
                <span className="bond-type" style={{ background: `${getTypeColor(bond.type)}20`, color: getTypeColor(bond.type) }}>
                  {bond.type}
                </span>
                <span className="bond-maturity">Vence em {bond.maturity}</span>
              </div>
              <div className="bond-name">{bond.name}</div>

              <div className="bond-values">
                <div className="value-item">
                  <span className="label">Aplicado</span>
                  <span className="value">{formatCurrency(bond.invested)}</span>
                </div>
                <div className="value-item">
                  <span className="label">Valor atual</span>
                  <span className="value highlight">{formatCurrency(bond.currentValue)}</span>
                </div>
                <div className="value-item">
                  <span className="label">Rentabilidade</span>
                  <span className="value positive">+{bond.profitPercent.toFixed(2)}%</span>
                </div>
              </div>

              <div className="bond-quantity">
                <span>Quantidade: {bond.quantity.toFixed(4)} títulos</span>
              </div>

              <div className="bond-actions">
                <button className="action-btn invest" onClick={() => { setSelectedBond(bonds.find(b => b.name === bond.name) || null); setShowInvestModal(true); }}>
                  Aplicar mais
                </button>
                <button className="action-btn redeem" onClick={() => showToast('Solicitação de resgate enviada!', 'success')}>
                  Resgatar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invest Modal */}
      {showInvestModal && selectedBond && (
        <div className="modal-overlay" onClick={() => setShowInvestModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Investir em Tesouro Direto</h2>
              <button className="close-btn" onClick={() => setShowInvestModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="selected-bond">
                <span className="bond-type" style={{ background: `${getTypeColor(selectedBond.type)}20`, color: getTypeColor(selectedBond.type) }}>
                  {selectedBond.type}
                </span>
                <div className="bond-name">{selectedBond.name}</div>
                <div className="bond-rate">{selectedBond.rate}</div>
              </div>

              <div className="invest-form">
                <label>Quanto deseja investir?</label>
                <div className="amount-input">
                  <span className="currency">R$</span>
                  <input
                    type="text"
                    value={investAmount}
                    onChange={handleAmountChange}
                    placeholder="0,00"
                  />
                </div>
                <span className="min-info">Mínimo: {formatCurrency(selectedBond.minValue)}</span>
              </div>

              <div className="bond-summary">
                <div className="summary-row">
                  <span>Vencimento</span>
                  <span>{selectedBond.maturity}</span>
                </div>
                <div className="summary-row">
                  <span>Liquidez</span>
                  <span>{selectedBond.liquidity}</span>
                </div>
                <div className="summary-row">
                  <span>Preço unitário</span>
                  <span>{formatCurrency(selectedBond.unitPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Rentabilidade 30 dias</span>
                  <span className="positive">+{selectedBond.rentability30d}%</span>
                </div>
              </div>

              <div className="security-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Garantido pelo Tesouro Nacional</span>
              </div>

              <button className="invest-btn" onClick={handleInvest}>Confirmar investimento</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tesouro-page {
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
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 14px;
          color: #22C55E;
        }

        .header-content h1 { font-size: 18px; font-weight: 700; color: #fff; margin: 0; }
        .header-content p { font-size: 13px; color: #A3A3A3; margin: 0; }

        .info-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 20px;
          padding: 12px 16px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
        }
        .info-icon { color: #22C55E; }
        .info-banner p { font-size: 13px; color: #A3A3A3; margin: 0; }

        .portfolio-summary { padding: 0 20px 20px; }
        .summary-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px;
          padding: 20px;
        }
        .summary-card .label { font-size: 13px; color: #A3A3A3; }
        .summary-card .value { display: block; font-size: 28px; font-weight: 700; color: #fff; margin: 4px 0; }
        .yield-info { display: flex; align-items: center; gap: 8px; }
        .yield-info .yield { font-size: 14px; font-weight: 600; }
        .yield-info .yield.positive { color: #22C55E; }
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
        .tab.active { background: rgba(34, 197, 94, 0.15); border-color: #22C55E; color: #22C55E; }

        .type-filter { display: flex; gap: 8px; padding: 0 20px 12px; overflow-x: auto; }
        .filter-btn {
          padding: 8px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          color: #A3A3A3;
          font-size: 13px;
          white-space: nowrap;
          cursor: pointer;
        }
        .filter-btn.active { background: rgba(34, 197, 94, 0.1); }

        .type-legend { padding: 0 20px 16px; }
        .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .legend-item .dot { width: 8px; height: 8px; border-radius: 50%; }
        .legend-item span:last-child { font-size: 12px; color: #666; }

        .bonds-list, .my-bonds-list { padding: 0 20px; }

        .bond-card, .my-bond-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .bond-card:hover { border-color: #22C55E; }

        .bond-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .bond-type {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }
        .bond-liquidity, .bond-maturity { font-size: 12px; color: #666; }

        .bond-name { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 4px; }
        .bond-rate { font-size: 18px; font-weight: 700; color: #22C55E; margin-bottom: 12px; }

        .bond-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #333;
        }
        .detail { display: flex; flex-direction: column; gap: 2px; }
        .detail .label { font-size: 11px; color: #666; }
        .detail .value { font-size: 13px; color: #fff; font-weight: 500; }
        .detail .value.positive { color: #22C55E; }

        .bond-values {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #333;
          border-bottom: 1px solid #333;
        }
        .value-item { display: flex; flex-direction: column; gap: 2px; }
        .value-item .label { font-size: 11px; color: #666; }
        .value-item .value { font-size: 14px; color: #fff; font-weight: 500; }
        .value-item .value.highlight { color: #22C55E; }
        .value-item .value.positive { color: #22C55E; }

        .bond-quantity { padding: 12px 0; font-size: 12px; color: #666; }

        .bond-actions { display: flex; gap: 12px; }
        .action-btn {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .action-btn.invest { background: #22C55E; border: none; color: #fff; }
        .action-btn.redeem { background: transparent; border: 1px solid #333; color: #fff; }

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

        .selected-bond {
          text-align: center;
          padding: 20px;
          background: #262626;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .selected-bond .bond-name { font-size: 18px; font-weight: 600; color: #fff; margin: 12px 0 4px; }
        .selected-bond .bond-rate { font-size: 20px; font-weight: 700; color: #22C55E; margin: 0; }

        .invest-form { margin-bottom: 20px; }
        .invest-form label { display: block; font-size: 14px; color: #A3A3A3; margin-bottom: 8px; }
        .amount-input {
          display: flex;
          align-items: center;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          gap: 8px;
        }
        .amount-input .currency { font-size: 18px; color: #666; }
        .amount-input input {
          flex: 1;
          background: none;
          border: none;
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          outline: none;
        }
        .min-info { display: block; font-size: 12px; color: #666; margin-top: 8px; }

        .bond-summary {
          background: #262626;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .summary-row span:first-child { color: #A3A3A3; }
        .summary-row span:last-child { color: #fff; font-weight: 500; }
        .summary-row .positive { color: #22C55E; }

        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 10px;
          margin-bottom: 20px;
          color: #22C55E;
          font-size: 13px;
        }

        .invest-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Tesouro;
