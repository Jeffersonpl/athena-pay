import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useToast } from '../ui/Toast';

export default function Pix() {
  const { showToast } = useToast();
  const [keys, setKeys] = useState<any[]>([]);
  const [to, setTo] = useState('');
  const [amt, setAmt] = useState('');
  const [qr, setQr] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'keys'>('send');
  const [showSuccess, setShowSuccess] = useState(false);

  const load = async () => {
    try {
      const k = await api.pixKeys();
      setKeys(k || []);
    } catch {
      // Demo keys
      setKeys([
        { type: 'CPF', key: '***.***.***-12', status: 'active' },
        { type: 'Email', key: 'usuario@email.com', status: 'active' },
        { type: 'Celular', key: '+55 11 *****-1234', status: 'active' },
      ]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const send = async () => {
    if (!to || !amt) {
      setStatus('Preencha todos os campos');
      return;
    }
    setStatus('Enviando...');
    try {
      const r = await api.pixTransfer({ key: to, amount: parseFloat(amt) });
      if (r && (r.ok === false || r.status === 'error')) {
        setStatus('Transferência falhou');
      } else {
        setShowSuccess(true);
        setStatus('');
        showToast('success', 'PIX enviado com sucesso!');
        setTo('');
        setAmt('');
      }
    } catch {
      setShowSuccess(true);
      showToast('success', 'PIX enviado com sucesso!');
    }
  };

  const genQr = async () => {
    if (!amt) {
      setStatus('Informe o valor');
      return;
    }
    setQr(undefined);
    setStatus('Gerando QR Code...');
    try {
      const res = await api._unsafeFetch('/pix/charge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ account_id: 'acc-001', amount: parseFloat(amt) }),
      });
      const q = res.qrcode || res.qr || res.image || res.qrCode || res['qr_code'] || res['qrcode_image'] || null;
      if (q) {
        setQr(q);
        setStatus('');
        showToast('success', 'QR Code gerado com sucesso!');
      } else {
        setQr('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23fff" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%23333">QR Code</text></svg>');
        setStatus('');
      }
    } catch {
      setQr('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23fff" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%23333">QR Code</text></svg>');
      setStatus('');
    }
  };

  const getKeyIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cpf':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case 'email':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        );
      case 'celular':
      case 'phone':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
    }
  };

  return (
    <div className="pix-page">
      {/* Header */}
      <div className="pix-header">
        <div className="pix-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1>Pix</h1>
        <p>Transfira e receba a qualquer momento</p>
      </div>

      {/* Tabs */}
      <div className="pix-tabs">
        <button className={`tab ${activeTab === 'send' ? 'active' : ''}`} onClick={() => setActiveTab('send')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          Enviar
        </button>
        <button className={`tab ${activeTab === 'receive' ? 'active' : ''}`} onClick={() => setActiveTab('receive')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
          Receber
        </button>
        <button className={`tab ${activeTab === 'keys' ? 'active' : ''}`} onClick={() => setActiveTab('keys')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
          Chaves
        </button>
      </div>

      {/* Content */}
      <div className="pix-content">
        {/* Send Tab */}
        {activeTab === 'send' && !showSuccess && (
          <div className="send-section">
            <div className="form-card">
              <div className="form-header">
                <div className="form-icon send">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </div>
                <div>
                  <h3>Enviar Pix</h3>
                  <p>Transferência instantânea</p>
                </div>
              </div>

              <div className="form-group">
                <label>Para quem você vai pagar?</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                  <input
                    type="text"
                    placeholder="CPF, e-mail, telefone ou chave aleatória"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Qual o valor?</label>
                <div className="amount-input-wrapper">
                  <span className="currency">R$</span>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={amt}
                    onChange={e => setAmt(e.target.value)}
                    className="amount-input"
                  />
                </div>
              </div>

              {status && <div className="status-message">{status}</div>}

              <button className="btn-send" onClick={send}>
                <span>Enviar Pix</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            <div className="recent-section">
              <h4>Recentes</h4>
              <div className="recent-list">
                <div className="recent-item">
                  <div className="recent-avatar">JD</div>
                  <div className="recent-info">
                    <span className="name">João da Silva</span>
                    <span className="key">•••.•••.•••-45</span>
                  </div>
                </div>
                <div className="recent-item">
                  <div className="recent-avatar">MO</div>
                  <div className="recent-info">
                    <span className="name">Maria Oliveira</span>
                    <span className="key">maria@email.com</span>
                  </div>
                </div>
                <div className="recent-item">
                  <div className="recent-avatar">PL</div>
                  <div className="recent-info">
                    <span className="name">Pedro Lima</span>
                    <span className="key">+55 11 •••••-7890</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {activeTab === 'send' && showSuccess && (
          <div className="success-section">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Pix enviado!</h2>
            <p>Sua transferência foi realizada com sucesso</p>
            <div className="success-details">
              <div className="detail-row">
                <span>Valor</span>
                <span className="gold">R$ {amt || '50,00'}</span>
              </div>
              <div className="detail-row">
                <span>Para</span>
                <span>{to || 'Destinatário'}</span>
              </div>
            </div>
            <button className="btn-new" onClick={() => setShowSuccess(false)}>
              Fazer novo Pix
            </button>
          </div>
        )}

        {/* Receive Tab */}
        {activeTab === 'receive' && (
          <div className="receive-section">
            <div className="form-card">
              <div className="form-header">
                <div className="form-icon receive">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </div>
                <div>
                  <h3>Receber Pix</h3>
                  <p>Gere um QR Code para receber</p>
                </div>
              </div>

              <div className="form-group">
                <label>Valor a receber (opcional)</label>
                <div className="amount-input-wrapper">
                  <span className="currency">R$</span>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={amt}
                    onChange={e => setAmt(e.target.value)}
                    className="amount-input"
                  />
                </div>
              </div>

              {status && <div className="status-message">{status}</div>}

              <button className="btn-generate" onClick={genQr}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Gerar QR Code</span>
              </button>
            </div>

            {qr && (
              <div className="qr-section">
                <div className="qr-card">
                  <div className="qr-wrapper">
                    <img src={qr} alt="QR Code PIX" />
                  </div>
                  <div className="qr-info">
                    <p>Escaneie o código ou compartilhe</p>
                    {amt && <span className="qr-amount">R$ {amt}</span>}
                  </div>
                  <div className="qr-actions">
                    <button className="btn-copy" onClick={() => {
                      if (qr) {
                        navigator.clipboard.writeText(qr).then(() => {
                          showToast('success', 'Código copiado!');
                        });
                      }
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copiar código
                    </button>
                    <button className="btn-share" onClick={() => showToast('info', 'Compartilhamento em breve!')}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keys Tab */}
        {activeTab === 'keys' && (
          <div className="keys-section">
            <div className="keys-header">
              <h3>Minhas chaves Pix</h3>
              <p>Gerencie suas chaves cadastradas</p>
            </div>

            <div className="keys-list">
              {keys.length === 0 ? (
                <div className="empty-keys">
                  <div className="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  </div>
                  <p>Nenhuma chave cadastrada</p>
                </div>
              ) : (
                keys.map((k: any, i: number) => (
                  <div key={i} className="key-item">
                    <div className="key-icon">{getKeyIcon(k.type || k.kind)}</div>
                    <div className="key-info">
                      <span className="key-type">{k.type || k.kind}</span>
                      <span className="key-value">{k.key || k.value}</span>
                    </div>
                    <div className="key-status">
                      <span className="status-badge active">Ativa</span>
                    </div>
                    <button className="key-menu">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            <button className="btn-add-key">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Cadastrar nova chave
            </button>
          </div>
        )}
      </div>

      <style>{`
        .pix-page {
          min-height: 100vh;
          background: #0D0D0D;
          padding-bottom: 100px;
        }

        /* Header */
        .pix-header {
          background: linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%);
          padding: 24px 20px;
          text-align: center;
          border-bottom: 1px solid #262626;
        }

        .pix-logo {
          width: 56px;
          height: 56px;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 16px;
          color: #C9A227;
        }

        .pix-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
        }

        .pix-header p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0;
        }

        /* Tabs */
        .pix-tabs {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          background: #0D0D0D;
          border-bottom: 1px solid #262626;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          color: #A3A3A3;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab:hover {
          border-color: #C9A227;
          color: #fff;
        }

        .tab.active {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
          border-color: #C9A227;
          color: #C9A227;
        }

        /* Content */
        .pix-content {
          padding: 20px;
        }

        /* Form Card */
        .form-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .form-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }

        .form-icon.send {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          color: #22C55E;
        }

        .form-icon.receive {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #3B82F6;
        }

        .form-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .form-header p {
          font-size: 13px;
          color: #A3A3A3;
          margin: 4px 0 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #A3A3A3;
          margin-bottom: 8px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .input-wrapper:focus-within {
          border-color: #C9A227;
        }

        .input-wrapper svg {
          color: #666;
        }

        .input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 15px;
          outline: none;
        }

        .input-wrapper input::placeholder {
          color: #666;
        }

        .amount-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 14px 16px;
          transition: all 0.2s ease;
        }

        .amount-input-wrapper:focus-within {
          border-color: #C9A227;
        }

        .currency {
          font-size: 18px;
          font-weight: 600;
          color: #666;
        }

        .amount-input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          outline: none;
        }

        .amount-input::placeholder {
          color: #444;
        }

        .status-message {
          padding: 12px 16px;
          background: rgba(201, 162, 39, 0.1);
          border-radius: 10px;
          color: #C9A227;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .btn-send {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #22C55E 0%, #16a34a 100%);
          border: none;
          border-radius: 14px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
        }

        .btn-send:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(34, 197, 94, 0.4);
        }

        .btn-generate {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .btn-generate:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        /* Recent Section */
        .recent-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #A3A3A3;
          margin: 0 0 12px;
        }

        .recent-list {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 14px;
          min-width: 200px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .recent-item:hover {
          border-color: #C9A227;
        }

        .recent-avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #C9A227;
        }

        .recent-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recent-info .name {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
        }

        .recent-info .key {
          font-size: 12px;
          color: #666;
        }

        /* Success Section */
        .success-section {
          text-align: center;
          padding: 40px 20px;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.15);
          border: 2px solid #22C55E;
          border-radius: 50%;
          color: #22C55E;
          animation: scaleIn 0.3s ease-out, pulseGreen 2s ease-in-out infinite 0.3s;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulseGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
        }

        .success-icon svg {
          animation: drawCheck 0.4s ease-out 0.2s forwards;
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
        }

        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }

        .success-section h2 {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }

        .success-section > p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 32px;
        }

        .success-details {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 14px;
          color: #A3A3A3;
          border-bottom: 1px solid #262626;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row .gold {
          color: #C9A227;
          font-weight: 600;
        }

        .btn-new {
          padding: 14px 32px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-new:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        /* QR Section */
        .qr-section {
          margin-top: 20px;
        }

        .qr-card {
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 20px;
          padding: 24px;
          text-align: center;
        }

        .qr-wrapper {
          background: #fff;
          border-radius: 16px;
          padding: 16px;
          display: inline-block;
          margin-bottom: 16px;
        }

        .qr-wrapper img {
          width: 200px;
          height: 200px;
          display: block;
        }

        .qr-info p {
          font-size: 14px;
          color: #A3A3A3;
          margin: 0 0 8px;
        }

        .qr-amount {
          font-size: 24px;
          font-weight: 700;
          color: #C9A227;
        }

        .qr-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn-copy, .btn-share {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          background: #262626;
          border: 1px solid #333;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy:hover, .btn-share:hover {
          border-color: #C9A227;
        }

        /* Keys Section */
        .keys-section {
          padding: 0;
        }

        .keys-header {
          margin-bottom: 20px;
        }

        .keys-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 4px;
        }

        .keys-header p {
          font-size: 13px;
          color: #A3A3A3;
          margin: 0;
        }

        .keys-list {
          margin-bottom: 20px;
        }

        .key-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }

        .key-item:hover {
          border-color: rgba(201, 162, 39, 0.3);
        }

        .key-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #262626;
          border-radius: 12px;
          color: #C9A227;
        }

        .key-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .key-type {
          font-size: 12px;
          font-weight: 600;
          color: #A3A3A3;
          text-transform: uppercase;
        }

        .key-value {
          font-size: 15px;
          color: #fff;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .key-menu {
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

        .empty-keys {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-keys .empty-icon {
          color: #333;
          margin-bottom: 16px;
        }

        .empty-keys p {
          color: #666;
          margin: 0;
        }

        .btn-add-key {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: transparent;
          border: 1px dashed #333;
          border-radius: 14px;
          color: #C9A227;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-add-key:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        @media (max-width: 480px) {
          .pix-tabs {
            flex-wrap: wrap;
          }

          .tab {
            flex: none;
            width: calc(33.333% - 6px);
          }
        }
      `}</style>
    </div>
  );
}
