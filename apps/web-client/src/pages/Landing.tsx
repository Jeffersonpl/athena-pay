import React from 'react';

interface LandingProps {
  onOpenAccount: () => void;
  onLogin: () => void;
}

export default function Landing({ onOpenAccount, onLogin }: LandingProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <a href="/" className="nav-logo">
            <div className="nav-logo-dot" />
            <span>Athena</span>
          </a>

          {/* Desktop Menu */}
          <div className="nav-links">
            <a href="#conta">Conta Digital</a>
            <a href="#cartao">Cartao</a>
            <a href="#investimentos">Investimentos</a>
            <a href="#pix">PIX</a>
            <a href="#seguros">Seguros</a>
          </div>

          <div className="nav-actions">
            <button className="nav-btn-outline" onClick={onLogin}>Entrar</button>
            <button className="nav-btn-primary" onClick={onOpenAccount}>Abrir Conta</button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="nav-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#conta">Conta Digital</a>
            <a href="#cartao">Cartao</a>
            <a href="#investimentos">Investimentos</a>
            <a href="#pix">PIX</a>
            <a href="#seguros">Seguros</a>
            <div className="mobile-menu-actions">
              <button className="nav-btn-outline" onClick={onLogin}>Entrar</button>
              <button className="nav-btn-primary" onClick={onOpenAccount}>Abrir Conta</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-dot" />
              Banco 100% Digital
            </div>
            <h1>
              O banco que <span className="gold-text">valoriza</span> seu dinheiro
            </h1>
            <p>
              Conta digital gratuita, cartao sem anuidade, investimentos que rendem mais
              e um atendimento que realmente resolve. Tudo em um so lugar.
            </p>
            <div className="hero-actions">
              <button className="btn-primary-lg" onClick={onOpenAccount}>
                Abrir minha conta gratis
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <div className="hero-stats">
                <div className="stat">
                  <strong>2M+</strong>
                  <span>Clientes</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <strong>4.8</strong>
                  <span>App Store</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <strong>0%</strong>
                  <span>Anuidade</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="app-header">
                  <div className="app-logo">
                    <div className="app-logo-dot" />
                    <span>Athena</span>
                  </div>
                  <div className="app-greeting">Ola, Maria</div>
                </div>
                <div className="app-balance">
                  <span className="balance-label">Saldo disponivel</span>
                  <span className="balance-value">R$ 12.458,90</span>
                </div>
                <div className="app-actions-grid">
                  <div className="app-action">
                    <div className="action-icon pix">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"/>
                      </svg>
                    </div>
                    <span>PIX</span>
                  </div>
                  <div className="app-action">
                    <div className="action-icon transfer">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 19V5m0 0l-7 7m7-7l7 7"/>
                      </svg>
                    </div>
                    <span>Transferir</span>
                  </div>
                  <div className="app-action">
                    <div className="action-icon pay">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <span>Pagar</span>
                  </div>
                  <div className="app-action">
                    <div className="action-icon invest">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10"/>
                        <line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                    </div>
                    <span>Investir</span>
                  </div>
                </div>
                <div className="app-card-preview">
                  <div className="card-chip" />
                  <div className="card-number">**** **** **** 4892</div>
                  <div className="card-brand">VISA</div>
                </div>
              </div>
            </div>
            <div className="hero-floating-card card-1">
              <div className="floating-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="floating-text">
                <span className="floating-title">PIX Recebido</span>
                <span className="floating-value">+ R$ 1.500,00</span>
              </div>
            </div>
            <div className="hero-floating-card card-2">
              <div className="floating-icon gold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="floating-text">
                <span className="floating-title">Rendimento CDI</span>
                <span className="floating-value">102% ao ano</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#0D0D0D"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="conta">
        <div className="features-container">
          <div className="section-header">
            <span className="section-tag">Conta Digital</span>
            <h2>Tudo que voce precisa em um banco. E muito mais.</h2>
            <p>Conta digital completa, sem tarifas escondidas e com rendimento automatico.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3>Cartao sem Anuidade</h3>
              <p>Cartao de credito e debito sem cobranca de anuidade. Para sempre.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"/>
                </svg>
              </div>
              <h3>PIX Ilimitado</h3>
              <p>Transferencias PIX 24h por dia, 7 dias por semana. Sem limites.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3>Rendimento 102% CDI</h3>
              <p>Seu dinheiro rende automaticamente, desde o primeiro real.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Seguranca Total</h3>
              <p>Protecao contra fraudes, biometria e notificacoes em tempo real.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3>Conta Global</h3>
              <p>Compre em dolar e euro com as melhores taxas do mercado.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Programa Atomos</h3>
              <p>Ganhe pontos em todas as compras e troque por beneficios exclusivos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <section className="card-section" id="cartao">
        <div className="card-section-container">
          <div className="card-visual">
            <div className="credit-card">
              <div className="credit-card-bg" />
              <div className="credit-card-content">
                <div className="card-header">
                  <div className="card-logo">
                    <div className="card-logo-dot" />
                    <span>Athena</span>
                  </div>
                  <span className="card-type">PLATINUM</span>
                </div>
                <div className="card-chip-lg">
                  <div className="chip-lines">
                    <div /><div /><div /><div />
                  </div>
                </div>
                <div className="card-number-lg">
                  5412 •••• •••• 4892
                </div>
                <div className="card-footer">
                  <div className="card-holder">
                    <span className="label">TITULAR</span>
                    <span className="value">MARIA SILVA</span>
                  </div>
                  <div className="card-expiry">
                    <span className="label">VALIDADE</span>
                    <span className="value">12/28</span>
                  </div>
                  <div className="card-brand-logo">VISA</div>
                </div>
              </div>
            </div>
            <div className="card-glow" />
          </div>

          <div className="card-text">
            <span className="section-tag">Cartao Athena</span>
            <h2>O cartao que da <span className="gold-text">poder</span> pra voce</h2>
            <ul className="card-benefits">
              <li>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Zero anuidade, para sempre</span>
              </li>
              <li>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Cashback em todas as compras</span>
              </li>
              <li>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Parcelamento em ate 12x sem juros</span>
              </li>
              <li>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Cartao virtual para compras online</span>
              </li>
              <li>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Bloqueio e desbloqueio pelo app</span>
              </li>
            </ul>
            <button className="btn-primary-lg" onClick={onOpenAccount}>
              Pedir meu cartao
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Investments Section */}
      <section className="investments" id="investimentos">
        <div className="investments-container">
          <div className="investments-text">
            <span className="section-tag">Investimentos</span>
            <h2>Faca seu dinheiro <span className="gold-text">trabalhar</span> por voce</h2>
            <p>
              Investimentos a partir de R$ 1,00. CDB, LCI, LCA, Tesouro Direto, Fundos,
              Acoes e Criptomoedas. Tudo em um so lugar.
            </p>

            <div className="investment-cards">
              <div className="investment-card">
                <div className="inv-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                </div>
                <div className="inv-info">
                  <span className="inv-name">CDB Athena</span>
                  <span className="inv-rate">102% do CDI</span>
                </div>
                <span className="inv-badge">Liquidez diaria</span>
              </div>

              <div className="investment-card">
                <div className="inv-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="inv-info">
                  <span className="inv-name">Tesouro Selic</span>
                  <span className="inv-rate">SELIC + 0,1%</span>
                </div>
                <span className="inv-badge">Baixo risco</span>
              </div>

              <div className="investment-card">
                <div className="inv-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <div className="inv-info">
                  <span className="inv-name">Acoes</span>
                  <span className="inv-rate">Corretagem zero</span>
                </div>
                <span className="inv-badge">Home Broker</span>
              </div>
            </div>

            <button className="btn-primary-lg" onClick={onOpenAccount}>
              Comecar a investir
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div className="investments-visual">
            <div className="chart-card">
              <div className="chart-header">
                <span className="chart-title">Rendimento Acumulado</span>
                <span className="chart-value">+R$ 2.458,90</span>
                <span className="chart-percent">+12,4%</span>
              </div>
              <div className="chart-graph">
                <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(201, 162, 39, 0.3)"/>
                      <stop offset="100%" stopColor="rgba(201, 162, 39, 0)"/>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 80 Q50 70 75 60 T150 40 T225 30 T300 15"
                    stroke="#C9A227"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M0 80 Q50 70 75 60 T150 40 T225 30 T300 15 L300 100 L0 100 Z"
                    fill="url(#chartGradient)"
                  />
                </svg>
              </div>
              <div className="chart-period">
                <span className="active">1M</span>
                <span>3M</span>
                <span>6M</span>
                <span>1A</span>
                <span>MAX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Pronto para comecar?</h2>
            <p>Abra sua conta em minutos. Sem burocracia, sem taxas escondidas.</p>
            <div className="cta-actions">
              <button className="btn-primary-lg" onClick={onOpenAccount}>
                Abrir minha conta gratis
              </button>
              <div className="cta-badges">
                <div className="badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>Dados protegidos</span>
                </div>
                <div className="badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Regulado pelo BACEN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-dot" />
                <span>Athena</span>
              </div>
              <p>O banco digital que valoriza seu dinheiro.</p>
              <div className="social-links">
                <a href="#" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="18" cy="6" r="1"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Produtos</h4>
                <a href="#conta">Conta Digital</a>
                <a href="#cartao">Cartao de Credito</a>
                <a href="#investimentos">Investimentos</a>
                <a href="#pix">PIX</a>
                <a href="#seguros">Seguros</a>
              </div>
              <div className="footer-column">
                <h4>Empresa</h4>
                <a href="#">Sobre nos</a>
                <a href="#">Carreiras</a>
                <a href="#">Imprensa</a>
                <a href="#">Blog</a>
              </div>
              <div className="footer-column">
                <h4>Suporte</h4>
                <a href="#">Central de Ajuda</a>
                <a href="#">Fale Conosco</a>
                <a href="#">Seguranca</a>
                <a href="#">Taxas e Tarifas</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Termos de Uso</a>
                <a href="#">Privacidade</a>
                <a href="#">LGPD</a>
                <a href="#">Compliance</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>Athena Pay S.A. - CNPJ: 00.000.000/0001-00</p>
            <p>Instituicao de Pagamento autorizada pelo Banco Central do Brasil</p>
            <p>2024 Athena Pay. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <style>{`
        /* Reset */
        .landing * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .landing {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #FFFFFF;
          background: #0D0D0D;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        /* Navigation */
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(13, 13, 13, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #262626;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #FFFFFF;
          font-size: 22px;
          font-weight: 800;
        }

        .nav-logo-dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #E5B82A, #C9A227, #A68B1F);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(201, 162, 39, 0.5);
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-links a {
          color: #A3A3A3;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: #C9A227;
        }

        .nav-actions {
          display: flex;
          gap: 12px;
        }

        .nav-btn-outline {
          background: transparent;
          border: 1px solid #333;
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn-outline:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .nav-btn-primary {
          background: linear-gradient(135deg, #E5B82A, #C9A227, #A68B1F);
          border: none;
          color: #000;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(201, 162, 39, 0.4);
        }

        .nav-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }

        .nav-menu-toggle span {
          width: 24px;
          height: 2px;
          background: #FFFFFF;
          border-radius: 2px;
          transition: 0.2s;
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          padding: 20px 24px;
          border-top: 1px solid #262626;
        }

        .mobile-menu a {
          color: #A3A3A3;
          text-decoration: none;
          padding: 12px 0;
          font-size: 16px;
          border-bottom: 1px solid #262626;
        }

        .mobile-menu-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .mobile-menu-actions button {
          flex: 1;
        }

        /* Hero Section */
        .hero {
          padding: 140px 24px 80px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, #0D0D0D 0%, #111111 100%);
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(201, 162, 39, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(201, 162, 39, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201, 162, 39, 0.1);
          border: 1px solid rgba(201, 162, 39, 0.2);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 13px;
          color: #C9A227;
          margin-bottom: 24px;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #C9A227;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-text h1 {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .gold-text {
          background: linear-gradient(135deg, #E5B82A, #C9A227);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-text p {
          font-size: 18px;
          color: #A3A3A3;
          margin-bottom: 32px;
          max-width: 500px;
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .btn-primary-lg {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #E5B82A, #C9A227, #A68B1F);
          border: none;
          color: #000;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          width: fit-content;
        }

        .btn-primary-lg:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 30px rgba(201, 162, 39, 0.5);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .stat {
          display: flex;
          flex-direction: column;
        }

        .stat strong {
          font-size: 24px;
          font-weight: 700;
          color: #FFFFFF;
        }

        .stat span {
          font-size: 13px;
          color: #666;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: #333;
        }

        /* Phone Mockup */
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .phone-mockup {
          width: 280px;
          height: 560px;
          background: #1A1A1A;
          border-radius: 36px;
          padding: 12px;
          box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 2;
        }

        .phone-screen {
          background: #0D0D0D;
          border-radius: 28px;
          height: 100%;
          padding: 24px 20px;
          overflow: hidden;
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .app-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
        }

        .app-logo-dot {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #E5B82A, #C9A227);
          border-radius: 50%;
        }

        .app-greeting {
          color: #666;
          font-size: 12px;
        }

        .app-balance {
          margin-bottom: 24px;
        }

        .balance-label {
          display: block;
          color: #666;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .balance-value {
          font-size: 28px;
          font-weight: 700;
        }

        .app-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .app-action {
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

        .action-icon.pix { background: rgba(201, 162, 39, 0.15); color: #C9A227; }
        .action-icon.transfer { background: rgba(59, 130, 246, 0.15); color: #3B82F6; }
        .action-icon.pay { background: rgba(34, 197, 94, 0.15); color: #22C55E; }
        .action-icon.invest { background: rgba(168, 85, 247, 0.15); color: #A855F7; }

        .app-action span {
          font-size: 10px;
          color: #666;
        }

        .app-card-preview {
          background: linear-gradient(135deg, #1A1A1A, #262626);
          border-radius: 16px;
          padding: 20px;
          position: relative;
        }

        .card-chip {
          width: 32px;
          height: 24px;
          background: linear-gradient(135deg, #C9A227, #A68B1F);
          border-radius: 4px;
          margin-bottom: 16px;
        }

        .card-number {
          font-size: 14px;
          color: #666;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .card-brand {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-size: 18px;
          font-weight: 700;
          color: #666;
        }

        /* Floating Cards */
        .hero-floating-card {
          position: absolute;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          z-index: 3;
        }

        .card-1 {
          top: 60px;
          right: -20px;
          animation: float1 3s ease-in-out infinite;
        }

        .card-2 {
          bottom: 100px;
          left: -40px;
          animation: float2 3s ease-in-out infinite 0.5s;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        .floating-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-icon.green { background: rgba(34, 197, 94, 0.15); color: #22C55E; }
        .floating-icon.gold { background: rgba(201, 162, 39, 0.15); color: #C9A227; }

        .floating-text {
          display: flex;
          flex-direction: column;
        }

        .floating-title {
          font-size: 12px;
          color: #666;
        }

        .floating-value {
          font-size: 16px;
          font-weight: 600;
        }

        .hero-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .hero-wave svg {
          display: block;
          width: 100%;
        }

        /* Features Section */
        .features {
          padding: 100px 24px;
          background: #0D0D0D;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-tag {
          display: inline-block;
          background: rgba(201, 162, 39, 0.1);
          border: 1px solid rgba(201, 162, 39, 0.2);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 13px;
          color: #C9A227;
          margin-bottom: 16px;
        }

        .section-header h2 {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .section-header p {
          font-size: 18px;
          color: #A3A3A3;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          border-color: #333;
          transform: translateY(-5px);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          background: rgba(201, 162, 39, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A227;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .feature-card p {
          font-size: 14px;
          color: #A3A3A3;
          line-height: 1.6;
        }

        /* Card Section */
        .card-section {
          padding: 100px 24px;
          background: #0D0D0D;
        }

        .card-section-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .card-visual {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .credit-card {
          width: 380px;
          height: 240px;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }

        .credit-card-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1A1A1A, #262626);
        }

        .credit-card-content {
          position: relative;
          padding: 28px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
        }

        .card-logo-dot {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #E5B82A, #C9A227);
          border-radius: 50%;
        }

        .card-type {
          font-size: 11px;
          letter-spacing: 2px;
          color: #C9A227;
        }

        .card-chip-lg {
          width: 48px;
          height: 36px;
          background: linear-gradient(135deg, #C9A227, #A68B1F);
          border-radius: 6px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chip-lines {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          width: 24px;
        }

        .chip-lines div {
          height: 8px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 1px;
        }

        .card-number-lg {
          font-size: 22px;
          letter-spacing: 4px;
          color: #888;
          margin-bottom: auto;
        }

        .card-footer {
          display: flex;
          align-items: flex-end;
          gap: 32px;
        }

        .card-holder,
        .card-expiry {
          display: flex;
          flex-direction: column;
        }

        .card-footer .label {
          font-size: 9px;
          color: #666;
          letter-spacing: 1px;
        }

        .card-footer .value {
          font-size: 13px;
          color: #AAA;
        }

        .card-brand-logo {
          margin-left: auto;
          font-size: 24px;
          font-weight: 700;
          font-style: italic;
          color: #666;
        }

        .card-glow {
          position: absolute;
          inset: -50px;
          background: radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .card-text h2 {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .card-benefits {
          list-style: none;
          margin-bottom: 32px;
        }

        .card-benefits li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #262626;
          font-size: 16px;
          color: #A3A3A3;
        }

        .card-benefits svg {
          color: #22C55E;
          flex-shrink: 0;
        }

        /* Investments Section */
        .investments {
          padding: 100px 24px;
          background: linear-gradient(180deg, #0D0D0D 0%, #111111 100%);
        }

        .investments-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .investments-text h2 {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .investments-text > p {
          font-size: 18px;
          color: #A3A3A3;
          margin-bottom: 32px;
        }

        .investment-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .investment-card {
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
        }

        .investment-card:hover {
          border-color: #333;
        }

        .inv-icon {
          width: 48px;
          height: 48px;
          background: rgba(201, 162, 39, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A227;
        }

        .inv-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .inv-name {
          font-weight: 600;
          margin-bottom: 2px;
        }

        .inv-rate {
          font-size: 13px;
          color: #22C55E;
        }

        .inv-badge {
          background: rgba(201, 162, 39, 0.1);
          color: #C9A227;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 500;
        }

        .investments-visual {
          display: flex;
          justify-content: center;
        }

        .chart-card {
          background: #1A1A1A;
          border: 1px solid #262626;
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 400px;
        }

        .chart-header {
          margin-bottom: 24px;
        }

        .chart-title {
          display: block;
          color: #666;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .chart-value {
          display: block;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .chart-percent {
          color: #22C55E;
          font-size: 14px;
          font-weight: 600;
        }

        .chart-graph {
          height: 100px;
          margin-bottom: 16px;
        }

        .chart-graph svg {
          width: 100%;
          height: 100%;
        }

        .chart-period {
          display: flex;
          justify-content: space-around;
          border-top: 1px solid #262626;
          padding-top: 16px;
        }

        .chart-period span {
          color: #666;
          font-size: 12px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .chart-period span.active {
          background: rgba(201, 162, 39, 0.1);
          color: #C9A227;
        }

        .chart-period span:hover:not(.active) {
          color: #FFFFFF;
        }

        /* CTA Section */
        .cta {
          padding: 100px 24px;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, transparent 50%);
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .cta-content p {
          font-size: 18px;
          color: #A3A3A3;
          margin-bottom: 32px;
        }

        .cta-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .cta-badges {
          display: flex;
          gap: 32px;
        }

        .cta-badges .badge {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
        }

        /* Footer */
        .footer {
          padding: 80px 24px 40px;
          background: #0A0A0A;
          border-top: 1px solid #262626;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 80px;
          margin-bottom: 60px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .footer-logo-dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #E5B82A, #C9A227);
          border-radius: 50%;
        }

        .footer-brand p {
          color: #666;
          margin-bottom: 24px;
        }

        .social-links {
          display: flex;
          gap: 16px;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          transition: all 0.2s;
        }

        .social-links a:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .footer-column h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #FFFFFF;
        }

        .footer-column a {
          display: block;
          color: #666;
          text-decoration: none;
          font-size: 14px;
          padding: 8px 0;
          transition: color 0.2s;
        }

        .footer-column a:hover {
          color: #C9A227;
        }

        .footer-bottom {
          border-top: 1px solid #262626;
          padding-top: 32px;
          text-align: center;
        }

        .footer-bottom p {
          color: #666;
          font-size: 13px;
          margin-bottom: 8px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }

          .hero-text p {
            margin: 0 auto 32px;
          }

          .hero-actions {
            align-items: center;
          }

          .hero-stats {
            justify-content: center;
          }

          .hero-visual {
            order: -1;
          }

          .hero-floating-card.card-1 {
            right: 10%;
          }

          .hero-floating-card.card-2 {
            left: 10%;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .card-section-container,
          .investments-container {
            grid-template-columns: 1fr;
            gap: 60px;
            text-align: center;
          }

          .card-text,
          .investments-text {
            order: 1;
          }

          .card-visual,
          .investments-visual {
            order: -1;
          }

          .card-benefits {
            max-width: 400px;
            margin: 0 auto 32px;
          }

          .footer-main {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .nav-links,
          .nav-actions {
            display: none;
          }

          .nav-menu-toggle {
            display: flex;
          }

          .mobile-menu {
            display: flex;
          }

          .hero {
            padding: 120px 20px 60px;
          }

          .hero-text h1 {
            font-size: 36px;
          }

          .hero-text p {
            font-size: 16px;
          }

          .phone-mockup {
            width: 240px;
            height: 480px;
          }

          .hero-floating-card {
            display: none;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2,
          .card-text h2,
          .investments-text h2,
          .cta-content h2 {
            font-size: 28px;
          }

          .credit-card {
            width: 300px;
            height: 190px;
          }

          .cta-badges {
            flex-direction: column;
            gap: 16px;
          }

          .footer-links {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
