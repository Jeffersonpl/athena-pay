import React from 'react'
import kc, { initKC } from './auth/keycloak'
import { useTheme } from './ui/useTheme'

function AppBar({onLogout}:{onLogout:()=>void}){
  const { theme, toggle } = useTheme()
  const name = kc?.tokenParsed?.name || 'você'
  return <div className="appbar">
    <div className="brand">Athena</div>
    <div style={{display:'flex', gap:8}}>
      <button className="btn" onClick={toggle}>{theme==='light'?'🌙':'☀️'}</button>
      <button className="btn" onClick={onLogout}>Sair</button>
    </div>
  </div>
}

function Home(){
  const [hidden,setHidden] = React.useState(false)
  return <div>
    <AppBar onLogout={()=>kc.logout({redirectUri: window.location.origin + '/'})} />
    <div className="container">
      <div className="big" style={{marginBottom:12}}>Olá, {(kc?.tokenParsed?.given_name)||'usuário'}!</div>
      <div className="card" style={{marginBottom:12}}>
        <div className="muted">Saldo</div>
        <div className="big">{hidden?'R$ •••••':'R$ 12.345,67'}</div>
        <div className="muted" style={{cursor:'pointer'}} onClick={()=>setHidden(!hidden)}>{hidden?'Exibir':'Ocultar'}</div>
      </div>
      <div className="quick">
        <button className="btn">Pagar</button>
        <button className="btn">Transferir</button>
        <button className="btn">Cartões</button>
        <button className="btn">PIX</button>
      </div>
    </div>
  </div>
}

export default function MobileApp(){
  const [ready,setReady]=React.useState(false)
  const [auth,setAuth]=React.useState(false)
  React.useEffect(()=>{ initKC().then((ok)=>{ setAuth(!!ok); setReady(true) }) },[])
  if(!ready) return <div style={{padding:20}}>Inicializando…</div>
  if(!auth) return <div style={{padding:20}}><button className="btn" onClick={()=>kc.login({redirectUri: window.location.origin + '/'})}>Entrar</button></div>
  return <Home />
}
