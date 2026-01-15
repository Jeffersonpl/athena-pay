import axios from 'axios'
import { API_BASE } from './config'
import { getToken } from './auth'

const api = axios.create({ baseURL: API_BASE })
api.interceptors.request.use(async (cfg)=>{
  const t = await getToken()
  if (t) { cfg.headers = cfg.headers || {}; (cfg.headers as any)['Authorization'] = `Bearer ${t}` }
  return cfg
})
export default api
