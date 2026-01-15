import React from 'react';

export default function Login({ onLogin }:{ onLogin: ()=>void }){
  return (
    <div style={{minHeight:'100vh', display:'grid', placeItems:'center', background:'#F8F1E6', color:'#0F1C2E', fontFamily:'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'}}>
      <div style={{width:860, background:'rgba(255,255,255,0.7)', borderRadius:24, padding:28, boxShadow:'0 10px 30px rgba(233,185,73,.25)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
        <div>
          <div style={{fontWeight:700}}>Athena Admin</div>
          <h1 style={{fontSize:30, lineHeight:1.1, margin:'12px 0 8px'}}>Acesso administrativo</h1>
          <p style={{opacity:.75}}>KYC, limites, auditoria e tarifas.</p>
          <button onClick={onLogin} className="athena-btn" style={{marginTop:20, padding:'10px 18px', borderRadius:999}}>Entrar</button>
        </div>
        <div style={{background:'linear-gradient(135deg,#FFD76F,#E9B949)', borderRadius:16, padding:16, display:'flex', alignItems:'end'}}>
          <div>
            <div style={{fontSize:18, fontWeight:800, color:'#0E0D0B'}}>Athena • Painel</div>
            <div style={{opacity:.8, color:'#0E0D0B'}}>Moderno e seguro</div>
          </div>
        </div>
      </div>
    </div>
  );
}
