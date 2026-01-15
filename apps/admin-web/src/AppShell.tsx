import React from 'react'
import kc, { initKeycloakOnce, login, logout } from './auth/keycloak'
import Console from './pages/Console'

export default function AppShell() {
  const [ready, setReady] = React.useState(false)
  const [authenticated, setAuthenticated] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    console.log('[AppShell] Starting...')

    initKeycloakOnce()
      .then((auth) => {
        console.log('[AppShell] Init complete, authenticated:', auth)
        setAuthenticated(auth)
        setReady(true)
      })
      .catch((err) => {
        console.error('[AppShell] Error:', err)
        setError(String(err))
        setReady(true)
      })
  }, [])

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8F1E6',
        color: '#0F1C2E'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Athena Admin</div>
          <div>Carregando...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>Erro</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#F8F1E6',
        color: '#0F1C2E',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          width: 400,
          background: 'white',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Athena Admin</div>
          <p style={{ color: '#666', marginBottom: 24 }}>Acesso administrativo ao sistema</p>
          <button
            onClick={() => login()}
            style={{
              background: '#E9B949',
              color: '#0F1C2E',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Entrar com Keycloak
          </button>
        </div>
      </div>
    )
  }

  return <Console />
}
