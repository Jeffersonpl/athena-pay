import Keycloak from 'keycloak-js'
const R: any = (window as any).__APP_CONFIG__ || {}
const cfg = { url: R.VITE_KEYCLOAK_URL, realm: R.VITE_KEYCLOAK_REALM || 'athena', clientId: R.VITE_KEYCLOAK_CLIENT_ID || 'mobile-web' }
const kc = new Keycloak(cfg)
export async function initKC(){ await kc.init({ onLoad:'check-sso', pkceMethod:'S256', flow:'standard', checkLoginIframe:false, silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' }) }
export default kc
