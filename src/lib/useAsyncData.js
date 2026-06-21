import { useEffect, useState } from 'react'

/**
 * 通用非同步資料載入 hook。
 * 讓頁面以一致方式呼叫 service 層（皆回傳 Promise），並取得 loading / error 狀態。
 * 因為 service 介面在 mock 與真實 API 之間一致，未來接 backend 時頁面無需修改。
 *
 * @param {() => Promise<any>} fetcher 一個回傳 Promise 的函式（通常是 service 函式）
 * @param {Array} deps 相依陣列（變動時重新載入）
 * @returns {{ data: any, loading: boolean, error: Error | null }}
 */
export function useAsyncData(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    fetcher()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err) => {
        if (active) setError(err)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
