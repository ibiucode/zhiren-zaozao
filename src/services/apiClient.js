/**
 * API client（集中管理所有後端呼叫）。
 *
 * Phase 1（MVP）：USE_MOCK 為 true，service 層直接回傳 src/data 的 placeholder。
 * Phase 2 起：在 .env 設定 VITE_API_BASE_URL 並將 VITE_USE_MOCK 設為 false，
 *            即可改打真實 FastAPI，頁面與元件完全不需修改。
 *
 * 規範：component 不得直接 fetch，一律透過 src/services 呼叫。
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// 未明確設定時：沒有 API base URL 就自動使用 mock。
export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' ||
  (import.meta.env.VITE_USE_MOCK === undefined && !API_BASE_URL) ||
  !API_BASE_URL

/**
 * 模擬非同步行為，讓 mock 與真實 API 的呼叫介面一致（皆回傳 Promise）。
 * 加一點點延遲，方便日後驗證 loading 狀態。
 */
export function mockResponse(data, delay = 150) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delay)
  })
}

/**
 * 真實 API 呼叫的薄封裝。Phase 1 不會被走到（USE_MOCK = true）。
 * @param {string} path 例如 '/api/services'
 * @param {RequestInit} options fetch 選項
 */
export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`)
  }
  return res.json()
}
