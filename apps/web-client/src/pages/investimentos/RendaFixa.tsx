import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../ui/Toast';

interface Product {
  id: string;
  name: string;
  issuer: string;
  type: 'CDB' | 'LCI' | 'LCA';
  rate: string;
  rateType: 'CDI' | 'IPCA' | 'PRE';
  minInvestment: number;
  term: string;
  liquidity: string;
  fgc: boolean;
  irFree: boolean;
  risk: 'Baixo' | 'Médio' | 'Alto';
}

interface Investment {
  id: string;
  product: string;
  type: 'CDB' | 'LCI' | 'LCA';
  amount: number;
  currentValue: number;
  rate: string;
  startDate: string;
  endDate: string;
  liquidity: string;
}

const RendaFixa: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'products' | 'my-investments'>('products');
  const [selectedType, setSelectedType] = useState<'all' | 'CDB' | 'LCI' | 'LCA'>('all');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [investAmount, setInvestAmount] = useState('');

  const products: Product[] = [
    { id: '1', name: 'CDB Athena Premium', issuer: 'Athena Pay', type: 'CDB', rate: '115% CDI', rateType: 'CDI', minInvestment: 1000, term: '2 anos', liquidity: 'No vencimento', fgc: true, irFree: false, risk: 'Baixo' },
    { id: '2', name: 'CDB Liquidez Diária', issuer: 'Athena Pay', type: 'CDB', rate: '102% CDI', rateType: 'CDI', minInvestment: 100, term: '1 ano', liquidity: 'Diária', fgc: true, irFree: false, risk: 'Baixo' },
    { id: '3', name: 'LCI Athena Imobiliário', issuer: 'Athena Pay', type: 'LCI', rate: '95% CDI', rateType: 'CDI', minInvestment: 5000, term: '2 anos', liquidity: 'No vencimento', fgc: true, irFree: true, risk: 'Baixo' },
    { id: '4', name: 'LCA Agro Plus', issuer: 'Athena Pay', type: 'LCA', rate: '93% CDI', rateType: 'CDI', minInvestment: 5000, term: '1 ano', liquidity: '90 dias', fgc: true, irFree: true, risk: 'Baixo' },
    { id: '5', name: 'CDB IPCA+', issuer: 'Athena Pay', type: 'CDB', rate: 'IPCA + 6.5%', rateType: 'IPCA', minInvestment: 1000, term: '3 anos', liquidity: 'No vencimento', fgc: true, irFree: false, risk: 'Baixo' },
    { id: '6', name: 'CDB Prefixado', issuer: 'Athena Pay', type: 'CDB', rate: '12.5% a.a.', rateType: 'PRE', minInvestment: 500, term: '2 anos', liquidity: 'No vencimento', fgc: true, irFree: false, risk: 'Baixo' },
  ];

  const myInvestments: Investment[] = [
    { id: '1', product: 'CDB Athena Premium', type: 'CDB', amount: 5000, currentValue: 5245.50, rate: '115% CDI', startDate: '2024-06-15', endDate: '2026-06-15', liquidity: 'No vencimento' },
    { id: '2', product: 'LCI Athena Imobiliário', type: 'LCI', amount: 10000, currentValue: 10420.00, rate: '95% CDI', startDate: '2024-01-10', endDate: '2026-01-10', liquidity: 'No vencimento' },
    { id: '3', product: 'CDB Liquidez Diária', type: 'CDB', amount: 2000, currentValue: 2052.30, rate: '102% CDI', startDate: '2024-09-01', endDate: '2025-09-01', liquidity: 'Diária' },
  ];

  const filteredProducts = selectedType === 'all'
    ? products
    : products.filter(p => p.type === selectedType);

  const totalInvested = myInvestments.reduce((acc, inv) => acc + inv.amount, 0);
  const totalCurrent = myInvestments.reduce((acc, inv) => acc + inv.currentValue, 0);
  const totalYield = totalCurrent - totalInvested;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleInvest = () => {
    if (!selectedProduct || !investAmount) {
      showToast('Preencha o valor do investimento', 'error');
      return;
    }
    const amount = parseFloat(investAmount.replace(/\D/g, '')) / 100;
    if (amount < selectedProduct.minInvestment) {
      showToast(`Valor mínimo: ${formatCurrency(selectedProduct.minInvestment)}`, 'error');
      return;
    }
    showToast(`Investimento de ${formatCurrency(amount)} em ${selectedProduct.name} realizado!`, 'success');
    setShowInvestModal(false);
    setInvestAmount('');
    setSelectedProduct(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(value) / 100;
    setInvestAmount(numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  return (
    <div className="renda-fixa-page">
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </div>
          <div>
            <h1>Renda Fixa</h1>
            <p>CDB, LCI e LCA</p>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="portfolio-summary">
        <div className="summary-card">
          <span className="label">Total investido</span>
          <span className="value">{formatCurrency(totalCurrent)}</span>
          <div className="yield-info">
            <span className="yield positive">+{formatCurrency(totalYield)}</span>
            <span className="percent">({((totalYield / totalInvested) * 100).toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Investir
        </button>
        <button
          className={`tab ${activeTab === 'my-investments' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-investments')}
        >
          Meus Investimentos
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          {/* Type Filter */}
          <div className="type-filter">
            {['all', 'CDB', 'LCI', 'LCA'].map(type => (
              <button
                key={type}
                className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type as any)}
              >
                {type === 'all' ? 'Todos' : type}
              </button>
            ))}
          </div>

          {/* Products List */}
          <div className="products-list">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => { setSelectedProduct(product); setShowInvestModal(true); }}>
                <div className="product-header">
                  <div className="product-type-badge" data-type={product.type}>{product.type}</div>
                  {product.irFree && <div className="ir-free-badge">Isento IR</div>}
                </div>
                <div className="product-name">{product.name}</div>
                <div className="product-issuer">{product.issuer}</div>
                <div className="product-rate">{product.rate}</div>
                <div className="product-details">
                  <div className="detail">
                    <span className="label">Mínimo</span>
                    <span className="value">{formatCurrency(product.minInvestment)}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Prazo</span>
                    <span className="value">{product.term}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Liquidez</span>
                    <span className="value">{product.liquidity}</span>
                  </div>
                </div>
                <div className="product-footer">
                  {product.fgc && <span className="fgc-badge">FGC</span>}
                  <span className={`risk-badge ${product.risk.toLowerCase()}`}>Risco {product.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'my-investments' && (
        <div className="investments-list">
          {myInvestments.map(inv => (
            <div key={inv.id} className="investment-card">
              <div className="inv-header">
                <span className="inv-type" data-type={inv.type}>{inv.type}</span>
                <span className="inv-liquidity">{inv.liquidity}</span>
              </div>
              <div className="inv-product">{inv.product}</div>
              <div className="inv-rate">{inv.rate}</div>
              <div className="inv-values">
                <div className="inv-value-item">
                  <span className="label">Aplicado</span>
                  <span className="value">{formatCurrency(inv.amount)}</span>
                </div>
                <div className="inv-value-item">
                  <span className="label">Valor atual</span>
                  <span className="value highlight">{formatCurrency(inv.currentValue)}</span>
                </div>
                <div className="inv-value-item">
                  <span className="label">Rendimento</span>
                  <span className="value positive">+{formatCurrency(inv.currentValue - inv.amount)}</span>
                </div>
              </div>
              <div className="inv-dates">
                <span>Aplicado em {new Date(inv.startDate).toLocaleDateString('pt-BR')}</span>
                <span>Vence em {new Date(inv.endDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invest Modal */}
      {showInvestModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowInvestModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Investir</h2>
              <button className="close-btn" onClick={() => setShowInvestModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="selected-product">
                <div className="product-type-badge" data-type={selectedProduct.type}>{selectedProduct.type}</div>
                <span className="name">{selectedProduct.name}</span>
                <span className="rate">{selectedProduct.rate}</span>
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
                <span className="min-info">Mínimo: {formatCurrency(selectedProduct.minInvestment)}</span>
              </div>
              <div className="product-summary">
                <div className="summary-row">
                  <span>Prazo</span>
                  <span>{selectedProduct.term}</span>
                </div>
                <div className="summary-row">
                  <span>Liquidez</span>
                  <span>{selectedProduct.liquidity}</span>
                </div>
                <div className="summary-row">
                  <span>IR</span>
                  <span>{selectedProduct.irFree ? 'Isento' : 'Regressivo'}</span>
                </div>
              </div>
              <button className="invest-btn" onClick={handleInvest}>Confirmar investimento</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .renda-fixa-page {
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
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 14px;
          color: #C9A227;
        }

        .header-content h1 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .header-content p {
          font-size: 13px;
          color: #A3A3A3;
          margin: 0;
        }

        .portfolio-summary {
          padding: 20px;
        }

        .summary-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 16px;
          padding: 20px;
        }

        .summary-card .label {
          font-size: 13px;
          color: #A3A3A3;
        }

        .summary-card .value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 4px 0;
        }

        .yield-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .yield-info .yield {
          font-size: 14px;
          font-weight: 600;
        }

        .yield-info .yield.positive { color: #22C55E; }

        .yield-info .percent {
          font-size: 13px;
          color: #A3A3A3;
        }

        .tabs-container {
          display: flex;
          gap: 8px;
          padding: 0 20px;
          margin-bottom: 16px;
        }

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
          background: rgba(201, 162, 39, 0.15);
          border-color: #C9A227;
          color: #C9A227;
        }

        .type-filter {
          display: flex;
          gap: 8px;
          padding: 0 20px 16px;
          overflow-x: auto;
        }

        .filter-btn {
          padding: 8px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          color: #A3A3A3;
          font-size: 13px;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: #C9A227;
          border-color: #C9A227;
          color: #000;
        }

        .products-list, .investments-list {
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .product-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .product-card:hover {
          border-color: #C9A227;
        }

        .product-header {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .product-type-badge {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }

        .product-type-badge[data-type="CDB"] {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .product-type-badge[data-type="LCI"] {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .product-type-badge[data-type="LCA"] {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .ir-free-badge {
          padding: 4px 10px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #22C55E;
        }

        .product-name {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .product-issuer {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
        }

        .product-rate {
          font-size: 20px;
          font-weight: 700;
          color: #C9A227;
          margin-bottom: 12px;
        }

        .product-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #333;
          border-bottom: 1px solid #333;
        }

        .product-details .detail {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .product-details .label {
          font-size: 11px;
          color: #666;
        }

        .product-details .value {
          font-size: 13px;
          color: #fff;
          font-weight: 500;
        }

        .product-footer {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .fgc-badge {
          padding: 4px 8px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          color: #8B5CF6;
        }

        .risk-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
        }

        .risk-badge.baixo {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .investment-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
        }

        .inv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .inv-type {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }

        .inv-type[data-type="CDB"] {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .inv-type[data-type="LCI"] {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .inv-type[data-type="LCA"] {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .inv-liquidity {
          font-size: 12px;
          color: #666;
        }

        .inv-product {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .inv-rate {
          font-size: 14px;
          color: #C9A227;
          margin-bottom: 12px;
        }

        .inv-values {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 12px 0;
          border-top: 1px solid #333;
        }

        .inv-value-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .inv-value-item .label {
          font-size: 11px;
          color: #666;
        }

        .inv-value-item .value {
          font-size: 14px;
          color: #fff;
          font-weight: 500;
        }

        .inv-value-item .value.highlight {
          color: #C9A227;
        }

        .inv-value-item .value.positive {
          color: #22C55E;
        }

        .inv-dates {
          display: flex;
          justify-content: space-between;
          padding-top: 12px;
          font-size: 11px;
          color: #666;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
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

        .modal-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: none;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
        }

        .modal-body {
          padding: 20px;
        }

        .selected-product {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .selected-product .name {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }

        .selected-product .rate {
          font-size: 14px;
          color: #C9A227;
        }

        .invest-form {
          margin-bottom: 24px;
        }

        .invest-form label {
          display: block;
          font-size: 14px;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .amount-input {
          display: flex;
          align-items: center;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          gap: 8px;
        }

        .amount-input .currency {
          font-size: 18px;
          color: #666;
        }

        .amount-input input {
          flex: 1;
          background: none;
          border: none;
          font-size: 24px;
          font-weight: 600;
          color: #fff;
          outline: none;
        }

        .min-info {
          display: block;
          font-size: 12px;
          color: #666;
          margin-top: 8px;
        }

        .product-summary {
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

        .summary-row span:first-child {
          color: #A3A3A3;
        }

        .summary-row span:last-child {
          color: #fff;
          font-weight: 500;
        }

        .invest-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #C9A227 0%, #E5B82A 100%);
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #000;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .product-details, .inv-values {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RendaFixa;
