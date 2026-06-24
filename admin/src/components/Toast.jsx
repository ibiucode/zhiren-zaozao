import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

/**
 * 輕量 toast 通知：操作成功/失敗時顯示右上角彈窗，2.8 秒自動消失，可點擊關閉。
 * 用 useToast() 取得 { success, error }。
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random()}`
      setToasts((list) => [...list, { id, message, type }])
      setTimeout(() => remove(id), 2800)
    },
    [remove],
  )

  const api = {
    success: (m) => show(m, 'success'),
    error: (m) => show(m, 'error'),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-wrap" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => remove(t.id)}>
            <span className="toast-icon">{t.type === 'success' ? '✓' : '✕'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
