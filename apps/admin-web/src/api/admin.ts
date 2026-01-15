import kc from '../auth/keycloak'
const runtime: any = (window as any).__APP_CONFIG__ || {}
const API_BASE: string = runtime.VITE_API_BASE || import.meta.env.VITE_API_BASE || ''

async function apiFetch(path: string, init?: RequestInit){
  const headers = new Headers(init?.headers || {})
  headers.set('Content-Type', 'application/json')
  try { await kc.updateToken(30) } catch {}
  if (kc?.token) headers.set('Authorization', 'Bearer ' + kc.token)
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

export const adminApi = {
  async accounts(){ try { return await apiFetch('/admin/accounts') } catch { return [
    { id:'u1', name:'Maria', type:'corrente', status:'ativa', balance: 3280.12 },
    { id:'u2', name:'João', type:'poupanca', status:'pendente', balance: 0 },
  ]}},
  async approvals(){ try { return await apiFetch('/admin/approvals') } catch { return [
    { id:'a1', name:'Luana', cpf:'000.111.222-33', kyc:'pendente' },
  ]}},
  async limits(){ try { return await apiFetch('/admin/limits') } catch { return [
    { id:'u1', name:'Maria', creditLimit: 5000 },
  ]}},
  async transactions(){ try { return await apiFetch('/admin/transactions') } catch { return [
    { id:'t1', at:'2025-10-01T12:00:00Z', who:'u1', desc:'PIX enviado', amount:-200 },
    { id:'t2', at:'2025-10-01T12:05:00Z', who:'u2', desc:'Depósito', amount:400 },
  ]}},
  async approve(id:string){ try { return await apiFetch('/admin/approve', { method:'POST', body: JSON.stringify({ id }) }) } catch { return { ok:true } } },
  async deny(id:string){ try { return await apiFetch('/admin/deny', { method:'POST', body: JSON.stringify({ id }) }) } catch { return { ok:true } } },
  async setLimit(id:string, limit:number){ try { return await apiFetch('/admin/limit', { method:'POST', body: JSON.stringify({ id, limit }) }) } catch { return { ok:true } } },
}
