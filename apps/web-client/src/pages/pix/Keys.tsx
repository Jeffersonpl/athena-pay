
import React from 'react'
import api from '../../api/client'

export default function PixKeys(){
  const [list,setList] = React.useState<any[]>([])
  const [type,setType] = React.useState('cpf')
  const [key,setKey] = React.useState('')

  async function refresh(){
    const items = await api._unsafeFetch(`/pix/keys?account_id=acc-001`)
    setList(Array.isArray(items)? items : [])
  }
  React.useEffect(()=>{ refresh() }, [])

  async function add(){
    if(!key) return
    await api._unsafePost('/pix/keys', {account_id:'acc-001', type, key})
    setKey('')
    refresh()
  }

  return (
    <div className="container" style={{padding:20}}>
      <h2>Minhas chaves</h2>
      <div className="soft-card" style={{padding:14, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="cpf">CPF</option>
          <option value="email">E-mail</option>
          <option value="phone">Celular</option>
          <option value="random">Aleatória</option>
        </select>
        <input value={key} onChange={e=>setKey(e.target.value)} placeholder="sua chave" />
        <button className="btn btn-primary" onClick={add}>Cadastrar</button>
      </div>
      <div style={{marginTop:12}}>
        {list.length===0 && <div className="muted">Nenhuma chave cadastrada.</div>}
        {list.map((k:any,i:number)=>(
          <div key={i} className="soft-card" style={{padding:12, marginBottom:8}}>
            <b>{k.type}</b> – {k.key}
          </div>
        ))}
      </div>
    </div>
  )
}
