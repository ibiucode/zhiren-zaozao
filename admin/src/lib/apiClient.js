/**
 * Admin API client（集中管理對後端的呼叫）。
 * - token 存於 localStorage，請求自動帶 Authorization: Bearer。
 * - 收到 401 時派發 'admin-unauthorized' 事件，由 AuthContext 接手登出。
 */
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const TOKEN_KEY = 'zhiren_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    window.dispatchEvent(new Event('admin-unauthorized'))
    throw new ApiError('未授權或登入已過期', 401)
  }
  if (!res.ok) {
    let detail
    try {
      detail = (await res.json()).detail
    } catch {
      /* ignore parse error */
    }
    throw new ApiError(detail || `${res.status} ${res.statusText}`, res.status)
  }
  if (res.status === 204) return null
  return res.json()
}
