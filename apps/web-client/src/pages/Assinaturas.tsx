import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Subscription {
  id: string;
  name: string;
  logo: string;
  category: string;
  amount: number;
  billingDate: number;
  status: 'active' | 'paused' | 'cancelled';
  lastPayment: string;
  nextPayment: string;
}

const Assinaturas: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Netflix',
      logo: 'N',
      category: 'Streaming',
      amount: 55.90,
      billingDate: 15,
      status: 'active',
      lastPayment: '2024-01-15',
      nextPayment: '2024-02-15',
    },
    {
      id: '2',
      name: 'Spotify',
      logo: 'S',
      category: 'Música',
      amount: 21.90,
      billingDate: 10,
      status: 'active',
      lastPayment: '2024-01-10',
      nextPayment: '2024-02-10',
    },
    {
      id: '3',
      name: 'Amazon Prime',
      logo: 'A',
      category: 'Streaming',
      amount: 14.90,
      billingDate: 5,
      status: 'active',
      lastPayment: '2024-01-05',
      nextPayment: '2024-02-05',
    },
    {
      id: '4',
      name: 'iCloud',
      logo: 'i',
      category: 'Armazenamento',
      amount: 3.50,
      billingDate: 20,
      status: 'active',
      lastPayment: '2024-01-20',
      nextPayment: '2024-02-20',
    },
    {
      id: '5',
      name: 'Disney+',
      logo: 'D',
      category: 'Streaming',
      amount: 33.90,
      billingDate: 25,
      status: 'paused',
      lastPayment: '2023-12-25',
      nextPayment: '-',
    },
    {
      id: '6',
      name: 'HBO Max',
      logo: 'H',
      category: 'Streaming',
      amount: 34.90,
      billingDate: 8,
      status: 'cancelled',
      lastPayment: '2023-11-08',
      nextPayment: '-',
    },
  ]);

  const [paymentHistory] = useState([
    { id: '1', subscription: 'Netflix', amount: 55.90, date: '2024-01-15', status: 'paid' },
    { id: '2', subscription: 'Spotify', amount: 21.90, date: '2024-01-10', status: 'paid' },
    { id: '3', subscription: 'Amazon Prime', amount: 14.90, date: '2024-01-05', status: 'paid' },
    { id: '4', subscription: 'Netflix', amount: 55.90, date: '2023-12-15', status: 'paid' },
    { id: '5', subscription: 'Spotify', amount: 21.90, date: '2023-12-10', status: 'paid' },
    { id: '6', subscription: 'Disney+', amount: 33.90, date: '2023-12-25', status: 'paid' },
    { id: '7', subscription: 'HBO Max', amount: 34.90, date: '2023-11-08', status: 'paid' },
  ]);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMonthly = activeSubscriptions.reduce((acc, s) => acc + s.amount, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    if (dateStr === '-') return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const handleTogglePause = (subscription: Subscription) => {
    const newStatus = subscription.status === 'active' ? 'paused' : 'active';
    setSubscriptions(subscriptions.map(s =>
      s.id === subscription.id ? { ...s, status: newStatus } : s
    ));
    showToast(
      newStatus === 'active' ? 'Assinatura reativada!' : 'Assinatura pausada',
      newStatus === 'active' ? 'success' : 'info'
    );
    setShowDetailsModal(false);
  };

  const handleCancel = (subscription: Subscription) => {
    setSubscriptions(subscriptions.map(s =>
      s.id === subscription.id ? { ...s, status: 'cancelled' } : s
    ));
    showToast('Assinatura cancelada', 'info');
    setShowDetailsModal(false);
  };

  const openDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const getStatusInfo = (status: string) => {
    const info: Record<string, { label: string; color: string; bg: string }> = {
      active: { label: 'Ativa', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
      paused: { label: 'Pausada', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
      cancelled: { label: 'Cancelada', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };
    return info[status];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Streaming: '#E50914',
      Música: '#1DB954',
      Armazenamento: '#007AFF',
      Jogos: '#107C10',
      Educação: '#FFB900',
    };
    return colors[category] || '#C9A227';
  };

  return (
    <div className="assinaturas-page">
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
            <path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
            <path d="M1 10h22"/>
          </svg>
        </div>
        <h1>Assinaturas</h1>
        <p>Gerencie seus serviços recorrentes</p>
      </div>

      <div className="summary-card">
        <div className="summary-content">
          <div className="summary-info">
            <span className="label">Total mensal</span>
            <span className="value">{formatCurrency(totalMonthly)}</span>
          </div>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-value">{activeSubscriptions.length}</span>
              <span className="stat-label">Ativas</span>
            </div>
            <div className="stat">
              <span className="stat-value">{subscriptions.filter(s => s.status === 'paused').length}</span>
              <span className="stat-label">Pausadas</span>
            </div>
          </div>
        </div>
        <div className="upcoming-payments">
          <span className="upcoming-label">Próximos pagamentos</span>
          <div className="upcoming-list">
            {activeSubscriptions.slice(0, 3).map(sub => (
              <div key={sub.id} className="upcoming-item">
                <span className="name">{sub.name}</span>
                <span className="date">dia {sub.billingDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Assinaturas
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </button>
      </div>

      {activeTab === 'active' && (
        <div className="subscriptions-section">
          <div className="subscriptions-list">
            {subscriptions.map(sub => {
              const statusInfo = getStatusInfo(sub.status);
              return (
                <div
                  key={sub.id}
                  className={`subscription-card ${sub.status}`}
                  onClick={() => openDetails(sub)}
                >
                  <div className="subscription-logo" style={{ backgroundColor: getCategoryColor(sub.category) }}>
                    {sub.logo}
                  </div>
                  <div className="subscription-info">
                    <span className="subscription-name">{sub.name}</span>
                    <span className="subscription-category">{sub.category}</span>
                  </div>
                  <div className="subscription-details">
                    <span className="subscription-amount">{formatCurrency(sub.amount)}</span>
                    <span
                      className="subscription-status"
                      style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </div>
              );
            })}
          </div>

          <div className="categories-breakdown">
            <h3>Por Categoria</h3>
            <div className="categories-list">
              {Array.from(new Set(activeSubscriptions.map(s => s.category))).map(category => {
                const categoryTotal = activeSubscriptions
                  .filter(s => s.category === category)
                  .reduce((acc, s) => acc + s.amount, 0);
                const percentage = (categoryTotal / totalMonthly) * 100;
                return (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <div className="category-info">
                        <div
                          className="category-dot"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                        <span className="category-name">{category}</span>
                      </div>
                      <span className="category-amount">{formatCurrency(categoryTotal)}</span>
                    </div>
                    <div className="category-bar">
                      <div
                        className="category-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getCategoryColor(category),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="history-section">
          <div className="history-list">
            {paymentHistory.map(payment => (
              <div key={payment.id} className="history-item">
                <div className="history-info">
                  <span className="history-name">{payment.subscription}</span>
                  <span className="history-date">{formatDate(payment.date)}</span>
                </div>
                <div className="history-details">
                  <span className="history-amount">-{formatCurrency(payment.amount)}</span>
                  <span className="history-status">Pago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDetailsModal && selectedSubscription && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-subscription">
                <div
                  className="modal-logo"
                  style={{ backgroundColor: getCategoryColor(selectedSubscription.category) }}
                >
                  {selectedSubscription.logo}
                </div>
                <div className="modal-info">
                  <span className="modal-name">{selectedSubscription.name}</span>
                  <span className="modal-category">{selectedSubscription.category}</span>
                </div>
              </div>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="detail-row">
                <span className="detail-label">Valor mensal</span>
                <span className="detail-value">{formatCurrency(selectedSubscription.amount)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dia de cobrança</span>
                <span className="detail-value">Todo dia {selectedSubscription.billingDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Último pagamento</span>
                <span className="detail-value">{formatDate(selectedSubscription.lastPayment)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Próximo pagamento</span>
                <span className="detail-value">{formatDate(selectedSubscription.nextPayment)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span
                  className="detail-status"
                  style={{
                    color: getStatusInfo(selectedSubscription.status).color,
                    backgroundColor: getStatusInfo(selectedSubscription.status).bg,
                  }}
                >
                  {getStatusInfo(selectedSubscription.status).label}
                </span>
              </div>

              <div className="annual-cost">
                <span className="annual-label">Custo anual estimado</span>
                <span className="annual-value">{formatCurrency(selectedSubscription.amount * 12)}</span>
              </div>
            </div>
            <div className="modal-footer">
              {selectedSubscription.status !== 'cancelled' && (
                <>
                  <button
                    className="btn-pause"
                    onClick={() => handleTogglePause(selectedSubscription)}
                  >
                    {selectedSubscription.status === 'active' ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="4" width="4" height="16"/>
                          <rect x="14" y="4" width="4" height="16"/>
                        </svg>
                        Pausar
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5,3 19,12 5,21"/>
                        </svg>
                        Reativar
                      </>
                    )}
                  </button>
                  <button
                    className="btn-cancel-sub"
                    onClick={() => handleCancel(selectedSubscription)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .assinaturas-page {
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

        .summary-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #252525 100%);
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .summary-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .summary-info .label {
          color: #888;
          font-size: 14px;
          display: block;
        }

        .summary-info .value {
          color: #C9A227;
          font-size: 32px;
          font-weight: 700;
        }

        .summary-stats {
          display: flex;
          gap: 24px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          color: #fff;
          font-size: 24px;
          font-weight: 600;
          display: block;
        }

        .stat-label {
          color: #888;
          font-size: 12px;
        }

        .upcoming-payments {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upcoming-label {
          color: #888;
          font-size: 12px;
        }

        .upcoming-list {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .upcoming-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #252525;
          border-radius: 8px;
        }

        .upcoming-item .name {
          color: #fff;
          font-size: 13px;
        }

        .upcoming-item .date {
          color: #C9A227;
          font-size: 12px;
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

        .subscriptions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .subscription-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .subscription-card:hover {
          border-color: #C9A227;
        }

        .subscription-card.cancelled {
          opacity: 0.5;
        }

        .subscription-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .subscription-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .subscription-name {
          color: #fff;
          font-weight: 500;
        }

        .subscription-category {
          color: #888;
          font-size: 12px;
        }

        .subscription-details {
          text-align: right;
        }

        .subscription-amount {
          color: #fff;
          font-weight: 500;
          display: block;
        }

        .subscription-status {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
        }

        .categories-breakdown {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .categories-breakdown h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .category-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .category-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .category-name {
          color: #fff;
          font-size: 14px;
        }

        .category-amount {
          color: #888;
          font-size: 14px;
        }

        .category-bar {
          height: 6px;
          background: #252525;
          border-radius: 3px;
          overflow: hidden;
        }

        .category-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .history-info {
          display: flex;
          flex-direction: column;
        }

        .history-name {
          color: #fff;
          font-weight: 500;
        }

        .history-date {
          color: #888;
          font-size: 12px;
        }

        .history-details {
          text-align: right;
        }

        .history-amount {
          color: #EF4444;
          font-weight: 500;
          display: block;
        }

        .history-status {
          color: #22C55E;
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

        .modal-subscription {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .modal-info {
          display: flex;
          flex-direction: column;
        }

        .modal-name {
          color: #fff;
          font-size: 18px;
          font-weight: 500;
        }

        .modal-category {
          color: #888;
          font-size: 12px;
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

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .detail-row:last-of-type {
          border-bottom: none;
        }

        .detail-label {
          color: #888;
          font-size: 14px;
        }

        .detail-value {
          color: #fff;
          font-size: 14px;
        }

        .detail-status {
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .annual-cost {
          margin-top: 16px;
          padding: 16px;
          background: #252525;
          border-radius: 12px;
          text-align: center;
        }

        .annual-label {
          color: #888;
          font-size: 12px;
          display: block;
          margin-bottom: 4px;
        }

        .annual-value {
          color: #C9A227;
          font-size: 24px;
          font-weight: 600;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-pause {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: transparent;
          border: 1px solid #F59E0B;
          border-radius: 10px;
          color: #F59E0B;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-pause:hover {
          background: rgba(245, 158, 11, 0.1);
        }

        .btn-cancel-sub {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: transparent;
          border: 1px solid #EF4444;
          border-radius: 10px;
          color: #EF4444;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-cancel-sub:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Assinaturas;
