import React, { useState, useEffect } from 'react';
import api from '../api/client';

interface Transaction {
  id: string;
  type: 'pix' | 'ted' | 'card' | 'boleto' | 'payment';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
}

// Icons
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const PixIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5" />
  </svg>
);

const TransferIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const BoletoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4h2v16H2zM6 4h1v16H6zM9 4h2v16H9zM13 4h1v16h-1zM16 4h3v16h-3zM21 4h1v16h-1z" />
  </svg>
);

const CreditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(date));

interface DashboardProps {
  onLogout?: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(12450.78);
  const [cards, setCards] = useState<any[]>([]);
  const [pixKeys, setPixKeys] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [balanceRes, cardsRes, keysRes] = await Promise.all([
          api.balance('acc-001'),
          api._unsafeFetch('/cards/cards').catch(() => []),
          api._unsafeFetch('/pix/keys?account_id=acc-001').catch(() => []),
        ]);

        if (!mounted) return;

        setBalance(Number(balanceRes?.available || balanceRes?.balance || 12450.78));
        setCards(Array.isArray(cardsRes) ? cardsRes : []);
        setPixKeys(Array.isArray(keysRes) ? keysRes : []);

        setTransactions([
          { id: '1', type: 'pix', title: 'PIX recebido', subtitle: 'Maria Silva', amount: 1250.0, date: new Date().toISOString() },
          { id: '2', type: 'card', title: 'Compra aprovada', subtitle: 'Amazon', amount: -459.90, date: new Date(Date.now() - 86400000).toISOString() },
          { id: '3', type: 'pix', title: 'PIX enviado', subtitle: 'Joao Santos', amount: -200.0, date: new Date(Date.now() - 172800000).toISOString() },
          { id: '4', type: 'ted', title: 'TED recebido', subtitle: 'Empresa LTDA', amount: 8500.0, date: new Date(Date.now() - 259200000).toISOString() },
          { id: '5', type: 'card', title: 'Compra aprovada', subtitle: 'Uber', amount: -32.50, date: new Date(Date.now() - 345600000).toISOString() },
        ]);
      } catch (e) {
        console.error('Error loading dashboard data:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <span>Carregando...</span>
        <style>{`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            gap: 16px;
            color: #666;
          }
          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #262626;
            border-top-color: #C9A227;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Balance Section */}
      <section className="balance-section">
        <div className="balance-header">
          <div className="balance-label">
            <span>Saldo disponivel</span>
            <button className="visibility-btn" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>
        <div className={`balance-value ${!showBalance ? 'hidden' : ''}`}>
          {showBalance ? formatCurrency(balance) : '••••••'}
        </div>
        <div className="balance-actions">
          <a href="#/pix/send" className="action-btn primary">
            <PixIcon />
            <span>Enviar PIX</span>
          </a>
          <a href="#/transferir" className="action-btn">
            <TransferIcon />
            <span>Transferir</span>
          </a>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions stagger-animate">
        <a href="#/pix" className="quick-action">
          <div className="quick-icon">
            <PixIcon />
          </div>
          <span>PIX</span>
        </a>
        <a href="#/cartoes" className="quick-action">
          <div className="quick-icon">
            <CardIcon />
          </div>
          <span>Cartoes</span>
        </a>
        <a href="#/boleto" className="quick-action">
          <div className="quick-icon">
            <BoletoIcon />
          </div>
          <span>Boleto</span>
        </a>
        <a href="#/emprestimo" className="quick-action">
          <div className="quick-icon">
            <CreditIcon />
          </div>
          <span>Emprestimo</span>
        </a>
      </section>

      {/* Cards Section */}
      <section className="card-section">
        <div className="section-header">
          <h2>Meus Cartoes</h2>
          <a href="#/cartoes" className="section-link">
            Ver todos <ChevronRightIcon />
          </a>
        </div>
        <div className="credit-card">
          <div className="card-gradient" />
          <div className="card-content">
            <div className="card-header">
              <span className="card-label">Athena Black</span>
              <span className="card-brand">VISA</span>
            </div>
            <div className="card-chip">
              <div className="chip-lines">
                <div /><div /><div /><div />
              </div>
            </div>
            <div className="card-number">
              •••• •••• •••• {cards[0]?.last_four || '4521'}
            </div>
            <div className="card-footer">
              <div className="card-holder">
                <span className="label">TITULAR</span>
                <span className="value">JEFFERSON LEITE</span>
              </div>
              <div className="card-expiry">
                <span className="label">VALIDADE</span>
                <span className="value">12/28</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PIX Section */}
      <section className="pix-section">
        <div className="section-header">
          <h2>PIX</h2>
          <span className="pix-badge">{pixKeys.length || 2} chaves</span>
        </div>
        <div className="pix-grid">
          <a href="#/pix/send" className="pix-action">
            <TransferIcon />
            <span>Enviar</span>
          </a>
          <a href="#/pix/receive" className="pix-action">
            <TransferIcon />
            <span>Receber</span>
          </a>
          <a href="#/pix" className="pix-action">
            <PixIcon />
            <span>Chaves</span>
          </a>
        </div>
      </section>

      {/* Transactions Section */}
      <section className="transactions-section">
        <div className="section-header">
          <h2>Ultimas Transacoes</h2>
          <a href="#/contas" className="section-link">
            Ver todas <ChevronRightIcon />
          </a>
        </div>
        <div className="transactions-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="transaction-item">
              <div className={`transaction-icon ${tx.type}`}>
                {tx.type === 'pix' && <PixIcon />}
                {tx.type === 'card' && <CardIcon />}
                {tx.type === 'ted' && <TransferIcon />}
                {tx.type === 'boleto' && <BoletoIcon />}
              </div>
              <div className="transaction-info">
                <span className="transaction-title">{tx.title}</span>
                <span className="transaction-subtitle">{tx.subtitle}</span>
              </div>
              <div className="transaction-amount">
                <span className={tx.amount >= 0 ? 'positive' : 'negative'}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </span>
                <span className="transaction-date">{formatDate(tx.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .dashboard {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 20px 40px;
        }

        /* Balance Section */
        .balance-section {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          border: 1px solid #262626;
          border-radius: 24px;
          padding: 28px;
          margin-bottom: 24px;
        }

        .balance-header {
          margin-bottom: 8px;
        }

        .balance-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #A3A3A3;
          font-size: 14px;
        }

        .visibility-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 8px;
          margin: -8px;
          transition: color 0.2s;
        }

        .visibility-btn:hover {
          color: #C9A227;
        }

        .balance-value {
          font-size: 40px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          transition: all 0.2s;
        }

        .balance-value.hidden {
          color: #666;
        }

        .balance-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 14px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #333;
          border-color: #444;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          color: #0D0D0D;
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201, 162, 39, 0.3);
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .quick-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 12px;
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 16px;
          text-decoration: none;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .quick-action:hover {
          border-color: #C9A227;
          transform: translateY(-2px);
        }

        .quick-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 1px solid rgba(201, 162, 39, 0.2);
          border-radius: 14px;
          color: #C9A227;
        }

        /* Card Section */
        .card-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .section-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #C9A227;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .credit-card {
          position: relative;
          background: #0D0D0D;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          overflow: hidden;
        }

        .card-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-label {
          font-size: 14px;
          font-weight: 600;
          color: #C9A227;
        }

        .card-brand {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .card-chip {
          width: 45px;
          height: 32px;
          background: linear-gradient(135deg, #C9A227 0%, #A68B1F 100%);
          border-radius: 6px;
          padding: 6px;
          margin-bottom: 20px;
        }

        .chip-lines {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          height: 100%;
        }

        .chip-lines div {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 1px;
        }

        .card-number {
          font-family: 'Courier New', monospace;
          font-size: 18px;
          color: #fff;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .card-footer {
          display: flex;
          gap: 40px;
        }

        .card-holder, .card-expiry {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .card-holder .label, .card-expiry .label {
          font-size: 10px;
          color: #666;
          letter-spacing: 0.1em;
        }

        .card-holder .value, .card-expiry .value {
          font-size: 13px;
          color: #fff;
          font-weight: 600;
        }

        /* PIX Section */
        .pix-section {
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .pix-badge {
          font-size: 12px;
          padding: 4px 12px;
          background: rgba(201, 162, 39, 0.15);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          color: #C9A227;
        }

        .pix-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .pix-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 14px;
          text-decoration: none;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .pix-action:hover {
          border-color: #C9A227;
          background: #333;
        }

        .pix-action svg {
          color: #C9A227;
        }

        /* Transactions Section */
        .transactions-section {
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 20px;
          padding: 20px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #262626;
        }

        .transaction-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .transaction-item:first-child {
          padding-top: 0;
        }

        .transaction-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #666;
        }

        .transaction-icon.pix { color: #C9A227; }
        .transaction-icon.card { color: #3B82F6; }
        .transaction-icon.ted { color: #22C55E; }

        .transaction-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .transaction-title {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .transaction-subtitle {
          font-size: 12px;
          color: #666;
        }

        .transaction-amount {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .transaction-amount .positive {
          color: #22C55E;
          font-weight: 600;
          font-size: 14px;
        }

        .transaction-amount .negative {
          color: #fff;
          font-weight: 600;
          font-size: 14px;
        }

        .transaction-date {
          font-size: 11px;
          color: #666;
        }

        /* Stagger Animations */
        .stagger-animate > * {
          opacity: 0;
          animation: staggerFadeIn 0.4s ease-out forwards;
        }

        .stagger-animate > *:nth-child(1) { animation-delay: 0ms; }
        .stagger-animate > *:nth-child(2) { animation-delay: 60ms; }
        .stagger-animate > *:nth-child(3) { animation-delay: 120ms; }
        .stagger-animate > *:nth-child(4) { animation-delay: 180ms; }
        .stagger-animate > *:nth-child(5) { animation-delay: 240ms; }

        @keyframes staggerFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .balance-section {
          animation: slideDown 0.4s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-section, .pix-section, .transactions-section {
          animation: fadeInSection 0.5s ease-out;
        }

        @keyframes fadeInSection {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .dashboard {
            padding: 16px 16px 32px;
          }

          .balance-value {
            font-size: 32px;
          }

          .balance-actions {
            flex-direction: column;
          }

          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }

          .card-footer {
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
