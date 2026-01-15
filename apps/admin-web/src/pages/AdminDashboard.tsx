import React from 'react';
import kc from '../auth/keycloak';

export default function Dashboard({ onLogout }:{ onLogout: ()=>void }){
  const user = (kc.tokenParsed as any) || {};
  const roles: string[] = (user?.realm_access?.roles) || [];
  const hasRole = (r:string)=> roles.includes(r);
  return (
    <div style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:700}}>Athena</div>
        <div>
          <span style={{marginRight:12, opacity:.8}}>Olá, {user.preferred_username || user.email || 'cliente'}!</span>
          <button onClick={onLogout} style={{padding:'6px 12px', border:'1px solid #ddd', borderRadius:8, cursor:'pointer'}}>Sair</button>
        </div>
      </div>

      <div style={{maxWidth:960, margin:'24px auto', padding:'0 16px'}}>
        <div style={{fontSize:20, fontWeight:600, marginBottom:12}}>Admin</div>
        <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
          <div style={{padding:16, border:'1px solid #eee', borderRadius:12, display: (hasRole('cto')||hasRole('admin')) ? 'block':'none'}}>
            <div style={{opacity:.7, fontSize:12}}>Saldo</div>
            <div style={{fontWeight:700, fontSize:24}}>R$ 12.345,67</div>
          </div>
          <div style={{padding:16, border:'1px solid #eee', borderRadius:12, display: (hasRole('cto')||hasRole('admin')) ? 'block':'none'}}>
            <div style={{opacity:.7, fontSize:12}}>Cartões</div>
            <div style={{fontWeight:700, fontSize:24}}>2 ativos</div>
          </div>
          <div style={{padding:16, border:'1px solid #eee', borderRadius:12, display: (hasRole('cto')||hasRole('admin')) ? 'block':'none'}}>
            <div style={{opacity:.7, fontSize:12}}>PIX</div>
            <div style={{fontWeight:700, fontSize:24}}>3 chaves</div>
          </div>
        </div>
      </div>
    </div>
  );
}
