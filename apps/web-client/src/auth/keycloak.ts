import Keycloak from 'keycloak-js';

// Read configuration from /config.js (mounted at runtime) or Vite env
const runtime: any = (window as any).__APP_CONFIG__ || (window as any).config || {};

const KEYCLOAK_URL: string = runtime.VITE_KEYCLOAK_URL || import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081';
const KEYCLOAK_REALM: string = runtime.VITE_KEYCLOAK_REALM || import.meta.env.VITE_KEYCLOAK_REALM || 'athena';
const KEYCLOAK_CLIENT_ID: string = runtime.VITE_KEYCLOAK_CLIENT_ID || import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'web-client';

console.log('[Keycloak] Config:', { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID });

// Keycloak instance
const kc = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID,
});

// Expose globally for API client to get token
(window as any).__KC__ = kc;
(window as any).kc = kc;

// Helper to clean Keycloak params from URL after processing
function cleanUrl() {
  const hash = window.location.hash;
  // Check if hash contains Keycloak callback params
  if (hash.includes('state=') || hash.includes('code=') || hash.includes('error=') || hash.includes('session_state=')) {
    // Just go to clean root
    window.history.replaceState({}, document.title, window.location.pathname + '#/');
    // Notify hash router
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

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
      console.log('[Keycloak] User:', kc.tokenParsed?.preferred_username);

      // Clean up URL after Keycloak processed the callback
      cleanUrl();

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
      // Also clean URL on error (e.g., login_required is not a real error)
      cleanUrl();
      throw err;
    });

  return _initPromise;
}

export function login() {
  // Use origin without hash - Keycloak will add params to hash
  return kc.login({ redirectUri: window.location.origin + '/' });
}

export function logout() {
  return kc.logout({ redirectUri: window.location.origin + '/' });
}

// Legacy exports for compatibility
export const ensureLogin = login;
export const logoutToHome = logout;

export default kc;
