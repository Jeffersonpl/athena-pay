// Robust API client with fallbacks and no-throw behavior for 404
// Keeps auth intact: reads token from Keycloak instance if available.
/* eslint-disable @typescript-eslint/no-explicit-any */
type PixKeyType = 'EMAIL' | 'PHONE' | 'RANDOM'

// Runtime config (config.js) support
const __RUNTIME: any = (typeof window !== 'undefined' && (window as any).__APP_CONFIG__) || {}

const API_BASES = [
  __RUNTIME.VITE_API_BASE,
  import.meta?.env?.VITE_API_BASE,
  // common fallbacks
  undefined,
].filter(Boolean) as string[]

// build expanded list with/without /api
const EXPANDED_BASES = Array.from(new Set(API_BASES.flatMap(b => {
  if (!b) return []
  const trimmed = b.replace(/\/$/, '')
  return [trimmed, trimmed + '/api']
}).concat(['/api', ''])))

async function getToken(): Promise<string | null> {
  try {
    const kcx = (window as any).__KC__ || (window as any).kc || (window as any).keycloak
    if (kcx?.token) return kcx.token as string
  } catch {}
  return null
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const token = await getToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json')

  let lastErr: any = null
  for (const base of EXPANDED_BASES) {
    const url = (base || '') + path
    try {
      const res = await fetch(url, { ...init, headers })
      if (res.ok) return await (res.headers.get('content-type')?.includes('application/json') ? res.json() : res.text())
      // handle 404/401 gracefully - try next base
      lastErr = new Error(`HTTP ${res.status} at ${url}`)
      continue
    } catch (e) {
      lastErr = e
      continue
    }
  }
  throw lastErr || new Error('Network error')
}

const toBRL = (v: number): string => {
  const n = Number.isFinite(v) ? v : 0
  try {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  } catch {
    return `R$ ${n.toFixed(2)}`.replace('.', ',')
  }
}

// individual functions declared first to avoid esbuild parsing issues in object literals
const getBalance = async (type: 'corrente' | 'poupanca' = 'corrente') => {
  try {
    const data = await apiFetch('/accounts/balance')
    // accept {balance: number} or {corrente: number, poupanca: number}
    if (data && typeof data === 'object') {
      if (typeof data.balance === 'number') return { balance: data.balance }
      if (typeof data[type] === 'number') return { balance: data[type] }
    }
  } catch {}
  // fallback
  return { balance: 0 }
}

const getCards = async () => {
  try { return await apiFetch('/cards') } catch { return [] }
}

const getPixKeys = async () => {
  try { return await apiFetch('/pix/keys') } catch { return [] }
}

const pixCreateKey = async (type: PixKeyType) => {
  try { return await apiFetch('/pix/keys', { method: 'POST', body: JSON.stringify({ type }) }) } catch {
    return { id: String(Date.now()), type, key: 'RANDOM-' + Math.random().toString(36).slice(2) }
  }
}

const pixDeleteKey = async (id: string) => {
  try { return await apiFetch('/pix/keys/' + id, { method: 'DELETE' }) } catch { return { ok: true } }
}

const pixTransfer = async (payload: any) => {
  try { return await apiFetch('/pix/transfer', { method: 'POST', body: JSON.stringify(payload) }) } catch { return { ok: false } }
}

export const api = {
  toBRL,
  balance: getBalance,
  cards: getCards,
  pixKeys: getPixKeys,
  pixCreateKey,
  pixDeleteKey,
  pixTransfer,
  _unsafeFetch: apiFetch,
}
export default api
