import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface ConnectedBank {
  id: string;
  name: string;
  logo: string;
  color: string;
  balance: number;
  lastSync: string;
  status: 'connected' | 'expired' | 'error';
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  bank: string;
  category: string;
}

const OpenFinance: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'transactions'>('overview');
  const [showConnectModal, setShowConnectModal] = useState(false);

  const [connectedBanks, setConnectedBanks] = useState<ConnectedBank[]>([
    { id: '1', name: 'Banco do Brasil', logo: 'BB', color: '#FFED00', balance: 5430.50, lastSync: '2024-01-15T10:30:00', status: 'connected' },
    { id: '2', name: 'Itaú', logo: 'IT', color: '#EC7000', balance: 12350.00, lastSync: '2024-01-15T09:15:00', status: 'connected' },
    { id: '3', name: 'Nubank', logo: 'NU', color: '#8A05BE', balance: 3200.75, lastSync: '2024-01-14T18:00:00', status: 'expired' },
  ]);

  const [availableBanks] = useState([
    { id: 'bradesco', name: 'Bradesco', logo: 'BR', color: '#CC092F' },
    { id: 'santander', name: 'Santander', logo: 'SA', color: '#EA1D25' },
    { id: 'caixa', name: 'Caixa', logo: 'CX', color: '#005CA9' },
    { id: 'inter', name: 'Inter', logo: 'IN', color: '#FF7A00' },
    { id: 'c6', name: 'C6 Bank', logo: 'C6', color: '#1A1A1A' },
    { id: 'original', name: 'Banco Original', logo: 'OR', color: '#00875F' },
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: '1', description: 'Salário', amount: 8500, type: 'income', date: '2024-01-15', bank: 'Itaú', category: 'Renda' },
    { id: '2', description: 'Supermercado', amount: 450.30, type: 'expense', date: '2024-01-14', bank: 'Nubank', category: 'Alimentação' },
    { id: '3', description: 'Aluguel', amount: 2500, type: 'expense', date: '2024-01-10', bank: 'Banco do Brasil', category: 'Moradia' },
    { id: '4', description: 'Freelance', amount: 2000, type: 'income', date: '2024-01-08', bank: 'Itaú', category: 'Renda Extra' },
    { id: '5', description: 'Restaurante', amount: 120.50, type: 'expense', date: '2024-01-07', bank: 'Nubank', category: 'Alimentação' },
  ]);

  const totalBalance = connectedBanks.reduce((acc, bank) => acc + bank.balance, 0);
  const athenaBalance = 15000.00;
  const consolidatedBalance = totalBalance + athenaBalance;

  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatLastSync = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Agora';
    if (hours < 24) return `Há ${hours}h`;
    return `Há ${Math.floor(hours / 24)} dias`;
  };

  const handleConnect = (bank: typeof availableBanks[0]) => {
    showToast(`Conectando com ${bank.name}...`, 'info');
    setTimeout(() => {
      const newBank: ConnectedBank = {
        id: bank.id,
        name: bank.name,
        logo: bank.logo,
        color: bank.color,
        balance: Math.random() * 10000,
        lastSync: new Date().toISOString(),
        status: 'connected',
      };
      setConnectedBanks([...connectedBanks, newBank]);
      showToast(`${bank.name} conectado com sucesso!`, 'success');
      setShowConnectModal(false);
    }, 2000);
  };

  const handleSync = (bankId: string) => {
    setConnectedBanks(connectedBanks.map(bank =>
      bank.id === bankId ? { ...bank, lastSync: new Date().toISOString(), status: 'connected' } : bank
    ));
    showToast('Dados sincronizados!', 'success');
  };

  const handleDisconnect = (bankId: string) => {
    setConnectedBanks(connectedBanks.filter(bank => bank.id !== bankId));
    showToast('Conexão removida', 'info');
  };

  const getStatusInfo = (status: string) => {
    const info: Record<string, { label: string; color: string }> = {
      connected: { label: 'Conectado', color: '#22C55E' },
      expired: { label: 'Expirado', color: '#F59E0B' },
      error: { label: 'Erro', color: '#EF4444' },
    };
    return info[status];
  };

  return (
    <div className="openfinance-page">
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
        </div>
        <h1>Open Finance</h1>
        <p>Conecte suas contas e veja tudo em um só lugar</p>
      </div>

      <div className="consolidated-card">
        <div className="consolidated-header">
          <span className="label">Patrimônio Consolidado</span>
          <span className="value">{formatCurrency(consolidatedBalance)}</span>
        </div>
        <div className="consolidated-breakdown">
          <div className="breakdown-item">
            <span className="bank-name">Athena Pay</span>
            <span className="bank-balance">{formatCurrency(athenaBalance)}</span>
          </div>
          {connectedBanks.filter(b => b.status === 'connected').map(bank => (
            <div key={bank.id} className="breakdown-item">
              <span className="bank-name">{bank.name}</span>
              <span className="bank-balance">{formatCurrency(bank.balance)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button
          className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Contas
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transações
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-section">
          <div className="summary-cards">
            <div className="summary-card income">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5,12 12,5 19,12"/>
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">Receitas do mês</span>
                <span className="summary-value">{formatCurrency(monthlyIncome)}</span>
              </div>
            </div>
            <div className="summary-card expense">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19,12 12,19 5,12"/>
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">Despesas do mês</span>
                <span className="summary-value">{formatCurrency(monthlyExpenses)}</span>
              </div>
            </div>
          </div>

          <div className="balance-chart">
            <h3>Balanço Mensal</h3>
            <div className="chart-container">
              <div className="chart-bar income" style={{ height: `${(monthlyIncome / (monthlyIncome + monthlyExpenses)) * 100}%` }}>
                <span className="bar-label">{formatCurrency(monthlyIncome)}</span>
              </div>
              <div className="chart-bar expense" style={{ height: `${(monthlyExpenses / (monthlyIncome + monthlyExpenses)) * 100}%` }}>
                <span className="bar-label">{formatCurrency(monthlyExpenses)}</span>
              </div>
            </div>
            <div className="chart-legend">
              <span className="legend-item income">Receitas</span>
              <span className="legend-item expense">Despesas</span>
            </div>
          </div>

          <div className="net-result">
            <span className="label">Resultado do mês</span>
            <span className={`value ${monthlyIncome - monthlyExpenses >= 0 ? 'positive' : 'negative'}`}>
              {monthlyIncome - monthlyExpenses >= 0 ? '+' : ''}{formatCurrency(monthlyIncome - monthlyExpenses)}
            </span>
          </div>
        </div>
      )}

      {activeTab === 'accounts' && (
        <div className="accounts-section">
          <div className="accounts-list">
            <div className="account-card athena">
              <div className="account-logo" style={{ background: 'linear-gradient(135deg, #C9A227 0%, #333 100%)' }}>
                AP
              </div>
              <div className="account-info">
                <span className="account-name">Athena Pay</span>
                <span className="account-status" style={{ color: '#22C55E' }}>Principal</span>
              </div>
              <span className="account-balance">{formatCurrency(athenaBalance)}</span>
            </div>

            {connectedBanks.map(bank => {
              const statusInfo = getStatusInfo(bank.status);
              return (
                <div key={bank.id} className={`account-card ${bank.status}`}>
                  <div className="account-logo" style={{ backgroundColor: bank.color }}>
                    {bank.logo}
                  </div>
                  <div className="account-info">
                    <span className="account-name">{bank.name}</span>
                    <span className="account-status" style={{ color: statusInfo.color }}>
                      {statusInfo.label} • {formatLastSync(bank.lastSync)}
                    </span>
                  </div>
                  <span className="account-balance">{formatCurrency(bank.balance)}</span>
                  <div className="account-actions">
                    {bank.status === 'expired' ? (
                      <button className="btn-reconnect" onClick={() => handleSync(bank.id)}>
                        Reconectar
                      </button>
                    ) : (
                      <button className="btn-sync" onClick={() => handleSync(bank.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M23 4v6h-6"/>
                          <path d="M1 20v-6h6"/>
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                        </svg>
                      </button>
                    )}
                    <button className="btn-disconnect" onClick={() => handleDisconnect(bank.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn-add-bank" onClick={() => setShowConnectModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Conectar novo banco
          </button>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="transactions-section">
          <div className="filter-row">
            <select defaultValue="all">
              <option value="all">Todas as contas</option>
              <option value="athena">Athena Pay</option>
              {connectedBanks.map(bank => (
                <option key={bank.id} value={bank.id}>{bank.name}</option>
              ))}
            </select>
            <select defaultValue="all">
              <option value="all">Todos os tipos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>

          <div className="transactions-list">
            {transactions.map(tx => (
              <div key={tx.id} className="transaction-card">
                <div className={`tx-icon ${tx.type}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {tx.type === 'income' ? (
                      <path d="M12 19V5M5 12l7-7 7 7"/>
                    ) : (
                      <path d="M12 5v14M5 12l7 7 7-7"/>
                    )}
                  </svg>
                </div>
                <div className="tx-info">
                  <span className="tx-description">{tx.description}</span>
                  <span className="tx-meta">{tx.bank} • {tx.category}</span>
                </div>
                <div className="tx-details">
                  <span className={`tx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <span className="tx-date">{formatDate(tx.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showConnectModal && (
        <div className="modal-overlay" onClick={() => setShowConnectModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Conectar Banco</h3>
              <button className="btn-close" onClick={() => setShowConnectModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <p className="modal-desc">
                Selecione o banco que deseja conectar. Você será redirecionado para autorizar o acesso de forma segura.
              </p>
              <div className="banks-grid">
                {availableBanks
                  .filter(bank => !connectedBanks.find(cb => cb.id === bank.id))
                  .map(bank => (
                    <button
                      key={bank.id}
                      className="bank-option"
                      onClick={() => handleConnect(bank)}
                    >
                      <div className="bank-logo" style={{ backgroundColor: bank.color }}>
                        {bank.logo}
                      </div>
                      <span className="bank-name">{bank.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .openfinance-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
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

        .page-header h1 {
          color: #fff;
          font-size: 28px;
          margin: 0 0 8px;
        }

        .page-header p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .consolidated-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #252525 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .consolidated-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .consolidated-header .label {
          color: #888;
          font-size: 14px;
          display: block;
          margin-bottom: 8px;
        }

        .consolidated-header .value {
          color: #C9A227;
          font-size: 36px;
          font-weight: 700;
        }

        .consolidated-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bank-name {
          color: #888;
          font-size: 14px;
        }

        .bank-balance {
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
        }

        .tab.active {
          background: #C9A227;
          color: #000;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .summary-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary-card.income .summary-icon {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .summary-card.expense .summary-icon {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .summary-content {
          display: flex;
          flex-direction: column;
        }

        .summary-label {
          color: #888;
          font-size: 12px;
        }

        .summary-value {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
        }

        .balance-chart {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .balance-chart h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 20px;
        }

        .chart-container {
          display: flex;
          justify-content: center;
          gap: 40px;
          height: 150px;
          align-items: flex-end;
          margin-bottom: 16px;
        }

        .chart-bar {
          width: 60px;
          border-radius: 8px 8px 0 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 8px;
          min-height: 40px;
        }

        .chart-bar.income {
          background: linear-gradient(to top, #22C55E, #16A34A);
        }

        .chart-bar.expense {
          background: linear-gradient(to top, #EF4444, #DC2626);
        }

        .bar-label {
          color: #fff;
          font-size: 11px;
          font-weight: 500;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .legend-item.income {
          color: #22C55E;
        }

        .legend-item.income:before {
          content: '';
          width: 12px;
          height: 12px;
          background: #22C55E;
          border-radius: 3px;
        }

        .legend-item.expense {
          color: #EF4444;
        }

        .legend-item.expense:before {
          content: '';
          width: 12px;
          height: 12px;
          background: #EF4444;
          border-radius: 3px;
        }

        .net-result {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .net-result .label {
          color: #888;
          font-size: 14px;
        }

        .net-result .value {
          font-size: 24px;
          font-weight: 700;
        }

        .net-result .value.positive {
          color: #22C55E;
        }

        .net-result .value.negative {
          color: #EF4444;
        }

        .accounts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .account-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .account-card.athena {
          border-color: #C9A227;
        }

        .account-card.expired {
          opacity: 0.7;
        }

        .account-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
        }

        .account-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .account-name {
          color: #fff;
          font-weight: 500;
        }

        .account-status {
          font-size: 12px;
        }

        .account-balance {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin-right: 12px;
        }

        .account-actions {
          display: flex;
          gap: 8px;
        }

        .btn-sync, .btn-disconnect {
          width: 32px;
          height: 32px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          cursor: pointer;
        }

        .btn-sync:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .btn-disconnect:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .btn-reconnect {
          padding: 6px 12px;
          background: #F59E0B;
          border: none;
          border-radius: 6px;
          color: #000;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-add-bank {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: transparent;
          border: 2px dashed #333;
          border-radius: 12px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-add-bank:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .filter-row {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .filter-row select {
          flex: 1;
          padding: 12px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
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
          gap: 12px;
        }

        .tx-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tx-icon.income {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .tx-icon.expense {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .tx-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .tx-description {
          color: #fff;
          font-weight: 500;
        }

        .tx-meta {
          color: #888;
          font-size: 12px;
        }

        .tx-details {
          text-align: right;
        }

        .tx-amount {
          font-weight: 600;
          display: block;
        }

        .tx-amount.income {
          color: #22C55E;
        }

        .tx-amount.expense {
          color: #EF4444;
        }

        .tx-date {
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

        .modal-desc {
          color: #888;
          font-size: 14px;
          margin: 0 0 20px;
          line-height: 1.5;
        }

        .banks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .bank-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .bank-option:hover {
          border-color: #C9A227;
        }

        .bank-option .bank-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
        }

        .bank-option .bank-name {
          color: #fff;
          font-size: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default OpenFinance;
