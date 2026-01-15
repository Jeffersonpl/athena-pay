import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../ui/Toast';

interface Fund {
  id: string;
  name: string;
  manager: string;
  type: 'Renda Fixa' | 'Multimercado' | 'Ações' | 'Cambial';
  category: string;
  return12m: number;
  returnMonth: number;
  minInvestment: number;
  adminFee: number;
  perfFee: number;
  risk: 1 | 2 | 3 | 4 | 5;
  liquidity: string;
  aum: number;
}

interface MyFund {
  id: string;
  fundName: string;
  type: string;
  invested: number;
  currentValue: number;
  return12m: number;
  shares: number;
  shareValue: number;
}

const Fundos: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'explore' | 'my-funds'>('explore');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [investAmount, setInvestAmount] = useState('');

  const funds: Fund[] = [
    { id: '1', name: 'Athena RF Premium', manager: 'Athena Asset', type: 'Renda Fixa', category: 'RF Crédito Privado', return12m: 13.45, returnMonth: 1.02, minInvestment: 100, adminFee: 0.5, perfFee: 0, risk: 1, liquidity: 'D+1', aum: 450000000 },
    { id: '2', name: 'Athena Multi Macro', manager: 'Athena Asset', type: 'Multimercado', category: 'MM Macro', return12m: 18.72, returnMonth: 2.15, minInvestment: 1000, adminFee: 1.5, perfFee: 20, risk: 3, liquidity: 'D+30', aum: 320000000 },
    { id: '3', name: 'Athena Ações Brasil', manager: 'Athena Asset', type: 'Ações', category: 'Ações Livre', return12m: 24.56, returnMonth: -1.23, minInvestment: 500, adminFee: 2.0, perfFee: 20, risk: 5, liquidity: 'D+4', aum: 180000000 },
    { id: '4', name: 'Athena Dólar', manager: 'Athena Asset', type: 'Cambial', category: 'Cambial Dólar', return12m: 8.34, returnMonth: 0.45, minInvestment: 500, adminFee: 0.8, perfFee: 0, risk: 3, liquidity: 'D+1', aum: 95000000 },
    { id: '5', name: 'Athena Dividendos', manager: 'Athena Asset', type: 'Ações', category: 'Ações Dividendos', return12m: 19.87, returnMonth: 1.56, minInvestment: 100, adminFee: 1.5, perfFee: 20, risk: 4, liquidity: 'D+4', aum: 250000000 },
    { id: '6', name: 'Athena MM Long Short', manager: 'Athena Asset', type: 'Multimercado', category: 'MM Long Short', return12m: 15.23, returnMonth: 0.89, minInvestment: 5000, adminFee: 2.0, perfFee: 20, risk: 3, liquidity: 'D+30', aum: 420000000 },
  ];

  const myFunds: MyFund[] = [
    { id: '1', fundName: 'Athena RF Premium', type: 'Renda Fixa', invested: 5000, currentValue: 5340.50, return12m: 13.45, shares: 4.82, shareValue: 1107.98 },
    { id: '2', fundName: 'Athena Multi Macro', type: 'Multimercado', invested: 10000, currentValue: 11250.00, return12m: 18.72, shares: 8.15, shareValue: 1380.37 },
  ];

  const fundTypes = ['all', 'Renda Fixa', 'Multimercado', 'Ações', 'Cambial'];

  const filteredFunds = selectedType === 'all'
    ? funds
    : funds.filter(f => f.type === selectedType);

  const totalInvested = myFunds.reduce((acc, f) => acc + f.invested, 0);
  const totalCurrent = myFunds.reduce((acc, f) => acc + f.currentValue, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatAUM = (value: number) => {
    if (value >= 1000000000) return `R$ ${(value / 1000000000).toFixed(1)} bi`;
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(0)} mi`;
    return formatCurrency(value);
  };

  const handleInvest = () => {
    if (!selectedFund || !investAmount) {
      showToast('Preencha o valor do investimento', 'error');
      return;
    }
    const amount = parseFloat(investAmount.replace(/\D/g, '')) / 100;
    if (amount < selectedFund.minInvestment) {
      showToast(`Valor mínimo: ${formatCurrency(selectedFund.minInvestment)}`, 'error');
      return;
    }
    showToast(`Investimento de ${formatCurrency(amount)} em ${selectedFund.name} realizado!`, 'success');
    setShowInvestModal(false);
    setInvestAmount('');
    setSelectedFund(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(value) / 100;
    setInvestAmount(numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const getRiskLabel = (risk: number) => {
    const labels = ['', 'Muito Baixo', 'Baixo', 'Moderado', 'Alto', 'Muito Alto'];
    return labels[risk];
  };

  return (
    <div className="fundos-page">
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
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div>
            <h1>Fundos de Investimento</h1>
            <p>Diversifique sua carteira</p>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="portfolio-summary">
        <div className="summary-card">
          <span className="label">Total em fundos</span>
          <span className="value">{formatCurrency(totalCurrent)}</span>
          <div className="yield-info">
            <span className={`yield ${totalCurrent - totalInvested >= 0 ? 'positive' : 'negative'}`}>
              {totalCurrent - totalInvested >= 0 ? '+' : ''}{formatCurrency(totalCurrent - totalInvested)}
            </span>
            <span className="percent">({((totalCurrent - totalInvested) / totalInvested * 100).toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
          Explorar Fundos
        </button>
        <button className={`tab ${activeTab === 'my-funds' ? 'active' : ''}`} onClick={() => setActiveTab('my-funds')}>
          Meus Fundos
        </button>
      </div>

      {activeTab === 'explore' && (
        <>
          {/* Type Filter */}
          <div className="type-filter">
            {fundTypes.map(type => (
              <button
                key={type}
                className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type === 'all' ? 'Todos' : type}
              </button>
            ))}
          </div>

          {/* Funds List */}
          <div className="funds-list">
            {filteredFunds.map(fund => (
              <div key={fund.id} className="fund-card" onClick={() => { setSelectedFund(fund); setShowInvestModal(true); }}>
                <div className="fund-header">
                  <span className="fund-type" data-type={fund.type}>{fund.type}</span>
                  <span className="fund-category">{fund.category}</span>
                </div>
                <div className="fund-name">{fund.name}</div>
                <div className="fund-manager">{fund.manager}</div>

                <div className="fund-returns">
                  <div className="return-item">
                    <span className="label">12 meses</span>
                    <span className={`value ${fund.return12m >= 0 ? 'positive' : 'negative'}`}>
                      {fund.return12m >= 0 ? '+' : ''}{fund.return12m.toFixed(2)}%
                    </span>
                  </div>
                  <div className="return-item">
                    <span className="label">Mês</span>
                    <span className={`value ${fund.returnMonth >= 0 ? 'positive' : 'negative'}`}>
                      {fund.returnMonth >= 0 ? '+' : ''}{fund.returnMonth.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="fund-details">
                  <div className="detail">
                    <span className="label">Mínimo</span>
                    <span className="value">{formatCurrency(fund.minInvestment)}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Liquidez</span>
                    <span className="value">{fund.liquidity}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Patrimônio</span>
                    <span className="value">{formatAUM(fund.aum)}</span>
                  </div>
                </div>

                <div className="fund-footer">
                  <div className="risk-meter">
                    <span className="label">Risco:</span>
                    <div className="risk-bars">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div key={level} className={`bar ${level <= fund.risk ? 'active' : ''}`} data-level={level}/>
                      ))}
                    </div>
                    <span className="risk-label">{getRiskLabel(fund.risk)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'my-funds' && (
        <div className="my-funds-list">
          {myFunds.map(fund => (
            <div key={fund.id} className="my-fund-card">
              <div className="fund-header">
                <span className="fund-type">{fund.type}</span>
              </div>
              <div className="fund-name">{fund.fundName}</div>

              <div className="fund-values">
                <div className="value-item">
                  <span className="label">Aplicado</span>
                  <span className="value">{formatCurrency(fund.invested)}</span>
                </div>
                <div className="value-item">
                  <span className="label">Valor atual</span>
                  <span className="value highlight">{formatCurrency(fund.currentValue)}</span>
                </div>
                <div className="value-item">
                  <span className="label">Rentabilidade</span>
                  <span className="value positive">+{((fund.currentValue - fund.invested) / fund.invested * 100).toFixed(2)}%</span>
                </div>
              </div>

              <div className="fund-shares">
                <span>{fund.shares.toFixed(6)} cotas</span>
                <span>Cota: {formatCurrency(fund.shareValue)}</span>
              </div>

              <div className="fund-actions">
                <button className="action-btn invest">Aplicar mais</button>
                <button className="action-btn redeem">Resgatar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invest Modal */}
      {showInvestModal && selectedFund && (
        <div className="modal-overlay" onClick={() => setShowInvestModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Investir em Fundo</h2>
              <button className="close-btn" onClick={() => setShowInvestModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="selected-fund-info">
                <span className="fund-type">{selectedFund.type}</span>
                <div className="fund-name">{selectedFund.name}</div>
                <div className="fund-manager">{selectedFund.manager}</div>
                <div className="fund-return">Retorno 12m: <span className="positive">+{selectedFund.return12m}%</span></div>
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
                <span className="min-info">Mínimo: {formatCurrency(selectedFund.minInvestment)}</span>
              </div>

              <div className="fund-summary">
                <div className="summary-row">
                  <span>Taxa de administração</span>
                  <span>{selectedFund.adminFee}% a.a.</span>
                </div>
                <div className="summary-row">
                  <span>Taxa de performance</span>
                  <span>{selectedFund.perfFee > 0 ? `${selectedFund.perfFee}% sobre CDI` : 'Não cobra'}</span>
                </div>
                <div className="summary-row">
                  <span>Liquidez</span>
                  <span>{selectedFund.liquidity}</span>
                </div>
                <div className="summary-row">
                  <span>Risco</span>
                  <span>{getRiskLabel(selectedFund.risk)}</span>
                </div>
              </div>

              <button className="invest-btn" onClick={handleInvest}>Confirmar investimento</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fundos-page {
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
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: none;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 14px;
          color: #3B82F6;
        }

        .header-content h1 {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .header-content p {
          font-size: 13px;
          color: #A3A3A3;
          margin: 0;
        }

        .portfolio-summary { padding: 20px; }

        .summary-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
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
          transition: all 0.2s;
        }
        .tab.active {
          background: rgba(59, 130, 246, 0.15);
          border-color: #3B82F6;
          color: #3B82F6;
        }

        .type-filter { display: flex; gap: 8px; padding: 0 20px 16px; overflow-x: auto; }
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
        .filter-btn.active { background: #3B82F6; border-color: #3B82F6; color: #fff; }

        .funds-list, .my-funds-list { padding: 0 20px; display: flex; flex-direction: column; gap: 12px; }

        .fund-card, .my-fund-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .fund-card:hover { border-color: #3B82F6; }

        .fund-header { display: flex; gap: 8px; margin-bottom: 8px; }
        .fund-type {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }
        .fund-type[data-type="Renda Fixa"] { background: rgba(34, 197, 94, 0.15); color: #22C55E; }
        .fund-type[data-type="Multimercado"] { background: rgba(139, 92, 246, 0.15); color: #8B5CF6; }
        .fund-type[data-type="Ações"] { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
        .fund-type[data-type="Cambial"] { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }

        .fund-category { font-size: 11px; color: #666; padding: 4px 0; }
        .fund-name { font-size: 16px; font-weight: 600; color: #fff; }
        .fund-manager { font-size: 13px; color: #666; margin-bottom: 12px; }

        .fund-returns {
          display: flex;
          gap: 24px;
          padding: 12px 0;
          border-top: 1px solid #333;
          border-bottom: 1px solid #333;
        }
        .return-item { display: flex; flex-direction: column; gap: 2px; }
        .return-item .label { font-size: 11px; color: #666; }
        .return-item .value { font-size: 18px; font-weight: 700; }
        .return-item .value.positive { color: #22C55E; }
        .return-item .value.negative { color: #EF4444; }

        .fund-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 12px 0;
        }
        .fund-details .detail { display: flex; flex-direction: column; gap: 2px; }
        .fund-details .label { font-size: 11px; color: #666; }
        .fund-details .value { font-size: 13px; color: #fff; font-weight: 500; }

        .fund-footer { padding-top: 12px; border-top: 1px solid #333; }
        .risk-meter { display: flex; align-items: center; gap: 8px; }
        .risk-meter .label { font-size: 12px; color: #666; }
        .risk-bars { display: flex; gap: 3px; }
        .risk-bars .bar { width: 16px; height: 6px; background: #333; border-radius: 2px; }
        .risk-bars .bar.active[data-level="1"] { background: #22C55E; }
        .risk-bars .bar.active[data-level="2"] { background: #84CC16; }
        .risk-bars .bar.active[data-level="3"] { background: #F59E0B; }
        .risk-bars .bar.active[data-level="4"] { background: #F97316; }
        .risk-bars .bar.active[data-level="5"] { background: #EF4444; }
        .risk-label { font-size: 11px; color: #A3A3A3; }

        .fund-values {
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
        .value-item .value.highlight { color: #3B82F6; }
        .value-item .value.positive { color: #22C55E; }

        .fund-shares {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 12px;
          color: #666;
        }

        .fund-actions { display: flex; gap: 12px; margin-top: 12px; }
        .action-btn {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn.invest {
          background: #3B82F6;
          border: none;
          color: #fff;
        }
        .action-btn.redeem {
          background: transparent;
          border: 1px solid #333;
          color: #fff;
        }

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

        .selected-fund-info {
          background: #262626;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .selected-fund-info .fund-name { font-size: 16px; font-weight: 600; color: #fff; margin: 8px 0 4px; }
        .selected-fund-info .fund-manager { font-size: 13px; color: #666; margin-bottom: 8px; }
        .selected-fund-info .fund-return { font-size: 14px; color: #A3A3A3; }
        .selected-fund-info .positive { color: #22C55E; font-weight: 600; }

        .invest-form { margin-bottom: 24px; }
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

        .fund-summary {
          background: #262626;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .summary-row span:first-child { color: #A3A3A3; }
        .summary-row span:last-child { color: #fff; font-weight: 500; }

        .invest-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
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

export default Fundos;
