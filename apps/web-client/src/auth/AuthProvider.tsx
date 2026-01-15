import React from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import kc from './keycloak'
const kc = kc
export default function AuthProvider({children}:{children:React.ReactNode}){
  return <ReactKeycloakProvider authClient={kc} initOptions={{ onLoad:'check-sso', pkceMethod:'S256', silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' }}>{children}</ReactKeycloakProvider>
}
