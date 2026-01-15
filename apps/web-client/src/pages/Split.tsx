import React, { useState } from 'react';
import { useToast } from '../ui/Toast';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  paid: boolean;
  pixKey?: string;
}

interface SplitGroup {
  id: string;
  name: string;
  total: number;
  participants: Participant[];
  createdAt: string;
  status: 'active' | 'completed';
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function Split() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const [groups, setGroups] = useState<SplitGroup[]>([
    {
      id: '1',
      name: 'Jantar Sexta',
      total: 450,
      createdAt: '2025-01-10',
      status: 'active',
      participants: [
        { id: '1', name: 'Você', avatar: 'V', amount: 112.5, paid: true },
        { id: '2', name: 'Maria', avatar: 'M', amount: 112.5, paid: true, pixKey: 'maria@email.com' },
        { id: '3', name: 'João', avatar: 'J', amount: 112.5, paid: false, pixKey: '11999887766' },
        { id: '4', name: 'Ana', avatar: 'A', amount: 112.5, paid: false, pixKey: 'ana.silva@gmail.com' },
      ],
    },
    {
      id: '2',
      name: 'Viagem Praia',
      total: 1200,
      createdAt: '2025-01-05',
      status: 'completed',
      participants: [
        { id: '1', name: 'Você', avatar: 'V', amount: 400, paid: true },
        { id: '2', name: 'Carlos', avatar: 'C', amount: 400, paid: true, pixKey: '***.***.***-12' },
        { id: '3', name: 'Pedro', avatar: 'P', amount: 400, paid: true, pixKey: 'pedro@email.com' },
      ],
    },
  ]);

  const [newSplit, setNewSplit] = useState({
    name: '',
    total: '',
    participants: [{ name: '', pixKey: '' }],
    divisionType: 'equal' as 'equal' | 'custom',
  });

  const handleAddParticipant = () => {
    setNewSplit({
      ...newSplit,
      participants: [...newSplit.participants, { name: '', pixKey: '' }],
    });
  };

  const handleRemoveParticipant = (index: number) => {
    if (newSplit.participants.length > 1) {
      setNewSplit({
        ...newSplit,
        participants: newSplit.participants.filter((_, i) => i !== index),
      });
    }
  };

  const handleCreateSplit = () => {
    if (!newSplit.name || !newSplit.total) {
      showToast('error', 'Preencha nome e valor total');
      return;
    }

    const validParticipants = newSplit.participants.filter(p => p.name);
    if (validParticipants.length === 0) {
      showToast('error', 'Adicione pelo menos um participante');
      return;
    }

    const total = parseFloat(newSplit.total);
    const perPerson = total / (validParticipants.length + 1); // +1 for "Você"

    const group: SplitGroup = {
      id: Date.now().toString(),
      name: newSplit.name,
      total,
      createdAt: new Date().toISOString(),
      status: 'active',
      participants: [
        { id: '0', name: 'Você', avatar: 'V', amount: perPerson, paid: true },
        ...validParticipants.map((p, i) => ({
          id: (i + 1).toString(),
          name: p.name,
          avatar: p.name.charAt(0).toUpperCase(),
          amount: perPerson,
          paid: false,
          pixKey: p.pixKey,
        })),
      ],
    };

    setGroups([group, ...groups]);
    setNewSplit({ name: '', total: '', participants: [{ name: '', pixKey: '' }], divisionType: 'equal' });
    setShowModal(false);
    showToast('success', 'Divisão criada! Cobranças enviadas.');
  };

  const handleMarkPaid = (groupId: string, participantId: string) => {
    setGroups(groups.map(g => {
      if (g.id === groupId) {
        const updatedParticipants = g.participants.map(p =>
          p.id === participantId ? { ...p, paid: true } : p
        );
        const allPaid = updatedParticipants.every(p => p.paid);
        return { ...g, participants: updatedParticipants, status: allPaid ? 'completed' : 'active' };
      }
      return g;
    }));
    showToast('success', 'Marcado como pago!');
  };

  const handleSendReminder = (participant: Participant) => {
    showToast('info', `Lembrete enviado para ${participant.name}`);
  };

  const selectedGroup = groups.find(g => g.id === activeGroup);

  return (
    <div className="split-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <h1>Dividir Contas</h1>
        <p>Racha a conta com seus amigos</p>
      </div>

      {!activeGroup ? (
        <>
          {/* Active Splits */}
          <div className="section">
            <div className="section-header">
              <h3>Divisões ativas</h3>
              <span className="badge">{groups.filter(g => g.status === 'active').length}</span>
            </div>

            {groups.filter(g => g.status === 'active').length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <p>Nenhuma divisão ativa</p>
              </div>
            ) : (
              <div className="splits-list">
                {groups.filter(g => g.status === 'active').map(group => {
                  const paidCount = group.participants.filter(p => p.paid).length;
                  const progress = (paidCount / group.participants.length) * 100;

                  return (
                    <button
                      key={group.id}
                      className="split-card"
                      onClick={() => setActiveGroup(group.id)}
                    >
                      <div className="split-header">
                        <h4>{group.name}</h4>
                        <span className="split-total">{formatCurrency(group.total)}</span>
                      </div>

                      <div className="split-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="progress-text">
                          {paidCount}/{group.participants.length} pagaram
                        </span>
                      </div>

                      <div className="split-avatars">
                        {group.participants.slice(0, 5).map(p => (
                          <div
                            key={p.id}
                            className={`avatar ${p.paid ? 'paid' : ''}`}
                            title={p.name}
                          >
                            {p.avatar}
                          </div>
                        ))}
                        {group.participants.length > 5 && (
                          <div className="avatar more">+{group.participants.length - 5}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed Splits */}
          {groups.filter(g => g.status === 'completed').length > 0 && (
            <div className="section">
              <div className="section-header">
                <h3>Concluídas</h3>
              </div>
              <div className="splits-list">
                {groups.filter(g => g.status === 'completed').map(group => (
                  <button
                    key={group.id}
                    className="split-card completed"
                    onClick={() => setActiveGroup(group.id)}
                  >
                    <div className="split-header">
                      <h4>{group.name}</h4>
                      <span className="split-total">{formatCurrency(group.total)}</span>
                    </div>
                    <div className="completed-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Todos pagaram
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Button */}
          <button className="btn-add" onClick={() => setShowModal(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova divisão
          </button>
        </>
      ) : (
        /* Group Detail */
        <div className="group-detail">
          <button className="btn-back" onClick={() => setActiveGroup(null)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>

          <div className="detail-header">
            <h2>{selectedGroup?.name}</h2>
            <span className="detail-date">
              {selectedGroup && new Date(selectedGroup.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="detail-summary">
            <div className="summary-item">
              <span className="label">Total</span>
              <span className="value gold">{formatCurrency(selectedGroup?.total || 0)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Por pessoa</span>
              <span className="value">
                {formatCurrency((selectedGroup?.total || 0) / (selectedGroup?.participants.length || 1))}
              </span>
            </div>
          </div>

          <div className="participants-section">
            <h3>Participantes</h3>
            <div className="participants-list">
              {selectedGroup?.participants.map(participant => (
                <div key={participant.id} className={`participant-card ${participant.paid ? 'paid' : ''}`}>
                  <div className="participant-avatar" style={{ background: participant.paid ? '#22C55E' : '#C9A227' }}>
                    {participant.avatar}
                  </div>
                  <div className="participant-info">
                    <span className="participant-name">
                      {participant.name}
                      {participant.name === 'Você' && <span className="you-badge">você</span>}
                    </span>
                    {participant.pixKey && (
                      <span className="participant-key">{participant.pixKey}</span>
                    )}
                  </div>
                  <div className="participant-status">
                    <span className="participant-amount">{formatCurrency(participant.amount)}</span>
                    {participant.paid ? (
                      <span className="status-paid">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Pago
                      </span>
                    ) : (
                      <span className="status-pending">Pendente</span>
                    )}
                  </div>
                  {!participant.paid && participant.name !== 'Você' && (
                    <div className="participant-actions">
                      <button
                        className="btn-mark-paid"
                        onClick={() => handleMarkPaid(selectedGroup!.id, participant.id)}
                      >
                        Marcar pago
                      </button>
                      <button
                        className="btn-reminder"
                        onClick={() => handleSendReminder(participant)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 2L11 13" />
                          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="btn-share">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Compartilhar link de cobrança
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Divisão</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nome da divisão</label>
                <input
                  type="text"
                  placeholder="Ex: Jantar de aniversário"
                  value={newSplit.name}
                  onChange={e => setNewSplit({ ...newSplit, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Valor total</label>
                <div className="amount-input">
                  <span>R$</span>
                  <input
                    type="number"
                    placeholder="0,00"
                    value={newSplit.total}
                    onChange={e => setNewSplit({ ...newSplit, total: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Participantes (além de você)</label>
                {newSplit.participants.map((p, index) => (
                  <div key={index} className="participant-input">
                    <input
                      type="text"
                      placeholder="Nome"
                      value={p.name}
                      onChange={e => {
                        const updated = [...newSplit.participants];
                        updated[index].name = e.target.value;
                        setNewSplit({ ...newSplit, participants: updated });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Chave PIX (opcional)"
                      value={p.pixKey}
                      onChange={e => {
                        const updated = [...newSplit.participants];
                        updated[index].pixKey = e.target.value;
                        setNewSplit({ ...newSplit, participants: updated });
                      }}
                    />
                    {newSplit.participants.length > 1 && (
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveParticipant(index)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button className="btn-add-participant" onClick={handleAddParticipant}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Adicionar participante
                </button>
              </div>

              {newSplit.total && newSplit.participants.filter(p => p.name).length > 0 && (
                <div className="preview-card">
                  <span className="preview-label">Valor por pessoa</span>
                  <span className="preview-value">
                    {formatCurrency(parseFloat(newSplit.total) / (newSplit.participants.filter(p => p.name).length + 1))}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleCreateSplit}>
                Criar e Cobrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .split-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding: 24px 20px 100px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 32px;
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

        /* Section */
        .section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .section-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0;
        }

        .badge {
          padding: 4px 10px;
          background: rgba(201, 162, 39, 0.15);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #C9A227;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 16px;
        }

        .empty-icon {
          color: #333;
          margin-bottom: 12px;
        }

        .empty-state p {
          color: #666;
          margin: 0;
        }

        /* Splits List */
        .splits-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .split-card {
          width: 100%;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .split-card:hover {
          border-color: #C9A227;
        }

        .split-card.completed {
          opacity: 0.7;
        }

        .split-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .split-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .split-total {
          font-size: 18px;
          font-weight: 700;
          color: #C9A227;
        }

        .split-progress {
          margin-bottom: 16px;
        }

        .progress-bar {
          height: 6px;
          background: #262626;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A227, #22C55E);
          border-radius: 3px;
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 12px;
          color: #666;
        }

        .split-avatars {
          display: flex;
          gap: -8px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border: 2px solid #1A1A1A;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          margin-left: -8px;
        }

        .avatar:first-child {
          margin-left: 0;
        }

        .avatar.paid {
          background: #22C55E;
          color: #fff;
        }

        .avatar.more {
          background: #333;
          color: #A3A3A3;
        }

        .completed-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #22C55E;
        }

        /* Add Button */
        .btn-add {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 18px 24px;
          background: transparent;
          border: 2px dashed #333;
          border-radius: 16px;
          color: #C9A227;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-add:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* Group Detail */
        .group-detail {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 10px;
          color: #A3A3A3;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .detail-header {
          margin-bottom: 20px;
        }

        .detail-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .detail-date {
          font-size: 13px;
          color: #666;
        }

        .detail-summary {
          display: flex;
          gap: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .summary-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-item .label {
          font-size: 12px;
          color: #666;
        }

        .summary-item .value {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .summary-item .value.gold {
          color: #C9A227;
        }

        .participants-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 16px;
        }

        .participants-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .participant-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px;
        }

        .participant-card.paid {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .participant-card {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .participant-avatar {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          color: #0D0D0D;
        }

        .participant-info {
          flex: 1;
          min-width: 120px;
        }

        .participant-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .you-badge {
          font-size: 10px;
          padding: 2px 8px;
          background: rgba(201, 162, 39, 0.2);
          border-radius: 10px;
          color: #C9A227;
        }

        .participant-key {
          display: block;
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }

        .participant-status {
          text-align: right;
        }

        .participant-amount {
          display: block;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }

        .status-paid {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #22C55E;
          margin-top: 4px;
        }

        .status-pending {
          font-size: 12px;
          color: #F59E0B;
          margin-top: 4px;
        }

        .participant-actions {
          width: 100%;
          display: flex;
          gap: 8px;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid #262626;
        }

        .btn-mark-paid {
          flex: 1;
          padding: 10px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 10px;
          color: #22C55E;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-reminder {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #333;
          border-radius: 10px;
          color: #C9A227;
          cursor: pointer;
        }

        .btn-share {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
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
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #333;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        .form-group input:focus {
          border-color: #C9A227;
        }

        .amount-input {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
        }

        .amount-input span {
          font-size: 18px;
          color: #666;
        }

        .amount-input input {
          padding: 0;
          background: none;
          border: none;
          font-size: 20px;
          font-weight: 700;
        }

        .participant-input {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .participant-input input {
          flex: 1;
        }

        .btn-remove {
          width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #666;
          cursor: pointer;
        }

        .btn-remove:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .btn-add-participant {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px dashed #333;
          border-radius: 12px;
          color: #666;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-add-participant:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .preview-card {
          background: rgba(201, 162, 39, 0.1);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .preview-label {
          display: block;
          font-size: 12px;
          color: #A3A3A3;
          margin-bottom: 4px;
        }

        .preview-value {
          font-size: 24px;
          font-weight: 700;
          color: #C9A227;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #333;
        }

        .btn-secondary, .btn-primary {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-secondary {
          background: #262626;
          border: 1px solid #333;
          color: #fff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 100%);
          border: none;
          color: #0D0D0D;
        }
      `}</style>
    </div>
  );
}
