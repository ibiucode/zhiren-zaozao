import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { clearToken, getToken, setToken } from '../lib/apiClient.js'
import { getMe, login as apiLogin } from '../services/adminApi.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken())
  const [user, setUser] = useState(null)

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    setUser(null)
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password)
    setToken(data.access_token)
    setTokenState(data.access_token)
    try {
      setUser(await getMe())
    } catch {
      /* /me 失敗不阻擋登入 */
    }
  }, [])

  // 任何 API 回 401 → 自動登出。
  useEffect(() => {
    window.addEventListener('admin-unauthorized', logout)
    return () => window.removeEventListener('admin-unauthorized', logout)
  }, [logout])

  // 已有 token 但尚未取得 user 時，補抓一次。
  useEffect(() => {
    if (token && !user) {
      getMe().then(setUser).catch(() => {})
    }
  }, [token, user])

  return (
    <AuthContext.Provider value={{ token, user, isAuthed: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
