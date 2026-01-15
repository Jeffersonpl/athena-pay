
import React from 'react'
import { Link } from 'react-router-dom'

export default function PixIndex(){
  return (
    <div className="container" style={{padding:20}}>
      <h2>PIX</h2>
      <div className="quick-grid" style={{marginTop:12}}>
        <Link className="quick-item" to="/pix/send">Enviar</Link>
        <Link className="quick-item" to="/pix/receive">Receber</Link>
        <Link className="quick-item" to="/pix/keys">Minhas chaves</Link>
      </div>
    </div>
  )
}
