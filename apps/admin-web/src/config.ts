declare global { interface Window { __APP_CONFIG__?: any; CFG?: any } }
const g = (typeof window !== 'undefined' ? (window as any).CFG || (window as any).__APP_CONFIG__ : undefined) || {}
export const CFG = {
  VITE_KEYCLOAK_URL: g.VITE_KEYCLOAK_URL || import.meta.env.VITE_KEYCLOAK_URL,
  VITE_KEYCLOAK_REALM: g.VITE_KEYCLOAK_REALM || import.meta.env.VITE_KEYCLOAK_REALM,
  VITE_KEYCLOAK_CLIENT_ID: g.VITE_KEYCLOAK_CLIENT_ID || import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  VITE_API_BASE: g.VITE_API_BASE || import.meta.env.VITE_API_BASE,
  VITE_CARD_BASE: g.VITE_CARD_BASE || import.meta.env.VITE_CARD_BASE,
  VITE_CONFIG_BASE: g.VITE_CONFIG_BASE || import.meta.env.VITE_CONFIG_BASE,
}
