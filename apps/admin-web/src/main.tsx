import './ui/theme.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import AppShell from './AppShell'

const el = document.getElementById('root')
if(!el){
  const e = document.createElement('div'); e.id='root'; document.body.appendChild(e)
}
createRoot(document.getElementById('root')!).render(<AppShell/>)
