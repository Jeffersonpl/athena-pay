import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  image: string;
}

interface Transaction {
  id: string;
  description: string;
  points: number;
  type: 'earn' | 'redeem';
  date: string;
}

interface Partner {
  id: string;
  name: string;
  cashback: number;
  category: string;
  logo: string;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('pt-BR').format(value);

export default function Rewards() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'partners' | 'history'>('overview');

  const userPoints = 12450;
  const userLevel = 'Platinum';
  const monthlyEarned = 2340;

  const levels = [
    { name: 'Gold', min: 0, max: 5000, color: '#C9A227' },
    { name: 'Platinum', min: 5001, max: 15000, color: '#A3A3A3' },
    { name: 'Black', min: 15001, max: Infinity, color: '#1A1A1A' },
  ];

  const currentLevel = levels.find(l => userPoints >= l.min && userPoints <= l.max);
  const nextLevel = levels[levels.indexOf(currentLevel!) + 1];
  const progressToNext = nextLevel ? ((userPoints - currentLevel!.min) / (nextLevel.min - currentLevel!.min)) * 100 : 100;

  const rewards: Reward[] = [
    { id: '1', name: 'Vale iFood R$50', description: 'Cupom de desconto', points: 5000, category: 'Alimentação', image: '🍔' },
    { id: '2', name: 'Netflix 1 mês', description: 'Assinatura mensal', points: 8000, category: 'Streaming', image: '🎬' },
    { id: '3', name: 'Spotify 1 mês', description: 'Assinatura mensal', points: 6000, category: 'Streaming', image: '🎵' },
    { id: '4', name: 'Vale Amazon R$100', description: 'Gift card', points: 10000, category: 'Compras', image: '📦' },
    { id: '5', name: 'Uber R$30', description: 'Créditos de viagem', points: 3000, category: 'Transporte', image: '🚗' },
    { id: '6', name: 'Cashback R$50', description: 'Crédito na conta', points: 4500, category: 'Dinheiro', image: '💰' },
  ];

  const partners: Partner[] = [
    { id: '1', name: 'iFood', cashback: 5, category: 'Alimentação', logo: '🍔' },
    { id: '2', name: 'Uber', cashback: 3, category: 'Transporte', logo: '🚗' },
    { id: '3', name: 'Amazon', cashback: 2, category: 'Compras', logo: '📦' },
    { id: '4', name: 'Booking', cashback: 8, category: 'Viagens', logo: '✈️' },
    { id: '5', name: 'Drogasil', cashback: 4, category: 'Saúde', logo: '💊' },
    { id: '6', name: 'Netshoes', cashback: 6, category: 'Esportes', logo: '👟' },
  ];

  const transactions: Transaction[] = [
    { id: '1', description: 'Compra no cartão - Amazon', points: 450, type: 'earn', date: '2025-01-14' },
    { id: '2', description: 'Resgate - Vale iFood', points: -5000, type: 'redeem', date: '2025-01-12' },
    { id: '3', description: 'Compra no cartão - iFood', points: 120, type: 'earn', date: '2025-01-10' },
    { id: '4', description: 'Bônus de nível Platinum', points: 1000, type: 'earn', date: '2025-01-01' },
    { id: '5', description: 'Compra no cartão - Uber', points: 85, type: 'earn', date: '2024-12-28' },
    { id: '6', description: 'Compra no cartão - Netflix', points: 200, type: 'earn', date: '2024-12-25' },
  ];

  const handleRedeem = (reward: Reward) => {
    if (userPoints < reward.points) {
      showToast('error', 'Pontos insuficientes');
      return;
    }
    showToast('success', `${reward.name} resgatado com sucesso!`);
  };

  return (
    <div className="rewards-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        </div>
        <h1>Athena Rewards</h1>
        <p>Seu programa de fidelidade</p>
      </div>

      {/* Points Card */}
      <div className="points-card">
        <div className="points-header">
          <div className="level-badge" style={{ background: currentLevel?.color }}>
            {userLevel}
          </div>
          <span className="points-label">Seus pontos</span>
        </div>
        <div className="points-value">
          <span className="points-number">{formatNumber(userPoints)}</span>
          <span className="points-unit">átomos</span>
        </div>
        <div className="points-sub">
          +{formatNumber(monthlyEarned)} este mês
        </div>

        {nextLevel && (
          <div className="level-progress">
            <div className="progress-info">
              <span>Próximo: {nextLevel.name}</span>
              <span>{formatNumber(nextLevel.min - userPoints)} pontos</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressToNext}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Início
        </button>
        <button
          className={`tab ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          Resgatar
        </button>
        <button
          className={`tab ${activeTab === 'partners' ? 'active' : ''}`}
          onClick={() => setActiveTab('partners')}
        >
          Parceiros
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Histórico
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon earn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">+{formatNumber(monthlyEarned)}</span>
                <span className="stat-label">Ganhos no mês</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon redeem">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">3</span>
                <span className="stat-label">Resgates</span>
              </div>
            </div>
          </div>

          {/* Featured Rewards */}
          <div className="section">
            <div className="section-header">
              <h3>Resgates em destaque</h3>
              <button className="btn-see-all" onClick={() => setActiveTab('rewards')}>
                Ver todos
              </button>
            </div>
            <div className="featured-rewards">
              {rewards.slice(0, 3).map(reward => (
                <div key={reward.id} className="reward-card mini">
                  <div className="reward-image">{reward.image}</div>
                  <div className="reward-info">
                    <span className="reward-name">{reward.name}</span>
                    <span className="reward-points">{formatNumber(reward.points)} átomos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="section">
            <div className="section-header">
              <h3>Atividade recente</h3>
              <button className="btn-see-all" onClick={() => setActiveTab('history')}>
                Ver todas
              </button>
            </div>
            <div className="activity-list">
              {transactions.slice(0, 4).map(tx => (
                <div key={tx.id} className="activity-item">
                  <div className={`activity-icon ${tx.type}`}>
                    {tx.type === 'earn' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <polyline points="19 12 12 19 5 12" />
                      </svg>
                    )}
                  </div>
                  <div className="activity-info">
                    <span className="activity-desc">{tx.description}</span>
                    <span className="activity-date">
                      {new Date(tx.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <span className={`activity-points ${tx.type}`}>
                    {tx.type === 'earn' ? '+' : ''}{formatNumber(tx.points)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="tab-content">
          <div className="rewards-grid">
            {rewards.map(reward => {
              const canRedeem = userPoints >= reward.points;
              return (
                <div key={reward.id} className={`reward-card ${!canRedeem ? 'disabled' : ''}`}>
                  <div className="reward-image large">{reward.image}</div>
                  <div className="reward-content">
                    <span className="reward-category">{reward.category}</span>
                    <h4 className="reward-name">{reward.name}</h4>
                    <p className="reward-description">{reward.description}</p>
                    <div className="reward-footer">
                      <span className="reward-points">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                        {formatNumber(reward.points)}
                      </span>
                      <button
                        className={`btn-redeem ${canRedeem ? '' : 'disabled'}`}
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                      >
                        {canRedeem ? 'Resgatar' : 'Pontos insuf.'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Partners Tab */}
      {activeTab === 'partners' && (
        <div className="tab-content">
          <div className="partners-intro">
            <h3>Ganhe mais com parceiros</h3>
            <p>Use seu cartão Athena e acumule pontos extras</p>
          </div>
          <div className="partners-grid">
            {partners.map(partner => (
              <div key={partner.id} className="partner-card">
                <div className="partner-logo">{partner.logo}</div>
                <div className="partner-info">
                  <span className="partner-name">{partner.name}</span>
                  <span className="partner-category">{partner.category}</span>
                </div>
                <div className="partner-cashback">
                  <span className="cashback-value">{partner.cashback}%</span>
                  <span className="cashback-label">cashback</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="tab-content">
          <div className="history-filters">
            <button className="filter-btn active">Todos</button>
            <button className="filter-btn">Ganhos</button>
            <button className="filter-btn">Resgates</button>
          </div>
          <div className="history-list">
            {transactions.map(tx => (
              <div key={tx.id} className="history-item">
                <div className={`history-icon ${tx.type}`}>
                  {tx.type === 'earn' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  )}
                </div>
                <div className="history-info">
                  <span className="history-desc">{tx.description}</span>
                  <span className="history-date">
                    {new Date(tx.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className={`history-points ${tx.type}`}>
                  {tx.type === 'earn' ? '+' : ''}{formatNumber(tx.points)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .rewards-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding: 24px 20px 100px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 20px;
          color: #C9A227;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Points Card */
        .points-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .points-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .points-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .level-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .points-label {
          font-size: 13px;
          color: #A3A3A3;
        }

        .points-value {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 8px;
        }

        .points-number {
          font-size: 48px;
          font-weight: 800;
          color: #C9A227;
          letter-spacing: -0.02em;
        }

        .points-unit {
          font-size: 18px;
          font-weight: 600;
          color: #666;
        }

        .points-sub {
          font-size: 14px;
          color: #22C55E;
          margin-bottom: 20px;
        }

        .level-progress {
          position: relative;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 12px;
          color: #666;
        }

        .progress-bar {
          height: 6px;
          background: #333;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A227, #E5B82A);
          border-radius: 3px;
          transition: width 0.3s;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 4px;
          background: #1A1A1A;
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #666;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: #262626;
          color: #C9A227;
        }

        .tab-content {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-icon.earn {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .stat-icon.redeem {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
        }

        /* Section */
        .section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .btn-see-all {
          background: none;
          border: none;
          color: #C9A227;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Featured Rewards */
        .featured-rewards {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .reward-card.mini {
          min-width: 140px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          padding: 16px;
          text-align: center;
        }

        .reward-image {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .reward-card.mini .reward-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          display: block;
          margin-bottom: 4px;
        }

        .reward-card.mini .reward-points {
          font-size: 12px;
          color: #C9A227;
        }

        /* Activity List */
        .activity-list {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          overflow: hidden;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #262626;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .activity-icon.earn {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .activity-icon.redeem {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .activity-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .activity-desc {
          font-size: 14px;
          color: #fff;
        }

        .activity-date {
          font-size: 12px;
          color: #666;
        }

        .activity-points {
          font-size: 14px;
          font-weight: 700;
        }

        .activity-points.earn {
          color: #22C55E;
        }

        .activity-points.redeem {
          color: #C9A227;
        }

        /* Rewards Grid */
        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .reward-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .reward-card:hover:not(.disabled) {
          border-color: #C9A227;
          transform: translateY(-2px);
        }

        .reward-card.disabled {
          opacity: 0.5;
        }

        .reward-image.large {
          font-size: 48px;
          text-align: center;
          padding: 24px;
          background: #262626;
        }

        .reward-content {
          padding: 16px;
        }

        .reward-category {
          font-size: 11px;
          font-weight: 600;
          color: #C9A227;
          text-transform: uppercase;
        }

        .reward-content h4 {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin: 4px 0 8px;
        }

        .reward-description {
          font-size: 12px;
          color: #666;
          margin: 0 0 12px;
        }

        .reward-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reward-footer .reward-points {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #C9A227;
        }

        .btn-redeem {
          padding: 8px 14px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          border-radius: 8px;
          color: #0D0D0D;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-redeem.disabled {
          background: #333;
          color: #666;
          cursor: not-allowed;
        }

        /* Partners */
        .partners-intro {
          text-align: center;
          margin-bottom: 24px;
        }

        .partners-intro h3 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .partners-intro p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .partner-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .partner-logo {
          font-size: 36px;
          margin-bottom: 12px;
        }

        .partner-info {
          margin-bottom: 12px;
        }

        .partner-name {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .partner-category {
          font-size: 12px;
          color: #666;
        }

        .partner-cashback {
          padding: 8px 16px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 20px;
        }

        .cashback-value {
          font-size: 18px;
          font-weight: 700;
          color: #22C55E;
        }

        .cashback-label {
          font-size: 11px;
          color: #22C55E;
          margin-left: 4px;
        }

        /* History */
        .history-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .filter-btn {
          padding: 10px 18px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          color: #666;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: rgba(201, 162, 39, 0.15);
          border-color: rgba(201, 162, 39, 0.3);
          color: #C9A227;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 16px;
        }

        .history-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .history-icon.earn {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .history-icon.redeem {
          background: rgba(201, 162, 39, 0.15);
          color: #C9A227;
        }

        .history-info {
          flex: 1;
        }

        .history-desc {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 4px;
        }

        .history-date {
          font-size: 12px;
          color: #666;
        }

        .history-points {
          font-size: 16px;
          font-weight: 700;
        }

        .history-points.earn {
          color: #22C55E;
        }

        .history-points.redeem {
          color: #C9A227;
        }

        @media (max-width: 480px) {
          .rewards-grid {
            grid-template-columns: 1fr;
          }

          .partners-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .points-number {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
}
