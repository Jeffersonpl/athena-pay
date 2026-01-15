import React from 'react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-dot" />
          <span className="logo-text">Athena</span>
        </div>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-content">
            <h1 className="login-title">Bem-vindo ao Athena</h1>
            <p className="login-subtitle">
              Sua conta digital premium com segurança e sofisticação.
            </p>

            <button onClick={onLogin} className="login-btn">
              <span>Entrar na conta</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="login-divider">
              <span>ou</span>
            </div>

            <button className="login-btn-outline" onClick={onLogin}>
              Criar conta
            </button>
          </div>

          <div className="login-footer">
            <div className="login-security">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Conexao segura com criptografia</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span>Seguranca premium</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <span>Cartoes exclusivos</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5" />
              </svg>
            </div>
            <span>PIX instantaneo</span>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0D0D0D;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .login-page::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 20%, rgba(201, 162, 39, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(201, 162, 39, 0.05) 0%, transparent 40%);
          pointer-events: none;
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          box-shadow: 0 0 30px rgba(201, 162, 39, 0.5);
        }

        .logo-text {
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .login-card {
          width: 100%;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .login-card-content {
          padding: 40px 32px 32px;
        }

        .login-title {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
          text-align: center;
        }

        .login-subtitle {
          font-size: 15px;
          color: #A3A3A3;
          margin: 0 0 32px;
          text-align: center;
          line-height: 1.5;
        }

        .login-btn {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border: none;
          border-radius: 14px;
          color: #0D0D0D;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 162, 39, 0.4);
        }

        .login-btn:active {
          transform: translateY(0);
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }

        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #333;
        }

        .login-divider span {
          color: #666;
          font-size: 13px;
        }

        .login-btn-outline {
          width: 100%;
          padding: 14px 24px;
          background: transparent;
          border: 1px solid #444;
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .login-btn-outline:hover {
          border-color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .login-footer {
          padding: 16px 32px;
          background: #151515;
          border-top: 1px solid #262626;
        }

        .login-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #666;
          font-size: 12px;
        }

        .login-security svg {
          color: #22C55E;
        }

        .login-features {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 13px;
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          color: #C9A227;
        }

        @media (max-width: 480px) {
          .login-card-content {
            padding: 32px 24px 24px;
          }

          .login-title {
            font-size: 22px;
          }

          .login-features {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
