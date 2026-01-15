import React from 'react';
import kc, { initKeycloakOnce, ensureLogin, logoutToHome } from './auth/keycloak';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Accounts from './pages/Accounts';
import Cards from './pages/Cards';
import Payments from './pages/Payments';
import Investimentos from './pages/Investimentos';
import Consorcios from './pages/Consorcios';
import Seguros from './pages/Seguros';
import Pix from './pages/Pix';
import PixReceipt from './pages/pix/Receipt';
import Loans from './pages/Loans';
import Boleto from './pages/Boleto';
// New services imports
import Cofrinhos from './pages/Cofrinhos';
import Recarga from './pages/Recarga';
import Split from './pages/Split';
import Rewards from './pages/Rewards';
import Cripto from './pages/Cripto';
import Cambio from './pages/Cambio';
import Limites from './pages/Limites';
import Assinaturas from './pages/Assinaturas';
import Perfil from './pages/Perfil';
import Notificacoes from './pages/Notificacoes';
import Indicar from './pages/Indicar';
import OpenFinance from './pages/OpenFinance';
// Insurance sub-pages
import SeguroVida from './pages/seguros/Vida';
import SeguroCelular from './pages/seguros/Celular';
import SeguroViagem from './pages/seguros/Viagem';
import SeguroAuto from './pages/seguros/Auto';
import SeguroResidencial from './pages/seguros/Residencial';
// Investment sub-pages
import RendaFixa from './pages/investimentos/RendaFixa';
import Fundos from './pages/investimentos/Fundos';
import Acoes from './pages/investimentos/Acoes';
import Tesouro from './pages/investimentos/Tesouro';
// Card sub-pages
import CartoesVirtual from './pages/cartoes/Virtual';

// Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const CardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const PixIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5L12 12m5.5-5.5L12 12m0 0l-5.5 5.5M12 12l5.5 5.5"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"/>
    <circle cx="19" cy="12" r="1"/>
    <circle cx="5" cy="12" r="1"/>
  </svg>
);

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

function useHashRoute() {
  const getCleanRoute = () => {
    const hash = window.location.hash.slice(1) || '/';
    if (hash.includes('state=') || hash.includes('code=') || hash.includes('error=') || hash.includes('session_state=')) {
      return '/';
    }
    return hash;
  };

  const [route, setRoute] = React.useState(getCleanRoute());

  React.useEffect(() => {
    const fn = () => setRoute(getCleanRoute());
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);

  return [route, (r: string) => { window.location.hash = r }, setRoute] as const;
}

export default function AppShell() {
  const [ready, setReady] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const [route] = useHashRoute();

  // Close menu when route changes
  React.useEffect(() => {
    setShowMoreMenu(false);
  }, [route]);

  React.useEffect(() => {
    let mounted = true;
    initKeycloakOnce()
      .then(() => {
        if (!mounted) return;
        setAuthed(!!kc.authenticated);
        setReady(true);
      })
      .catch((err) => {
        console.log('[AppShell] Keycloak init result:', err);
        if (!mounted) return;
        setAuthed(false);
        setReady(true);
      });
    return () => { mounted = false };
  }, []);

  if (!ready) {
    return (
      <div className="app-loading">
        <div className="app-loading-content">
          <div className="app-loading-logo">
            <div className="app-loading-dot" />
            <span>Athena</span>
          </div>
          <div className="app-loading-spinner" />
          <p>Carregando...</p>
        </div>
        <style>{`
          .app-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0D0D0D;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .app-loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            color: white;
          }
          .app-loading-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 28px;
            font-weight: 800;
          }
          .app-loading-dot {
            width: 14px;
            height: 14px;
            background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(201, 162, 39, 0.5);
          }
          .app-loading-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid #333;
            border-top-color: #C9A227;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          .app-loading p {
            font-size: 14px;
            color: #666;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!authed) {
    return <Landing onOpenAccount={() => ensureLogin()} onLogin={() => ensureLogin()} />;
  }

  const standalonePages = ['/emprestimo', '/boleto'];
  const isStandalone = standalonePages.some(p => route.startsWith(p));

  const renderContent = () => {
    if (route === '/') return <Dashboard onLogout={() => logoutToHome()} />;
    if (route === '/contas') return <Accounts />;
    if (route === '/cartoes') return <Cards />;
    if (route === '/pix' || route.startsWith('/pix/')) return <Pix />;
    if (route.startsWith('/pix/receipt/')) return <PixReceipt />;
    if (route === '/pagamentos') return <Payments />;
    if (route === '/investimentos') return <Investimentos />;
    if (route === '/consorcios') return <Consorcios />;
    if (route === '/seguros') return <Seguros />;
    if (route === '/emprestimo') return <Loans />;
    if (route === '/boleto') return <Boleto />;

    // New services routes
    if (route === '/cofrinhos') return <Cofrinhos />;
    if (route === '/recarga') return <Recarga />;
    if (route === '/split') return <Split />;
    if (route === '/rewards') return <Rewards />;
    if (route === '/cripto') return <Cripto />;
    if (route === '/cambio') return <Cambio />;
    if (route === '/limites') return <Limites />;
    if (route === '/assinaturas') return <Assinaturas />;
    if (route === '/perfil') return <Perfil />;
    if (route === '/notificacoes') return <Notificacoes />;
    if (route === '/indicar') return <Indicar />;
    if (route === '/openfinance') return <OpenFinance />;

    // Insurance sub-pages
    if (route === '/seguros/vida') return <SeguroVida />;
    if (route === '/seguros/celular') return <SeguroCelular />;
    if (route === '/seguros/viagem') return <SeguroViagem />;
    if (route === '/seguros/auto') return <SeguroAuto />;
    if (route === '/seguros/residencial') return <SeguroResidencial />;

    // Investment sub-pages
    if (route === '/investimentos/renda-fixa') return <RendaFixa />;
    if (route === '/investimentos/fundos') return <Fundos />;
    if (route === '/investimentos/acoes') return <Acoes />;
    if (route === '/investimentos/tesouro') return <Tesouro />;

    // Card sub-pages
    if (route === '/cartoes/virtual') return <CartoesVirtual />;

    return (
      <div className="not-found">
        <div className="not-found-icon">404</div>
        <h2>Pagina nao encontrada</h2>
        <a href="#/" className="not-found-link">Voltar para o inicio</a>
      </div>
    );
  };

  if (isStandalone) {
    return (
      <>
        {renderContent()}
        <style>{`
          .not-found {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 16px;
            font-family: 'Inter', sans-serif;
            background: #0D0D0D;
            color: #fff;
          }
          .not-found-icon {
            font-size: 64px;
            font-weight: 800;
            color: #C9A227;
          }
          .not-found h2 {
            margin: 0;
            color: #A3A3A3;
          }
          .not-found-link {
            color: #C9A227;
            text-decoration: none;
            padding: 12px 24px;
            border: 1px solid #333;
            border-radius: 12px;
            transition: all 0.2s;
          }
          .not-found-link:hover {
            background: rgba(201, 162, 39, 0.1);
            border-color: #C9A227;
          }
        `}</style>
      </>
    );
  }

  return (
    <div className="app-shell">
      {/* Top Navigation Bar - Desktop */}
      <nav className="top-nav">
        <div className="top-nav-content">
          <a href="#/" className="top-nav-logo">
            <div className="top-nav-dot" />
            <span>Athena</span>
          </a>

          <div className="top-nav-links">
            <a href="#/" className={`top-nav-link ${route === '/' ? 'active' : ''}`}>
              <HomeIcon />
              <span>Inicio</span>
            </a>
            <a href="#/contas" className={`top-nav-link ${route === '/contas' ? 'active' : ''}`}>
              <ChartIcon />
              <span>Extrato</span>
            </a>
            <a href="#/cartoes" className={`top-nav-link ${route === '/cartoes' ? 'active' : ''}`}>
              <CardIcon />
              <span>Cartoes</span>
            </a>
            <a href="#/pix" className={`top-nav-link ${route.startsWith('/pix') ? 'active' : ''}`}>
              <PixIcon />
              <span>PIX</span>
            </a>
            <a href="#/investimentos" className={`top-nav-link ${route === '/investimentos' ? 'active' : ''}`}>
              <ChartIcon />
              <span>Investir</span>
            </a>
            <div className="top-nav-more">
              <button
                className={`top-nav-link ${showMoreMenu ? 'active' : ''}`}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
              >
                <MoreIcon />
                <span>Mais</span>
              </button>
              {showMoreMenu && (
                <div className="more-dropdown">
                  <div className="more-dropdown-section">
                    <span className="more-dropdown-title">Financeiro</span>
                    <a href="#/cofrinhos" className="more-dropdown-item">Cofrinhos</a>
                    <a href="#/recarga" className="more-dropdown-item">Recarga</a>
                    <a href="#/split" className="more-dropdown-item">Rachar Conta</a>
                    <a href="#/rewards" className="more-dropdown-item">Programa Átomos</a>
                  </div>
                  <div className="more-dropdown-section">
                    <span className="more-dropdown-title">Investimentos</span>
                    <a href="#/cripto" className="more-dropdown-item">Cripto</a>
                    <a href="#/cambio" className="more-dropdown-item">Câmbio</a>
                  </div>
                  <div className="more-dropdown-section">
                    <span className="more-dropdown-title">Proteção</span>
                    <a href="#/seguros" className="more-dropdown-item">Seguros</a>
                    <a href="#/consorcios" className="more-dropdown-item">Consórcios</a>
                  </div>
                  <div className="more-dropdown-section">
                    <span className="more-dropdown-title">Gestão</span>
                    <a href="#/limites" className="more-dropdown-item">Limites</a>
                    <a href="#/assinaturas" className="more-dropdown-item">Assinaturas</a>
                    <a href="#/emprestimo" className="more-dropdown-item">Empréstimos</a>
                  </div>
                  <div className="more-dropdown-section">
                    <span className="more-dropdown-title">Conta</span>
                    <a href="#/perfil" className="more-dropdown-item">Perfil</a>
                    <a href="#/notificacoes" className="more-dropdown-item">Notificações</a>
                    <a href="#/indicar" className="more-dropdown-item">Indicar Amigos</a>
                    <a href="#/openfinance" className="more-dropdown-item">Open Finance</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="top-nav-actions">
            <a href="#/perfil" className="top-nav-profile">
              <UserIcon />
            </a>
            <button className="top-nav-logout" onClick={() => logoutToHome()}>
              <LogoutIcon />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="app-content">
        <div key={route} className="page-transition">
          {renderContent()}
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="bottom-nav">
        <a href="#/" className={`bottom-nav-item ${route === '/' ? 'active' : ''}`}>
          <HomeIcon />
          <span>Inicio</span>
        </a>
        <a href="#/pix" className={`bottom-nav-item ${route.startsWith('/pix') ? 'active' : ''}`}>
          <PixIcon />
          <span>PIX</span>
        </a>
        <a href="#/cartoes" className={`bottom-nav-item ${route === '/cartoes' ? 'active' : ''}`}>
          <CardIcon />
          <span>Cartoes</span>
        </a>
        <a href="#/investimentos" className={`bottom-nav-item ${route === '/investimentos' ? 'active' : ''}`}>
          <ChartIcon />
          <span>Investir</span>
        </a>
        <button
          className={`bottom-nav-item ${showMoreMenu ? 'active' : ''}`}
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          <GridIcon />
          <span>Mais</span>
        </button>
      </nav>

      {/* Mobile More Menu */}
      {showMoreMenu && (
        <div className="mobile-more-overlay" onClick={() => setShowMoreMenu(false)}>
          <div className="mobile-more-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-more-header">
              <span>Serviços</span>
              <button onClick={() => setShowMoreMenu(false)}>&times;</button>
            </div>
            <div className="mobile-more-grid">
              <a href="#/cofrinhos" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/><path d="M2 9v1c0 1.1.9 2 2 2h1"/><path d="M16 11h0"/></svg>
                </div>
                <span>Cofrinhos</span>
              </a>
              <a href="#/recarga" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </div>
                <span>Recarga</span>
              </a>
              <a href="#/split" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <span>Rachar</span>
              </a>
              <a href="#/rewards" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#A855F7' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </div>
                <span>Átomos</span>
              </a>
              <a href="#/cripto" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#F97316' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/></svg>
                </div>
                <span>Cripto</span>
              </a>
              <a href="#/cambio" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <span>Câmbio</span>
              </a>
              <a href="#/seguros" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span>Seguros</span>
              </a>
              <a href="#/consorcios" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(132, 204, 22, 0.1)', color: '#84CC16' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <span>Consórcios</span>
              </a>
              <a href="#/limites" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <span>Limites</span>
              </a>
              <a href="#/assinaturas" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <span>Assinaturas</span>
              </a>
              <a href="#/emprestimo" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <span>Empréstimos</span>
              </a>
              <a href="#/perfil" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(201, 162, 39, 0.1)', color: '#C9A227' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span>Perfil</span>
              </a>
              <a href="#/notificacoes" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#FBBF24' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <span>Notificações</span>
              </a>
              <a href="#/indicar" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </div>
                <span>Indicar</span>
              </a>
              <a href="#/openfinance" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <span>Open Finance</span>
              </a>
              <a href="#/contas" className="mobile-more-item">
                <div className="mobile-more-icon" style={{ background: 'rgba(156, 163, 175, 0.1)', color: '#9CA3AF' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <span>Extrato</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .app-shell {
          min-height: 100vh;
          background: #0D0D0D;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 16px;
          color: #fff;
        }

        .not-found-icon {
          font-size: 64px;
          font-weight: 800;
          color: #C9A227;
        }

        .not-found h2 {
          margin: 0;
          color: #A3A3A3;
        }

        .not-found-link {
          color: #C9A227;
          text-decoration: none;
          padding: 12px 24px;
          border: 1px solid #333;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .not-found-link:hover {
          background: rgba(201, 162, 39, 0.1);
          border-color: #C9A227;
        }

        /* Top Navigation */
        .top-nav {
          background: rgba(13, 13, 13, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #262626;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .top-nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .top-nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
        }

        .top-nav-dot {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #E5B82A 0%, #C9A227 50%, #A68B1F 100%);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(201, 162, 39, 0.5);
        }

        .top-nav-links {
          display: flex;
          gap: 4px;
        }

        .top-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          text-decoration: none;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .top-nav-link:hover {
          color: #fff;
          background: #1A1A1A;
        }

        .top-nav-link.active {
          color: #C9A227;
          background: rgba(201, 162, 39, 0.1);
        }

        .top-nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .top-nav-profile {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 50%;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .top-nav-profile:hover {
          border-color: #C9A227;
          color: #C9A227;
        }

        button.bottom-nav-item {
          background: none;
          border: none;
          cursor: pointer;
        }

        .top-nav-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: 1px solid #333;
          border-radius: 8px;
          color: #666;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .top-nav-logout:hover {
          border-color: #EF4444;
          color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Bottom Navigation - Mobile */
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(13, 13, 13, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid #262626;
          padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
          z-index: 100;
        }

        .bottom-nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          text-decoration: none;
          color: #666;
          font-size: 10px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .bottom-nav-item.active {
          color: #C9A227;
        }

        .app-content {
          padding-bottom: 0;
          min-height: calc(100vh - 64px);
        }

        .page-transition {
          animation: pageEnter 0.35s ease-out;
        }

        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Desktop More Dropdown */
        .top-nav-more {
          position: relative;
        }

        .top-nav-more button {
          background: none;
          border: none;
          cursor: pointer;
        }

        .more-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: #1A1A1A;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          z-index: 200;
        }

        .more-dropdown-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .more-dropdown-title {
          color: #666;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          padding: 4px 8px;
          letter-spacing: 0.5px;
        }

        .more-dropdown-item {
          padding: 10px 12px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .more-dropdown-item:hover {
          background: rgba(201, 162, 39, 0.1);
          color: #C9A227;
        }

        /* Mobile More Overlay */
        .mobile-more-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: flex-end;
        }

        .mobile-more-menu {
          background: #1A1A1A;
          border-radius: 20px 20px 0 0;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .mobile-more-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
          position: sticky;
          top: 0;
          background: #1A1A1A;
        }

        .mobile-more-header span {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }

        .mobile-more-header button {
          width: 32px;
          height: 32px;
          background: #333;
          border: none;
          border-radius: 50%;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-more-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 20px;
        }

        .mobile-more-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          padding: 12px 8px;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .mobile-more-item:active {
          background: rgba(201, 162, 39, 0.1);
        }

        .mobile-more-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-more-item span {
          font-size: 11px;
          color: #888;
          text-align: center;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .top-nav {
            display: none;
          }

          .bottom-nav {
            display: flex;
          }

          .app-content {
            padding-bottom: calc(80px + env(safe-area-inset-bottom));
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  );
}
