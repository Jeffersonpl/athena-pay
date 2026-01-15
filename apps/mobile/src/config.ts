import Constants from 'expo-constants'
const extra = (Constants.expoConfig || (Constants as any).manifest)?.extra || {}
export const KEYCLOAK_URL = extra.KEYCLOAK_URL || 'http://localhost:8081'
export const KEYCLOAK_REALM = extra.KEYCLOAK_REALM || 'athena'
export const KEYCLOAK_CLIENT_ID = extra.KEYCLOAK_CLIENT_ID || 'mobile-app'
export const API_BASE = extra.API_BASE || 'http://localhost:8080'
export const CARD_BASE = extra.CARD_BASE || 'http://localhost:9084'
export const CONFIG_BASE = extra.CONFIG_BASE || 'http://localhost:9085'
