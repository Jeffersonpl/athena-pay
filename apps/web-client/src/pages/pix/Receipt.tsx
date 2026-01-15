
import React from 'react'
import api from '../../api/client'

export default function PixReceipt({ id }:{ id?: string }){
  const rid = id || (location.hash.match(/receipt\/([^?]+)/)?.[1] || '')
  const [rec, setRec] = React.useState<any>(null)
  React.useEffect(()=>{
    if(!rid) return
    fetch(import.meta.env.VITE_API_BASE + '/pix/receipts/' + rid).then(r=>r.json()).then(setRec).catch(()=>{})
  },[rid])
  if(!rid) return <div className="container" style={{padding:20}}>Comprovante não encontrado.</div>
  if(!rec) return <div className="container" style={{padding:20}}>Carregando comprovante…</div>
  return (
    <div className="container" style={{padding:20}}>
      <h2>Comprovante PIX</h2>
      <div className="card-neo" style={{padding:16}}>
        <div><b>ID:</b> {rec.id}</div>
        <div><b>De:</b> {rec.from}</div>
        <div><b>Para:</b> {rec.to}</div>
        <div><b>Valor:</b> R$ {Number(rec.amount).toFixed(2)}</div>
        <div className="muted" style={{marginTop:6}}>{new Date(rec.created_at).toLocaleString('pt-BR')}</div>
      </div>
      {rec.qrcode && <div className="soft-card" style={{padding:16, marginTop:12}}>
        <img src={'data:image/png;base64,' + rec.qrcode} alt="QR comprovante" style={{width:220,height:220}} />
      </div>}
      <div style={{marginTop:12}}>
        <button className="btn" onClick={()=> navigator.clipboard.writeText(JSON.stringify(rec))}>Copiar dados</button>
      </div>
    </div>
  )
}
