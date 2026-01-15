import React, { useState } from 'react'
import api from '../api/http'
export default function FeeMgmt(){
  const [cid,setCid]=useState('acme')
  const [json,setJson]=useState('{"methods":{"pix":0.006,"card_credit":0.029,"boleto":0.015},"fixed":0.5}')
  const save=async()=>{ await api.post(`/fees/${cid}`, JSON.parse(json)) }
  return <div className="card"><h2>Taxas</h2>
    <div style={{display:'grid',gridTemplateColumns:'1fr 2fr auto',gap:8}}>
      <input className="input" value={cid} onChange={e=>setCid(e.target.value)}/>
      <textarea className="input" rows={6} value={json} onChange={e=>setJson(e.target.value)}/>
      <button className="button" onClick={save}>Aplicar</button>
    </div>
  </div>
}
