import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const Perfil: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'documents'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    name: 'João da Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    cpf: '***.***.***-00',
    birthDate: '1990-05-15',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apt 501',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
  });

  const [securitySettings, setSecuritySettings] = useState({
    biometrics: true,
    faceId: false,
    twoFactor: true,
    loginNotifications: true,
  });

  const [documents] = useState([
    { id: '1', type: 'RG', status: 'verified', date: '2023-05-10' },
    { id: '2', type: 'CPF', status: 'verified', date: '2023-05-10' },
    { id: '3', type: 'Comprovante de Residência', status: 'pending', date: '2024-01-05' },
  ]);

  const handleSave = () => {
    showToast('Dados atualizados com sucesso!', 'success');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    showToast('Senha alterada com sucesso!', 'success');
    setShowChangePasswordModal(false);
  };

  const toggleSecurity = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    showToast('Configuração atualizada', 'success');
  };

  const getStatusInfo = (status: string) => {
    const info: Record<string, { label: string; color: string; bg: string }> = {
      verified: { label: 'Verificado', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
      pending: { label: 'Pendente', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
      rejected: { label: 'Rejeitado', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };
    return info[status];
  };

  return (
    <div className="perfil-page">
      <div className="page-header">
        <div className="profile-avatar">
          <span className="avatar-initials">JS</span>
          <button className="btn-edit-avatar" onClick={() => showToast('Alterar foto', 'info')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        </div>
        <h1>{userData.name}</h1>
        <p className="account-info">Conta Athena desde Jan 2023</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Dados Pessoais
        </button>
        <button
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Segurança
        </button>
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documentos
        </button>
      </div>

      {activeTab === 'personal' && (
        <div className="personal-section">
          <div className="section-header">
            <h2>Informações Pessoais</h2>
            {!isEditing ? (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Editar
              </button>
            ) : (
              <button className="btn-save" onClick={handleSave}>
                Salvar
              </button>
            )}
          </div>

          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Nome completo</span>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={e => setUserData({ ...userData, name: e.target.value })}
                />
              ) : (
                <span className="info-value">{userData.name}</span>
              )}
            </div>
            <div className="info-row">
              <span className="info-label">E-mail</span>
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={e => setUserData({ ...userData, email: e.target.value })}
                />
              ) : (
                <span className="info-value">{userData.email}</span>
              )}
            </div>
            <div className="info-row">
              <span className="info-label">Telefone</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={e => setUserData({ ...userData, phone: e.target.value })}
                />
              ) : (
                <span className="info-value">{userData.phone}</span>
              )}
            </div>
            <div className="info-row">
              <span className="info-label">CPF</span>
              <span className="info-value">{userData.cpf}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Data de nascimento</span>
              <span className="info-value">
                {new Date(userData.birthDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <div className="section-header">
            <h2>Endereço</h2>
          </div>

          <div className="info-card">
            <div className="info-row">
              <span className="info-label">Logradouro</span>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.address.street}
                  onChange={e => setUserData({
                    ...userData,
                    address: { ...userData.address, street: e.target.value }
                  })}
                />
              ) : (
                <span className="info-value">{userData.address.street}</span>
              )}
            </div>
            <div className="info-row-grid">
              <div className="info-item">
                <span className="info-label">Número</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.address.number}
                    onChange={e => setUserData({
                      ...userData,
                      address: { ...userData.address, number: e.target.value }
                    })}
                  />
                ) : (
                  <span className="info-value">{userData.address.number}</span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Complemento</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.address.complement}
                    onChange={e => setUserData({
                      ...userData,
                      address: { ...userData.address, complement: e.target.value }
                    })}
                  />
                ) : (
                  <span className="info-value">{userData.address.complement}</span>
                )}
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">Bairro</span>
              <span className="info-value">{userData.address.neighborhood}</span>
            </div>
            <div className="info-row-grid">
              <div className="info-item">
                <span className="info-label">Cidade</span>
                <span className="info-value">{userData.address.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado</span>
                <span className="info-value">{userData.address.state}</span>
              </div>
            </div>
            <div className="info-row">
              <span className="info-label">CEP</span>
              <span className="info-value">{userData.address.zipCode}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="security-section">
          <div className="security-card">
            <h3>Senha</h3>
            <p>Última alteração há 30 dias</p>
            <button className="btn-change-password" onClick={() => setShowChangePasswordModal(true)}>
              Alterar senha
            </button>
          </div>

          <div className="security-options">
            <div className="security-option">
              <div className="option-info">
                <div className="option-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div className="option-text">
                  <span className="option-name">Biometria</span>
                  <span className="option-desc">Use sua digital para acessar</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={securitySettings.biometrics}
                  onChange={() => toggleSecurity('biometrics')}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="security-option">
              <div className="option-info">
                <div className="option-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="option-text">
                  <span className="option-name">Face ID</span>
                  <span className="option-desc">Use seu rosto para acessar</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={securitySettings.faceId}
                  onChange={() => toggleSecurity('faceId')}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="security-option">
              <div className="option-info">
                <div className="option-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12" y2="18"/>
                  </svg>
                </div>
                <div className="option-text">
                  <span className="option-name">Autenticação em 2 fatores</span>
                  <span className="option-desc">Código SMS ao fazer login</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactor}
                  onChange={() => toggleSecurity('twoFactor')}
                />
                <span className="slider" />
              </label>
            </div>

            <div className="security-option">
              <div className="option-info">
                <div className="option-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <div className="option-text">
                  <span className="option-name">Notificações de login</span>
                  <span className="option-desc">Avise quando acessar de novo dispositivo</span>
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={securitySettings.loginNotifications}
                  onChange={() => toggleSecurity('loginNotifications')}
                />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="devices-card">
            <h3>Dispositivos conectados</h3>
            <div className="device-item active">
              <div className="device-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12" y2="18"/>
                </svg>
              </div>
              <div className="device-info">
                <span className="device-name">iPhone 14 Pro</span>
                <span className="device-location">São Paulo, SP • Ativo agora</span>
              </div>
              <span className="device-current">Este dispositivo</span>
            </div>
            <div className="device-item">
              <div className="device-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div className="device-info">
                <span className="device-name">MacBook Pro</span>
                <span className="device-location">São Paulo, SP • Há 2 dias</span>
              </div>
              <button className="btn-remove-device" onClick={() => showToast('Dispositivo removido', 'success')}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="documents-section">
          <div className="documents-list">
            {documents.map(doc => {
              const statusInfo = getStatusInfo(doc.status);
              return (
                <div key={doc.id} className="document-card">
                  <div className="document-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A227" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                  </div>
                  <div className="document-info">
                    <span className="document-type">{doc.type}</span>
                    <span className="document-date">
                      Enviado em {new Date(doc.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <span
                    className="document-status"
                    style={{ color: statusInfo.color, backgroundColor: statusInfo.bg }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              );
            })}
          </div>

          <button className="btn-upload" onClick={() => showToast('Selecionar documento', 'info')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17,8 12,3 7,8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Enviar novo documento
          </button>
        </div>
      )}

      {showChangePasswordModal && (
        <div className="modal-overlay" onClick={() => setShowChangePasswordModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Alterar Senha</h3>
              <button className="btn-close" onClick={() => setShowChangePasswordModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Senha atual</label>
                <input type="password" placeholder="Digite sua senha atual" />
              </div>
              <div className="form-group">
                <label>Nova senha</label>
                <input type="password" placeholder="Digite a nova senha" />
              </div>
              <div className="form-group">
                <label>Confirmar nova senha</label>
                <input type="password" placeholder="Confirme a nova senha" />
              </div>
              <div className="password-requirements">
                <span className="req-title">A senha deve conter:</span>
                <ul>
                  <li>Mínimo de 8 caracteres</li>
                  <li>Uma letra maiúscula</li>
                  <li>Uma letra minúscula</li>
                  <li>Um número</li>
                  <li>Um caractere especial</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowChangePasswordModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleChangePassword}>
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .perfil-page {
          padding: 20px;
          padding-bottom: 100px;
          background: #0D0D0D;
          min-height: 100vh;
        }

        .page-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #C9A227 0%, #333 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          position: relative;
        }

        .avatar-initials {
          color: #fff;
          font-size: 36px;
          font-weight: 600;
        }

        .btn-edit-avatar {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          background: #C9A227;
          border: 2px solid #0D0D0D;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          cursor: pointer;
        }

        .page-header h1 {
          color: #fff;
          font-size: 24px;
          margin: 0 0 4px;
        }

        .account-info {
          color: #888;
          font-size: 14px;
          margin: 0;
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

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h2 {
          color: #fff;
          font-size: 18px;
          margin: 0;
        }

        .btn-edit, .btn-save {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-edit {
          background: transparent;
          border: 1px solid #C9A227;
          color: #C9A227;
        }

        .btn-save {
          background: #C9A227;
          border: none;
          color: #000;
          font-weight: 500;
        }

        .info-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          color: #888;
          font-size: 12px;
        }

        .info-value {
          color: #fff;
          font-size: 14px;
        }

        .info-row input, .info-item input {
          background: #252525;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 8px 12px;
          color: #fff;
          font-size: 14px;
        }

        .info-row input:focus {
          border-color: #C9A227;
          outline: none;
        }

        .security-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: center;
        }

        .security-card h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 8px;
        }

        .security-card p {
          color: #888;
          font-size: 14px;
          margin: 0 0 16px;
        }

        .btn-change-password {
          padding: 12px 24px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .security-options {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 8px;
          margin-bottom: 24px;
        }

        .security-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #252525;
        }

        .security-option:last-child {
          border-bottom: none;
        }

        .option-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .option-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A227;
        }

        .option-text {
          display: flex;
          flex-direction: column;
        }

        .option-name {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .option-desc {
          color: #888;
          font-size: 12px;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 26px;
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

        .toggle input:checked + .slider {
          background: #C9A227;
        }

        .toggle input:checked + .slider:before {
          transform: translateX(22px);
        }

        .devices-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
        }

        .devices-card h3 {
          color: #fff;
          font-size: 16px;
          margin: 0 0 16px;
        }

        .device-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #252525;
        }

        .device-item:last-child {
          border-bottom: none;
        }

        .device-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .device-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .device-name {
          color: #fff;
          font-size: 14px;
        }

        .device-location {
          color: #888;
          font-size: 12px;
        }

        .device-current {
          color: #22C55E;
          font-size: 12px;
        }

        .btn-remove-device {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #EF4444;
          border-radius: 6px;
          color: #EF4444;
          font-size: 12px;
          cursor: pointer;
        }

        .documents-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .document-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .document-icon {
          width: 44px;
          height: 44px;
          background: #252525;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .document-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .document-type {
          color: #fff;
          font-weight: 500;
        }

        .document-date {
          color: #888;
          font-size: 12px;
        }

        .document-status {
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .btn-upload {
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
          transition: all 0.3s;
        }

        .btn-upload:hover {
          border-color: #C9A227;
          color: #C9A227;
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

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          background: #252525;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        }

        .form-group input:focus {
          border-color: #C9A227;
          outline: none;
        }

        .password-requirements {
          background: #252525;
          border-radius: 8px;
          padding: 16px;
        }

        .req-title {
          color: #888;
          font-size: 12px;
          display: block;
          margin-bottom: 8px;
        }

        .password-requirements ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .password-requirements li {
          color: #666;
          font-size: 12px;
          margin-bottom: 4px;
          padding-left: 16px;
          position: relative;
        }

        .password-requirements li:before {
          content: "•";
          position: absolute;
          left: 0;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #333;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: #C9A227;
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Perfil;
