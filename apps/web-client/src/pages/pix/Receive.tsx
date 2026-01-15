
import React from 'react'
import api from '../../api/client'

export default function PixReceive(){
  const [amount,setAmount] = React.useState<string>('10.00')
  const [qr,setQr] = React.useState<string>('')

  async function generate(){
    const res = await api._unsafePost('/pix/charge', {account_id:'acc-001', amount: Number(amount)})
    setQr(res?.qrcode || res?.qr_code || '' || '')
  }

  return (
    <div className="container" style={{padding:20}}>
      <h2>Receber com PIX</h2>
      <div className="soft-card" style={{padding:16, display:'flex', gap:8, flexWrap:'wrap'}}>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Valor" />
        <button className="btn btn-primary" onClick={generate}>Gerar QR Code</button>
      </div>
      {qr && (
        <div className="soft-card" style={{padding:16, marginTop:12}}>
          <img alt="QR" src={`data:image/png;base64,${qr}`} style={{width:220,height:220}}/>
          <div className="muted" style={{marginTop:8}}>Mostre este QR para o pagador.</div>
        </div>
      )}
    </div>
  )
}
