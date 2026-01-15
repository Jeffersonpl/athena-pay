
import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import Keycloak from 'keycloak-js'
import './ui.css'
const kc = new Keycloak({ url: 'http://localhost:8081', realm: 'athena', clientId: 'admin' })
function Field({label, value, onChange}){ return <div><label>{label}</label><input className="input" value={value} onChange={e=>onChange(e.target.value)}/></div> }
function App(){
  const [token,setToken]=useState(null)
  const [fees,setFees]=useState('{"pix":0.003,"card_credit":0.025,"card_debit":0.015,"boleto":0.018}')
  const [fixed,setFixed]=useState('0.50')
  const [iss,setIss]=useState('0.02')
  const [pis,setPis]=useState('0.0065')
  const [cofins,setCofins]=useState('0.03')
  useEffect(()=>{ kc.init({ onLoad:'login-required', checkLoginIframe:false }).then(()=> setToken(kc.token)) },[])
  if(!token) return <div className="container"><div className="card"><h2>Autenticando...</h2></div></div>
  const auth = { headers: { Authorization: `Bearer ${token}` } }
  const setF = ()=>axios.post('http://localhost:8080/health').finally(()=>axios.post('http://payments-service:8080/admin/fees/cliente-x',{methods:JSON.parse(fees),fixed:parseFloat(fixed)},auth).then(()=>alert('OK')))
  const setG = ()=>axios.post('http://payments-service:8080/admin/gov/taxes',{iss:parseFloat(iss),pis:parseFloat(pis),cofins:parseFloat(cofins)},auth).then(()=>alert('OK'))
  return <div className="container"><div className="card"><h1>Admin • Athena</h1></div>
    <div className="row">
      <div className="card" style={{flex:1}}><h3>Taxas</h3><Field label="methods (JSON)" value={fees} onChange={setFees}/><Field label="fixed" value={fixed} onChange={setFixed}/><button className="btn" onClick={setF}>Salvar</button></div>
      <div className="card" style={{flex:1}}><h3>Impostos</h3><Field label="ISS" value={iss} onChange={setIss}/><Field label="PIS" value={pis} onChange={setPis}/><Field label="COFINS" value={cofins} onChange={setCofins}/><button className="btn" onClick={setG}>Salvar</button></div>
    </div>
  </div>
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
