import axios from 'axios'
import kc from '../auth/keycloak'
import { CFG } from '../config'
const api = axios.create({ baseURL: CFG.VITE_API_BASE || 'http://localhost:8080' })
api.interceptors.request.use(cfg=>{ const kc=kc; if(kc && kc.authenticated){ cfg.headers=cfg.headers||{}; cfg.headers['Authorization']=`Bearer ${kc.token}` } return cfg })
export default api