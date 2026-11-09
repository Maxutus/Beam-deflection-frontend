import { Api } from './Api'

export const api = new Api<string>({
  baseURL: '/api',
  securityWorker: (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
})
