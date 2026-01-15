import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Referral {
  id: string;
  name: string;
  date: string;
  status: 'pending' | 'completed' | 'expired';
  bonus?: number;
}

const Indicar: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'invite' | 'referrals' | 'ranking'>('invite');

  const referralCode = 'JOAO2024';
  const referralLink = `https://athenapay.com/indicar/${referralCode}`;

  const [referrals] = useState<Referral[]>([
    { id: '1', name: 'Maria S.', date: '2024-01-10', status: 'completed', bonus: 50 },
    { id: '2', name: 'Pedro O.', date: '2024-01-08', status: 'completed', bonus: 50 },
    { id: '3', name: 'Ana C.', date: '2024-01-05', status: 'pending' },
    { id: '4', name: 'Lucas M.', date: '2024-01-03', status: 'expired' },
    { id: '5', name: 'Julia R.', date: '2023-12-20', status: 'completed', bonus: 50 },
  ]);

  const [ranking] = useState([
    { position: 1, name: 'Carlos M.', referrals: 47, avatar: 'CM' },
    { position: 2, name: 'Ana Paula S.', referrals: 42, avatar: 'AP' },
    { position: 3, name: 'Roberto L.', referrals: 38, avatar: 'RL' },
    { position: 4, name: 'Fernanda C.', referrals: 35, avatar: 'FC' },
    { position: 5, name: 'João Silva', referrals: 12, avatar: 'JS', isUser: true },
  ]);

  const totalBonus = referrals
    .filter(r => r.status === 'completed')
    .reduce((acc, r) => acc + (r.bonus || 0), 0);

  const completedReferrals = referrals.filter(r => r.status === 'completed').length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copiado para a área de transferência!', 'success');
  };

  const shareVia = (platform: string) => {
    showToast(`Compartilhando via ${platform}...`, 'info');
  };

  const getStatusInfo = (status: string) => {
    const info: Record<string, { label: string; color: string; bg: string }> = {
      pending: { label: 'Pendente', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
      completed: { label: 'Completa', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
      expired: { label: 'Expirada', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };
    return info[status];
  };

  return (
    <div className="indicar-page">
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h1>Indicar Amigos</h1>
        <p>Ganhe R$ 50 por cada amigo que abrir conta</p>
      </div>

      <div className="stats-card">
        <div className="stat">
          <span className="stat-value">{completedReferrals}</span>
          <span className="stat-label">Indicações</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">R$ {totalBonus}</span>
          <span className="stat-label">Bônus ganho</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">#5</span>
          <span className="stat-label">No ranking</span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'invite' ? 'active' : ''}`}
          onClick={() => setActiveTab('invite')}
        >
          Convidar
        </button>
        <button
          className={`tab ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => setActiveTab('referrals')}
        >
          Indicações
        </button>
        <button
          className={`tab ${activeTab === 'ranking' ? 'active' : ''}`}
          onClick={() => setActiveTab('ranking')}
        >
          Ranking
        </button>
      </div>

      {activeTab === 'invite' && (
        <div className="invite-section">
          <div className="code-card">
            <span className="code-label">Seu código de indicação</span>
            <div className="code-display">
              <span className="code">{referralCode}</span>
              <button className="btn-copy" onClick={() => copyToClipboard(referralCode)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="link-card">
            <span className="link-label">Link de convite</span>
            <div className="link-display">
              <span className="link">{referralLink}</span>
              <button className="btn-copy" onClick={() => copyToClipboard(referralLink)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="share-section">
            <h3>Compartilhar via</h3>
            <div className="share-buttons">
              <button className="share-btn whatsapp" onClick={() => shareVia('WhatsApp')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
              <button className="share-btn telegram" onClick={() => shareVia('Telegram')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </button>
              <button className="share-btn sms" onClick={() => shareVia('SMS')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                SMS
              </button>
              <button className="share-btn more" onClick={() => shareVia('Outros')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Mais
              </button>
            </div>
          </div>

          <div className="how-it-works">
            <h3>Como funciona</h3>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <span className="step-title">Compartilhe</span>
                  <span className="step-desc">Envie seu link ou código para amigos</span>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <span className="step-title">Cadastro</span>
                  <span className="step-desc">Seu amigo abre uma conta Athena</span>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <span className="step-title">Ganhe</span>
                  <span className="step-desc">Vocês dois ganham R$ 50 de bônus!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="referrals-section">
          {referrals.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <h3>Nenhuma indicação ainda</h3>
              <p>Compartilhe seu código e comece a ganhar!</p>
            </div>
          ) : (
            <div className="referrals-list">
              {referrals.map(referral => {
                const statusInfo = getStatusInfo(referral.status);
                return (
                  <div key={referral.id} className="referral-card">
                    <div className="referral-avatar">
                      {referral.name.charAt(0)}
                    </div>
                    <div className="referral-info">
                      <span className="referral-name">{referral.name}</span>
                      <span className="referral-date">
                        {new Date(referral.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="referral-status">
                      <span
                        className="status-badge"
                        style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
                      >
                        {statusInfo.label}
                      </span>
                      {referral.bonus && (
                        <span className="referral-bonus">+R$ {referral.bonus}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className="ranking-section">
          <div className="ranking-header">
            <h3>Top Indicadores do Mês</h3>
            <span className="ranking-period">Janeiro 2024</span>
          </div>
          <div className="ranking-list">
            {ranking.map(user => (
              <div
                key={user.position}
                className={`ranking-item ${user.isUser ? 'is-user' : ''}`}
              >
                <div className="position">
                  {user.position <= 3 ? (
                    <span className={`medal medal-${user.position}`}>
                      {user.position === 1 && '🥇'}
                      {user.position === 2 && '🥈'}
                      {user.position === 3 && '🥉'}
                    </span>
                  ) : (
                    <span className="position-number">{user.position}</span>
                  )}
                </div>
                <div className="ranking-avatar">
                  {user.avatar}
                </div>
                <div className="ranking-info">
                  <span className="ranking-name">
                    {user.name}
                    {user.isUser && <span className="you-badge">Você</span>}
                  </span>
                  <span className="ranking-referrals">{user.referrals} indicações</span>
                </div>
              </div>
            ))}
          </div>
          <div className="ranking-prizes">
            <h4>Prêmios do mês</h4>
            <div className="prizes-list">
              <div className="prize-item">
                <span className="prize-medal">🥇</span>
                <span className="prize-desc">1º lugar: R$ 500 + Cartão Black</span>
              </div>
              <div className="prize-item">
                <span className="prize-medal">🥈</span>
                <span className="prize-desc">2º lugar: R$ 300</span>
              </div>
              <div className="prize-item">
                <span className="prize-medal">🥉</span>
                <span className="prize-desc">3º lugar: R$ 150</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .indicar-page {
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
          color: #C9A227;
          font-size: 14px;
          margin: 0;
        }

        .stats-card {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          color: #C9A227;
          font-size: 24px;
          font-weight: 700;
          display: block;
        }

        .stat-label {
          color: #888;
          font-size: 12px;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: #333;
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

        .code-card, .link-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .code-label, .link-label {
          color: #888;
          font-size: 12px;
          display: block;
          margin-bottom: 12px;
        }

        .code-display, .link-display {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .code {
          flex: 1;
          color: #C9A227;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 4px;
          text-align: center;
        }

        .link {
          flex: 1;
          color: #fff;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-copy {
          padding: 8px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          cursor: pointer;
        }

        .share-section {
          margin-bottom: 24px;
        }

        .share-section h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .share-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .share-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .share-btn.whatsapp {
          background: rgba(37, 211, 102, 0.1);
          color: #25D366;
        }

        .share-btn.telegram {
          background: rgba(0, 136, 204, 0.1);
          color: #0088CC;
        }

        .share-btn.sms {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .share-btn.more {
          background: rgba(136, 136, 136, 0.1);
          color: #888;
        }

        .share-btn:hover {
          transform: translateY(-2px);
        }

        .how-it-works {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .how-it-works h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #C9A227;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content {
          display: flex;
          flex-direction: column;
        }

        .step-title {
          color: #fff;
          font-weight: 500;
        }

        .step-desc {
          color: #888;
          font-size: 13px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-state svg {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 18px;
          margin: 0 0 8px;
        }

        .empty-state p {
          color: #888;
          font-size: 14px;
          margin: 0;
        }

        .referrals-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .referral-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .referral-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #C9A227 0%, #333 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
        }

        .referral-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .referral-name {
          color: #fff;
          font-weight: 500;
        }

        .referral-date {
          color: #888;
          font-size: 12px;
        }

        .referral-status {
          text-align: right;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .referral-bonus {
          display: block;
          color: #22C55E;
          font-size: 14px;
          font-weight: 600;
          margin-top: 4px;
        }

        .ranking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .ranking-header h3 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .ranking-period {
          color: #888;
          font-size: 12px;
        }

        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .ranking-item {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ranking-item.is-user {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .position {
          width: 40px;
          text-align: center;
        }

        .medal {
          font-size: 24px;
        }

        .position-number {
          color: #888;
          font-size: 18px;
          font-weight: 600;
        }

        .ranking-avatar {
          width: 44px;
          height: 44px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
        }

        .ranking-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ranking-name {
          color: #fff;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .you-badge {
          background: #C9A227;
          color: #000;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
        }

        .ranking-referrals {
          color: #888;
          font-size: 12px;
        }

        .ranking-prizes {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .ranking-prizes h4 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .prizes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .prize-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .prize-medal {
          font-size: 20px;
        }

        .prize-desc {
          color: #888;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default Indicar;
