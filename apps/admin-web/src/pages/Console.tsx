import React from 'react'
import kc, { logout } from '../auth/keycloak'
import { adminApi } from '../api/admin'
import { useTheme } from '../ui/useTheme'
import '../ui/theme.css'

type Tab = 'accounts'|'approvals'|'limits'|'transactions'

function Gate({ children }:{ children: React.ReactNode }){
  const roles = kc?.tokenParsed?.realm_access?.roles || []

  // Debug
  console.log('=== Gate Debug ===')
  console.log('kc.authenticated:', kc?.authenticated)
  console.log('kc.tokenParsed:', kc?.tokenParsed)
  console.log('realm_access.roles:', roles)
  console.log('hasRealmRole bank-admin:', kc?.hasRealmRole?.('bank-admin'))
  console.log('hasRealmRole admin:', kc?.hasRealmRole?.('admin'))

  const ok = !!(
    kc?.hasRealmRole?.('bank-admin') ||
    kc?.hasRealmRole?.('admin') ||
    kc?.hasResourceRole?.('admin', 'admin-web') ||
    roles.includes('bank-admin') ||
    roles.includes('admin')
  )
  console.log('Access OK:', ok)

  if (!ok) return <div style={{padding:24}}><h2>Acesso restrito</h2><p className="muted">Sua conta não possui as regras necessárias. Fale com um administrador.</p><pre style={{fontSize:10, marginTop:20}}>Debug: roles={JSON.stringify(roles)}</pre></div>
  return <>{children}</>
}

export default function Console(){
  const { theme, toggle } = useTheme()
  const [tab, setTab] = React.useState<Tab>('accounts')
  return (
    <Gate>
      <div className="appbar">
        <div className="brand">Athena • Admin</div>
        <div className="right" style={{display:'flex', gap:10, alignItems:'center'}}>
          <button className="btn" onClick={toggle}>{theme==='light' ? '🌙' : '☀️'}</button>
          <button className="btn" onClick={()=>logout()}>Sair</button>
        </div>
      </div>
      <div className="container" style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:18}}>
        <aside className="card" style={{padding:12}}>
          <NavItem onClick={()=>setTab('accounts')} active={tab==='accounts'}>Contas</NavItem>
          <NavItem onClick={()=>setTab('approvals')} active={tab==='approvals'}>Aprovações</NavItem>
          <NavItem onClick={()=>setTab('limits')} active={tab==='limits'}>Limite de crédito</NavItem>
          <NavItem onClick={()=>setTab('transactions')} active={tab==='transactions'}>Movimentações</NavItem>
        </aside>
        <main>
          {tab==='accounts' && <Accounts/>}
          {tab==='approvals' && <Approvals/>}
          {tab==='limits' && <Limits/>}
          {tab==='transactions' && <Transactions/>}
        </main>
      </div>
    </Gate>
  )
}

function NavItem({ children, active, onClick }:{ children:React.ReactNode, active?:boolean, onClick:()=>void}){
  return <div onClick={onClick} className="btn" style={{marginBottom:8, background: active ? 'var(--ink)' : 'var(--card)', color: active ? 'var(--bg)' : 'var(--ink)'}}>{children}</div>
}

function Accounts(){
  const [rows,setRows] = React.useState<any[]>([])
  React.useEffect(()=>{ adminApi.accounts().then(setRows).catch(()=>{}) },[])
  return (
    <div className="card">
      <h3>Contas</h3>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Cliente</th><th>Tipo</th><th>Status</th><th align="right">Saldo</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{borderTop:'1px solid var(--card-bd)'}}>
              <td>{r.name}</td><td align="center">{r.type}</td><td align="center">{r.status}</td><td align="right">{(r.balance||0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Approvals(){
  const [rows,setRows] = React.useState<any[]>([])
  React.useEffect(()=>{ adminApi.approvals().then(setRows).catch(()=>{}) },[])
  return (
    <div className="card">
      <h3>Pedidos de cadastro</h3>
      {rows.map(r => (
        <div key={r.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid var(--card-bd)'}}>
          <div><div style={{fontWeight:700}}>{r.name}</div><div className="muted">{r.cpf} • KYC: {r.kyc}</div></div>
          <div style={{display:'flex', gap:8}}>
            <button className="btn" onClick={()=>adminApi.approve(r.id)}>Aprovar</button>
            <button className="btn" onClick={()=>adminApi.deny(r.id)}>Rejeitar</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Limits(){
  const [rows,setRows] = React.useState<any[]>([])
  React.useEffect(()=>{ adminApi.limits().then(setRows).catch(()=>{}) },[])
  return (
    <div className="card">
      <h3>Limites de crédito</h3>
      {rows.map(r => (
        <LimitRow key={r.id} r={r} />
      ))}
    </div>
  )
}
function LimitRow({ r }:{ r:any }){
  const [val, setVal] = React.useState<number>(r.creditLimit||0)
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid var(--card-bd)'}}>
      <div><div style={{fontWeight:700}}>{r.name}</div><div className="muted">Atual: {(r.creditLimit||0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</div></div>
      <div style={{display:'flex', gap:8}}>
        <input type="number" value={val} onChange={(e)=>setVal(parseFloat(e.target.value||'0'))} style={{padding:'8px 10px', borderRadius:10, border:'1px solid var(--card-bd)', width:140, background:'var(--card)', color:'var(--ink)'}}/>
        <button className="btn" onClick={()=>adminApi.setLimit(r.id, val)}>Aplicar</button>
      </div>
    </div>
  )
}

function Transactions(){
  const [rows,setRows] = React.useState<any[]>([])
  React.useEffect(()=>{ adminApi.transactions().then(setRows).catch(()=>{}) },[])
  return (
    <div className="card">
      <h3>Movimentações</h3>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Data</th><th>Conta</th><th align="left">Descrição</th><th align="right">Valor</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} style={{borderTop:'1px solid var(--card-bd)'}}>
              <td className="muted">{new Date(r.at).toLocaleString('pt-BR')}</td>
              <td align="center">{r.who}</td>
              <td>{r.desc}</td>
              <td align="right" style={{color: r.amount>=0 ? 'lightgreen' : 'salmon', fontWeight:700}}>{r.amount.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
