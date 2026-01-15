import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../ui/Toast';

interface VirtualCard {
  id: string;
  name: string;
  lastFour: string;
  type: 'standard' | 'temporary' | 'subscription';
  status: 'active' | 'blocked' | 'expired';
  limit: number;
  used: number;
  expiresAt?: string;
  createdAt: string;
  color: string;
}

const Virtual: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState<VirtualCard | null>(null);
  const [newCardName, setNewCardName] = useState('');
  const [newCardType, setNewCardType] = useState<'standard' | 'temporary' | 'subscription'>('standard');
  const [newCardLimit, setNewCardLimit] = useState('');
  const [showNumber, setShowNumber] = useState<string | null>(null);

  const [cards, setCards] = useState<VirtualCard[]>([
    { id: '1', name: 'Compras Online', lastFour: '4521', type: 'standard', status: 'active', limit: 2000, used: 450.80, createdAt: '2024-01-15', color: '#C9A227' },
    { id: '2', name: 'Cartão Temporário', lastFour: '8734', type: 'temporary', status: 'active', limit: 500, used: 0, expiresAt: '2024-02-15', createdAt: '2024-01-20', color: '#3B82F6' },
    { id: '3', name: 'Assinaturas', lastFour: '2198', type: 'subscription', status: 'active', limit: 1000, used: 289.90, createdAt: '2024-01-10', color: '#8B5CF6' },
    { id: '4', name: 'Uso único', lastFour: '6543', type: 'temporary', status: 'expired', limit: 200, used: 199.99, expiresAt: '2024-01-18', createdAt: '2024-01-17', color: '#EF4444' },
  ]);

  const activeCards = cards.filter(c => c.status === 'active');
  const totalLimit = activeCards.reduce((acc, c) => acc + c.limit, 0);
  const totalUsed = activeCards.reduce((acc, c) => acc + c.used, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const getCardTypeName = (type: string) => {
    switch (type) {
      case 'standard': return 'Padrão';
      case 'temporary': return 'Temporário';
      case 'subscription': return 'Assinaturas';
      default: return type;
    }
  };

  const getCardTypeDescription = (type: string) => {
    switch (type) {
      case 'standard': return 'Cartão virtual permanente para compras online';
      case 'temporary': return 'Uso único ou com prazo de validade';
      case 'subscription': return 'Ideal para serviços recorrentes';
      default: return '';
    }
  };

  const handleCreateCard = () => {
    if (!newCardName.trim()) {
      showToast('Digite um nome para o cartão', 'error');
      return;
    }
    const limit = parseFloat(newCardLimit.replace(/\D/g, '')) / 100;
    if (!limit || limit < 50) {
      showToast('Limite mínimo: R$ 50,00', 'error');
      return;
    }

    const newCard: VirtualCard = {
      id: Date.now().toString(),
      name: newCardName,
      lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
      type: newCardType,
      status: 'active',
      limit: limit,
      used: 0,
      expiresAt: newCardType === 'temporary' ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      color: newCardType === 'standard' ? '#C9A227' : newCardType === 'temporary' ? '#3B82F6' : '#8B5CF6',
    };

    setCards([newCard, ...cards]);
    showToast('Cartão virtual criado com sucesso!', 'success');
    setShowCreateModal(false);
    setNewCardName('');
    setNewCardLimit('');
    setNewCardType('standard');
  };

  const handleToggleStatus = (card: VirtualCard) => {
    const newStatus = card.status === 'active' ? 'blocked' : 'active';
    setCards(cards.map(c => c.id === card.id ? { ...c, status: newStatus } : c));
    showToast(newStatus === 'active' ? 'Cartão desbloqueado!' : 'Cartão bloqueado!', 'success');
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(c => c.id !== cardId));
    setShowCardDetails(null);
    showToast('Cartão excluído com sucesso!', 'success');
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(value) / 100;
    setNewCardLimit(numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  return (
    <div className="virtual-cards-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/cards')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-content">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <div>
            <h1>Cartões Virtuais</h1>
            <p>Gerencie seus cartões online</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="summary-section">
        <div className="summary-card">
          <div className="summary-row">
            <div className="summary-item">
              <span className="label">Cartões ativos</span>
              <span className="value">{activeCards.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Limite total</span>
              <span className="value">{formatCurrency(totalLimit)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Utilizado</span>
              <span className="value">{formatCurrency(totalUsed)}</span>
            </div>
          </div>
          <div className="usage-bar">
            <div className="usage-fill" style={{ width: `${(totalUsed / totalLimit) * 100}%` }}/>
          </div>
          <span className="usage-text">{((totalUsed / totalLimit) * 100).toFixed(0)}% do limite utilizado</span>
        </div>
      </div>

      {/* Create Button */}
      <div className="create-section">
        <button className="create-btn" onClick={() => setShowCreateModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Criar novo cartão virtual
        </button>
      </div>

      {/* Cards List */}
      <div className="cards-section">
        <h3>Meus cartões virtuais</h3>
        <div className="cards-list">
          {cards.map(card => (
            <div key={card.id} className={`card-item ${card.status}`} onClick={() => setShowCardDetails(card)}>
              <div className="card-visual" style={{ background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}80 100%)` }}>
                <div className="card-chip">
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                    <rect x="0" y="0" width="24" height="18" rx="2" fill="#FFD700" opacity="0.8"/>
                    <line x1="0" y1="6" x2="24" y2="6" stroke="#B8860B" strokeWidth="1"/>
                    <line x1="0" y1="12" x2="24" y2="12" stroke="#B8860B" strokeWidth="1"/>
                    <line x1="8" y1="0" x2="8" y2="18" stroke="#B8860B" strokeWidth="1"/>
                    <line x1="16" y1="0" x2="16" y2="18" stroke="#B8860B" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="card-number">•••• •••• •••• {card.lastFour}</div>
                <div className="card-name-display">{card.name}</div>
              </div>

              <div className="card-info">
                <div className="card-header">
                  <span className="card-type-badge" data-type={card.type}>{getCardTypeName(card.type)}</span>
                  <span className={`card-status ${card.status}`}>
                    {card.status === 'active' ? 'Ativo' : card.status === 'blocked' ? 'Bloqueado' : 'Expirado'}
                  </span>
                </div>

                <div className="card-limits">
                  <div className="limit-bar">
                    <div className="limit-fill" style={{ width: `${(card.used / card.limit) * 100}%` }}/>
                  </div>
                  <div className="limit-text">
                    <span>{formatCurrency(card.used)} de {formatCurrency(card.limit)}</span>
                    <span className="available">Disponível: {formatCurrency(card.limit - card.used)}</span>
                  </div>
                </div>

                {card.expiresAt && (
                  <div className="card-expiry">
                    {new Date(card.expiresAt) > new Date() ? (
                      <span>Expira em {new Date(card.expiresAt).toLocaleDateString('pt-BR')}</span>
                    ) : (
                      <span className="expired">Expirado em {new Date(card.expiresAt).toLocaleDateString('pt-BR')}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Criar cartão virtual</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {/* Card Type Selection */}
              <div className="type-selection">
                <label>Tipo do cartão</label>
                <div className="type-options">
                  {(['standard', 'temporary', 'subscription'] as const).map(type => (
                    <div
                      key={type}
                      className={`type-option ${newCardType === type ? 'active' : ''}`}
                      onClick={() => setNewCardType(type)}
                    >
                      <div className="type-icon" data-type={type}>
                        {type === 'standard' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2"/>
                            <line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                        )}
                        {type === 'temporary' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                        )}
                        {type === 'subscription' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                        )}
                      </div>
                      <span className="type-name">{getCardTypeName(type)}</span>
                      <span className="type-desc">{getCardTypeDescription(type)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Name */}
              <div className="form-group">
                <label>Nome do cartão</label>
                <input
                  type="text"
                  value={newCardName}
                  onChange={e => setNewCardName(e.target.value)}
                  placeholder="Ex: Compras Online, Netflix, etc."
                  maxLength={20}
                />
              </div>

              {/* Card Limit */}
              <div className="form-group">
                <label>Limite do cartão</label>
                <div className="amount-input">
                  <span className="currency">R$</span>
                  <input
                    type="text"
                    value={newCardLimit}
                    onChange={handleLimitChange}
                    placeholder="0,00"
                  />
                </div>
                <span className="helper">Mínimo: R$ 50,00</span>
              </div>

              <button className="create-card-btn" onClick={handleCreateCard}>
                Criar cartão virtual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Details Modal */}
      {showCardDetails && (
        <div className="modal-overlay" onClick={() => setShowCardDetails(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do cartão</h2>
              <button className="close-btn" onClick={() => setShowCardDetails(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {/* Card Preview */}
              <div className="card-preview" style={{ background: `linear-gradient(135deg, ${showCardDetails.color} 0%, ${showCardDetails.color}80 100%)` }}>
                <div className="card-brand">ATHENA PAY</div>
                <div className="card-chip-large">
                  <svg width="36" height="27" viewBox="0 0 24 18" fill="none">
                    <rect x="0" y="0" width="24" height="18" rx="2" fill="#FFD700" opacity="0.8"/>
                    <line x1="0" y1="6" x2="24" y2="6" stroke="#B8860B" strokeWidth="1"/>
                    <line x1="0" y1="12" x2="24" y2="12" stroke="#B8860B" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="card-number-full">
                  {showNumber === showCardDetails.id
                    ? `4532 8765 ${Math.floor(1000 + Math.random() * 9000)} ${showCardDetails.lastFour}`
                    : `•••• •••• •••• ${showCardDetails.lastFour}`
                  }
                </div>
                <div className="card-footer">
                  <div>
                    <span className="card-label">NOME</span>
                    <span className="card-value">{showCardDetails.name.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="card-label">VALIDADE</span>
                    <span className="card-value">12/28</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card-actions">
                <button className="action-btn" onClick={() => setShowNumber(showNumber === showCardDetails.id ? null : showCardDetails.id)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showNumber === showCardDetails.id ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M1 1l22 22"/>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </>
                    )}
                  </svg>
                  {showNumber === showCardDetails.id ? 'Ocultar número' : 'Ver número'}
                </button>
                <button className="action-btn" onClick={() => { navigator.clipboard.writeText(`4532 8765 ${Math.floor(1000 + Math.random() * 9000)} ${showCardDetails.lastFour}`); showToast('Número copiado!', 'success'); }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copiar dados
                </button>
              </div>

              {/* Card Info */}
              <div className="card-info-details">
                <div className="info-row">
                  <span>Tipo</span>
                  <span>{getCardTypeName(showCardDetails.type)}</span>
                </div>
                <div className="info-row">
                  <span>Status</span>
                  <span className={`status ${showCardDetails.status}`}>
                    {showCardDetails.status === 'active' ? 'Ativo' : showCardDetails.status === 'blocked' ? 'Bloqueado' : 'Expirado'}
                  </span>
                </div>
                <div className="info-row">
                  <span>Limite</span>
                  <span>{formatCurrency(showCardDetails.limit)}</span>
                </div>
                <div className="info-row">
                  <span>Utilizado</span>
                  <span>{formatCurrency(showCardDetails.used)}</span>
                </div>
                <div className="info-row">
                  <span>Disponível</span>
                  <span className="available">{formatCurrency(showCardDetails.limit - showCardDetails.used)}</span>
                </div>
                <div className="info-row">
                  <span>Criado em</span>
                  <span>{new Date(showCardDetails.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="control-buttons">
                {showCardDetails.status !== 'expired' && (
                  <button
                    className={`control-btn ${showCardDetails.status === 'active' ? 'block' : 'unblock'}`}
                    onClick={() => handleToggleStatus(showCardDetails)}
                  >
                    {showCardDetails.status === 'active' ? 'Bloquear cartão' : 'Desbloquear cartão'}
                  </button>
                )}
                <button className="control-btn delete" onClick={() => handleDeleteCard(showCardDetails.id)}>
                  Excluir cartão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .virtual-cards-page {
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
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 14px;
          color: #C9A227;
        }

        .header-content h1 { font-size: 18px; font-weight: 700; color: #fff; margin: 0; }
        .header-content p { font-size: 13px; color: #A3A3A3; margin: 0; }

        .summary-section { padding: 20px; }
        .summary-card {
          background: linear-gradient(135deg, #1A1A1A 0%, #262626 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 16px;
          padding: 20px;
        }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
        .summary-item { display: flex; flex-direction: column; gap: 4px; }
        .summary-item .label { font-size: 12px; color: #666; }
        .summary-item .value { font-size: 16px; font-weight: 600; color: #fff; }
        .usage-bar { height: 6px; background: #333; border-radius: 3px; margin-bottom: 8px; }
        .usage-fill { height: 100%; background: #C9A227; border-radius: 3px; transition: width 0.3s; }
        .usage-text { font-size: 12px; color: #666; }

        .create-section { padding: 0 20px; }
        .create-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: linear-gradient(135deg, #C9A227 0%, #E5B82A 100%);
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #000;
          cursor: pointer;
        }

        .cards-section { padding: 20px; }
        .cards-section h3 { font-size: 16px; font-weight: 600; color: #fff; margin: 0 0 16px; }
        .cards-list { display: flex; flex-direction: column; gap: 16px; }

        .card-item {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        .card-item:hover { border-color: #C9A227; }
        .card-item.blocked { opacity: 0.6; }
        .card-item.expired { opacity: 0.5; }

        .card-visual {
          padding: 20px;
          position: relative;
          min-height: 100px;
        }
        .card-chip { position: absolute; top: 20px; left: 20px; }
        .card-number { position: absolute; bottom: 40px; left: 20px; font-size: 16px; font-weight: 600; color: #fff; letter-spacing: 2px; }
        .card-name-display { position: absolute; bottom: 20px; left: 20px; font-size: 12px; color: rgba(255,255,255,0.8); text-transform: uppercase; }

        .card-info { padding: 16px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .card-type-badge {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }
        .card-type-badge[data-type="standard"] { background: rgba(201, 162, 39, 0.15); color: #C9A227; }
        .card-type-badge[data-type="temporary"] { background: rgba(59, 130, 246, 0.15); color: #3B82F6; }
        .card-type-badge[data-type="subscription"] { background: rgba(139, 92, 246, 0.15); color: #8B5CF6; }

        .card-status { font-size: 12px; font-weight: 500; }
        .card-status.active { color: #22C55E; }
        .card-status.blocked { color: #F59E0B; }
        .card-status.expired { color: #EF4444; }

        .card-limits { margin-bottom: 12px; }
        .limit-bar { height: 4px; background: #333; border-radius: 2px; margin-bottom: 8px; }
        .limit-fill { height: 100%; background: #C9A227; border-radius: 2px; }
        .limit-text { display: flex; justify-content: space-between; font-size: 12px; color: #A3A3A3; }
        .limit-text .available { color: #22C55E; }

        .card-expiry { font-size: 12px; color: #666; }
        .card-expiry .expired { color: #EF4444; }

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

        .type-selection { margin-bottom: 24px; }
        .type-selection label { display: block; font-size: 14px; color: #A3A3A3; margin-bottom: 12px; }
        .type-options { display: flex; flex-direction: column; gap: 12px; }
        .type-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .type-option.active { border-color: #C9A227; background: rgba(201, 162, 39, 0.1); }
        .type-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #333; border-radius: 10px; }
        .type-icon[data-type="standard"] { color: #C9A227; }
        .type-icon[data-type="temporary"] { color: #3B82F6; }
        .type-icon[data-type="subscription"] { color: #8B5CF6; }
        .type-name { font-size: 14px; font-weight: 600; color: #fff; }
        .type-desc { flex: 1; font-size: 12px; color: #666; text-align: right; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 14px; color: #A3A3A3; margin-bottom: 8px; }
        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          font-size: 16px;
          color: #fff;
          outline: none;
        }
        .form-group input::placeholder { color: #666; }
        .amount-input {
          display: flex;
          align-items: center;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          gap: 8px;
        }
        .amount-input .currency { font-size: 16px; color: #666; }
        .amount-input input { padding: 0; border: none; background: none; }
        .helper { display: block; font-size: 12px; color: #666; margin-top: 6px; }

        .create-card-btn {
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

        .card-preview {
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          position: relative;
          min-height: 180px;
        }
        .card-brand { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.9); letter-spacing: 2px; }
        .card-chip-large { margin: 20px 0; }
        .card-number-full { font-size: 20px; font-weight: 600; color: #fff; letter-spacing: 3px; margin-bottom: 20px; }
        .card-footer { display: flex; justify-content: space-between; }
        .card-label { display: block; font-size: 10px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
        .card-value { font-size: 12px; font-weight: 600; color: #fff; }

        .card-actions { display: flex; gap: 12px; margin-bottom: 20px; }
        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 10px;
          font-size: 13px;
          color: #fff;
          cursor: pointer;
        }

        .card-info-details {
          background: #262626;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #333;
        }
        .info-row:last-child { border-bottom: none; }
        .info-row span:first-child { font-size: 14px; color: #A3A3A3; }
        .info-row span:last-child { font-size: 14px; font-weight: 500; color: #fff; }
        .info-row .status.active { color: #22C55E; }
        .info-row .status.blocked { color: #F59E0B; }
        .info-row .status.expired { color: #EF4444; }
        .info-row .available { color: #22C55E; }

        .control-buttons { display: flex; flex-direction: column; gap: 12px; }
        .control-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .control-btn.block { background: #F59E0B; border: none; color: #000; }
        .control-btn.unblock { background: #22C55E; border: none; color: #fff; }
        .control-btn.delete { background: transparent; border: 1px solid #EF4444; color: #EF4444; }
      `}</style>
    </div>
  );
};

export default Virtual;
