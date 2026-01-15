
import React from 'react'

export default function PixSend(){
  const [dest,setDest] = React.useState('')
  const [amount,setAmount] = React.useState('0.00')
  const [ok,setOk] = React.useState(false)

  function simulate(){
    fetch(import.meta.env.VITE_API_BASE + '/pix/send', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ from_account: 'acc-001', to: dest, amount: Number(amount) })
    }).then(r=>r.json()).then(_=> { const id = _?.receipt?.id; if(id){ location.hash = '/pix/receipt/' + id } else { setOk(true) } }).catch(()=>setOk(true))
  }

  return (
    <div className="container" style={{padding:20}}>
      <h2>Enviar PIX</h2>
      <div className="soft-card" style={{padding:16, display:'flex', gap:8, flexWrap:'wrap'}}>
        <input value={dest} onChange={e=>setDest(e.target.value)} placeholder="CPF, e-mail, phone ou chave aleatória" />
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Valor" />
        <button className="btn btn-primary" onClick={simulate}>Enviar (simulado)</button>
      </div>
      {ok && <div className="soft-card" style={{padding:16, marginTop:12}}>PIX enviado. Comprovante simples gerado abaixo.</div>}
    </div>
  )
}
