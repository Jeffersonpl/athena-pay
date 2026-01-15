import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  push: boolean;
  email: boolean;
  sms: boolean;
}

const Notificacoes: React.FC = () => {
  const { showToast } = useToast();

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Transações',
      description: 'PIX, transferências, pagamentos e compras',
      push: true,
      email: true,
      sms: true,
    },
    {
      id: '2',
      title: 'Segurança',
      description: 'Login, alteração de senha e atividades suspeitas',
      push: true,
      email: true,
      sms: true,
    },
    {
      id: '3',
      title: 'Faturas e cobranças',
      description: 'Vencimento de fatura e débitos automáticos',
      push: true,
      email: true,
      sms: false,
    },
    {
      id: '4',
      title: 'Investimentos',
      description: 'Rendimentos, vencimentos e oportunidades',
      push: true,
      email: false,
      sms: false,
    },
    {
      id: '5',
      title: 'Programa de pontos',
      description: 'Pontos ganhos, expiração e recompensas',
      push: true,
      email: false,
      sms: false,
    },
    {
      id: '6',
      title: 'Ofertas e promoções',
      description: 'Cashback, descontos e parceiros',
      push: false,
      email: true,
      sms: false,
    },
    {
      id: '7',
      title: 'Novidades',
      description: 'Novos produtos e funcionalidades',
      push: false,
      email: true,
      sms: false,
    },
  ]);

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    start: '22:00',
    end: '08:00',
  });

  const toggleSetting = (id: string, channel: 'push' | 'email' | 'sms') => {
    setSettings(settings.map(s =>
      s.id === id ? { ...s, [channel]: !s[channel] } : s
    ));
    showToast('Preferência atualizada', 'success');
  };

  const toggleAll = (channel: 'push' | 'email' | 'sms', value: boolean) => {
    setSettings(settings.map(s => ({ ...s, [channel]: value })));
    showToast(`Todas as notificações ${channel === 'push' ? 'push' : channel === 'email' ? 'por e-mail' : 'por SMS'} ${value ? 'ativadas' : 'desativadas'}`, 'success');
  };

  const allPush = settings.every(s => s.push);
  const allEmail = settings.every(s => s.email);
  const allSms = settings.every(s => s.sms);

  return (
    <div className="notificacoes-page">
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <h1>Notificações</h1>
        <p>Configure como deseja receber alertas</p>
      </div>

      <div className="quick-actions">
        <div className="quick-action">
          <div className="action-info">
            <div className="action-icon push">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              </svg>
            </div>
            <span>Push</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={allPush}
              onChange={() => toggleAll('push', !allPush)}
            />
            <span className="slider" />
          </label>
        </div>
        <div className="quick-action">
          <div className="action-info">
            <div className="action-icon email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <span>E-mail</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={allEmail}
              onChange={() => toggleAll('email', !allEmail)}
            />
            <span className="slider" />
          </label>
        </div>
        <div className="quick-action">
          <div className="action-info">
            <div className="action-icon sms">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span>SMS</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={allSms}
              onChange={() => toggleAll('sms', !allSms)}
            />
            <span className="slider" />
          </label>
        </div>
      </div>

      <div className="settings-list">
        {settings.map(setting => (
          <div key={setting.id} className="setting-card">
            <div className="setting-header">
              <span className="setting-title">{setting.title}</span>
              <span className="setting-desc">{setting.description}</span>
            </div>
            <div className="setting-toggles">
              <div className="toggle-item">
                <span className="toggle-label">Push</span>
                <label className="toggle small">
                  <input
                    type="checkbox"
                    checked={setting.push}
                    onChange={() => toggleSetting(setting.id, 'push')}
                  />
                  <span className="slider" />
                </label>
              </div>
              <div className="toggle-item">
                <span className="toggle-label">E-mail</span>
                <label className="toggle small">
                  <input
                    type="checkbox"
                    checked={setting.email}
                    onChange={() => toggleSetting(setting.id, 'email')}
                  />
                  <span className="slider" />
                </label>
              </div>
              <div className="toggle-item">
                <span className="toggle-label">SMS</span>
                <label className="toggle small">
                  <input
                    type="checkbox"
                    checked={setting.sms}
                    onChange={() => toggleSetting(setting.id, 'sms')}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="quiet-hours-card">
        <div className="quiet-header">
          <div className="quiet-info">
            <div className="quiet-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </div>
            <div className="quiet-text">
              <span className="quiet-title">Horário de silêncio</span>
              <span className="quiet-desc">Pausar notificações push durante a noite</span>
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={quietHours.enabled}
              onChange={() => setQuietHours({ ...quietHours, enabled: !quietHours.enabled })}
            />
            <span className="slider" />
          </label>
        </div>
        {quietHours.enabled && (
          <div className="quiet-times">
            <div className="time-input">
              <label>Início</label>
              <input
                type="time"
                value={quietHours.start}
                onChange={e => setQuietHours({ ...quietHours, start: e.target.value })}
              />
            </div>
            <div className="time-separator">até</div>
            <div className="time-input">
              <label>Fim</label>
              <input
                type="time"
                value={quietHours.end}
                onChange={e => setQuietHours({ ...quietHours, end: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="info-card">
        <div className="info-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <p>
          Notificações de segurança sempre serão enviadas por todos os canais,
          independente das suas preferências.
        </p>
      </div>

      <style>{`
        .notificacoes-page {
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

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .quick-action {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .action-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .action-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-icon.push {
          background: rgba(201, 162, 39, 0.1);
          color: #C9A227;
        }

        .action-icon.email {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
        }

        .action-icon.sms {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .action-info span {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
        }

        .toggle.small {
          width: 40px;
          height: 22px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #333;
          border-radius: 26px;
          transition: 0.3s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: #fff;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle.small .slider:before {
          height: 16px;
          width: 16px;
        }

        .toggle input:checked + .slider {
          background: #C9A227;
        }

        .toggle input:checked + .slider:before {
          transform: translateX(22px);
        }

        .toggle.small input:checked + .slider:before {
          transform: translateX(18px);
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .setting-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
        }

        .setting-header {
          margin-bottom: 16px;
        }

        .setting-title {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .setting-desc {
          color: #888;
          font-size: 13px;
        }

        .setting-toggles {
          display: flex;
          gap: 24px;
        }

        .toggle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .toggle-label {
          color: #888;
          font-size: 12px;
        }

        .quiet-hours-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .quiet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quiet-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quiet-icon {
          width: 48px;
          height: 48px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quiet-text {
          display: flex;
          flex-direction: column;
        }

        .quiet-title {
          color: #fff;
          font-size: 16px;
          font-weight: 500;
        }

        .quiet-desc {
          color: #888;
          font-size: 13px;
        }

        .quiet-times {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #333;
        }

        .time-input {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .time-input label {
          color: #888;
          font-size: 12px;
        }

        .time-input input {
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
        }

        .time-input input:focus {
          border-color: #C9A227;
          outline: none;
        }

        .time-separator {
          color: #888;
          font-size: 14px;
          padding-top: 20px;
        }

        .info-card {
          background: rgba(201, 162, 39, 0.1);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .info-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-card p {
          color: #C9A227;
          font-size: 13px;
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default Notificacoes;
