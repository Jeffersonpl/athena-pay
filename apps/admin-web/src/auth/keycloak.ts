import Keycloak from 'keycloak-js';

// Read configuration from /config.js (mounted at runtime) or Vite env
const runtime: any = (window as any).__APP_CONFIG__ || (window as any).config || {};

const KEYCLOAK_URL: string = runtime.VITE_KEYCLOAK_URL || import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081';
const KEYCLOAK_REALM: string = runtime.VITE_KEYCLOAK_REALM || import.meta.env.VITE_KEYCLOAK_REALM || 'athena';
const KEYCLOAK_CLIENT_ID: string = runtime.VITE_KEYCLOAK_CLIENT_ID || import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'admin-web';

console.log('[Keycloak] Config:', { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID });

// Keycloak instance
const kc = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID,
});

let _initPromise: Promise<boolean> | null = null;

export function initKeycloakOnce(): Promise<boolean> {
  if (_initPromise) return _initPromise;

  console.log('[Keycloak] Initializing...');
  console.log('[Keycloak] URL:', window.location.href);
  console.log('[Keycloak] Hash:', window.location.hash);

  _initPromise = kc
    .init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256',
      enableLogging: true,
    })
    .then((authenticated) => {
      console.log('[Keycloak] Init result:', authenticated);
      console.log('[Keycloak] Token:', kc.token?.substring(0, 30));
      console.log('[Keycloak] User:', kc.tokenParsed?.preferred_username);

      // Clean up URL
      if (window.location.hash) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Token refresh
      if (authenticated) {
        setInterval(() => {
          kc.updateToken(30).catch(() => {
            console.log('[Keycloak] Token refresh failed');
          });
        }, 10000);
      }

      return authenticated;
    })
    .catch((err) => {
      console.error('[Keycloak] Init error:', err);
      throw err;
    });

  return _initPromise;
}

export function login() {
  return kc.login();
}

export function logout() {
  return kc.logout({ redirectUri: window.location.origin + '/' });
}

export default kc;
