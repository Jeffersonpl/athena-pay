import React, { useEffect, useState } from 'react'
import api from '../api/http'
export default function Themes(){
  const base = (import.meta as any).env.VITE_CONFIG_BASE || 'http://localhost:9085'
  const [themes,setThemes]=useState<any[]>([])
  const [name,setName]=useState('Athena NeoGold')
  const [primary,setPrimary]=useState('#C7A008')
  const [accent,setAccent]=useState('#00E5D8')
  const [bg,setBg]=useState('#FFF7EC')
  const load=async()=>{ const r=await fetch(base+'/themes'); setThemes(await r.json()) }
  const create=async()=>{ await fetch(base+'/themes',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,primary,accent,bg})}); await load() }
  useEffect(()=>{ load() },[])
  return <div className="card"><h2>Temas</h2>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr auto',gap:8}}>
      <input className="input" value={name} onChange={e=>setName(e.target.value)}/>
      <input className="input" value={primary} onChange={e=>setPrimary(e.target.value)}/>
      <input className="input" value={accent} onChange={e=>setAccent(e.target.value)}/>
      <input className="input" value={bg} onChange={e=>setBg(e.target.value)}/>
      <button className="button" onClick={create}>Criar</button>
    </div>
    <div style={{height:12}}/>
    <ul>{themes.map((t:any)=><li key={t.id}>{t.name} — {t.primary}/{t.accent}/{t.bg}</li>)}</ul>
  </div>
}
