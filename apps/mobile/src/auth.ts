import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID } from './config'

const discovery = {
  authorizationEndpoint: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`,
  tokenEndpoint: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
  revocationEndpoint: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/revoke`,
  userInfoEndpoint: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`
}

export async function signIn(): Promise<string | null> {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'athenapay' })
  const req = new AuthSession.AuthRequest({
    clientId: KEYCLOAK_CLIENT_ID,
    redirectUri,
    responseType: 'code',
    scopes: ['openid','profile','email'],
    usePKCE: true
  })
  await req.makeAuthUrlAsync(discovery)
  const res = await req.promptAsync(discovery, { useProxy: false })
  if (res.type !== 'success' || !res.params.code) return null

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: res.params.code,
    client_id: KEYCLOAK_CLIENT_ID,
    redirect_uri: redirectUri,
    code_verifier: req.codeVerifier || ''
  }).toString()

  const tok = await fetch(discovery.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type':'application/x-www-form-urlencoded' },
    body
  }).then(r=>r.json())

  if (tok?.access_token) {
    await SecureStore.setItemAsync('access_token', tok.access_token)
    return tok.access_token as string
  }
  return null
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('access_token')
}

export async function signOut() {
  await SecureStore.deleteItemAsync('access_token')
}
