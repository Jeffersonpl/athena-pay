
import React from 'react'

function gen(){
  const rand = () => Math.random().toString().slice(2,6)
  return `5452 ${rand()} ${rand()} ${rand()}`
}
export default function CartaoVirtual(){
  const [num,setNum] = React.useState(gen())
  return (<div className="container" style={{padding:20}}>
    <h2>Cartão virtual</h2>
    <div className="card-neo" style={{padding:16}}>
      <div style={{fontWeight:800, fontSize:20}}>Athena • Virtual</div>
      <div style={{marginTop:10, letterSpacing:2}}>{num}</div>
      <div className="muted" style={{marginTop:8}}>Uso simulado para teste.</div>
      <button className="btn" onClick={()=>setNum(gen())} style={{marginTop:12}}>Gerar novo</button>
    </div>
  </div>)
}
