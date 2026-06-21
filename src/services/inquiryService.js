/**
 * 詢價提交服務。對應 SKILL.md Public API 的 POST /api/inquiries。
 *
 * Mock 模式（VITE_USE_MOCK=true 或未設後端）：僅 console.log 並回傳模擬成功結果。
 * 串接後端後：實際 POST 到 FastAPI；成功（201）回傳建立的 inquiry 物件。
 * 兩種模式皆回傳統一形狀 { ok, id, status }，UI 端判斷邏輯不必依模式改變。
 */
import { USE_MOCK, apiRequest } from './apiClient.js'

/**
 * 送出詢價單。
 * @param {Object} payload 對齊 Inquiry 資料模型的欄位
 *   { name, email, phone, serviceType, materialPreference, description, deadline }
 * @returns {Promise<{ ok: boolean, id: (string|number), status?: string }>}
 */
export async function submitInquiry(payload) {
  if (USE_MOCK) {
    // Mock 模式：僅記錄於 console，模擬送出成功。
    console.log('[inquiryService] (mock) 收到詢價單：', payload)
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true, id: `mock-${Date.now()}`, status: 'new' }), 400)
    })
  }
  // 真實 API：apiRequest 在非 2xx 時會 throw，故走到這裡即代表 201 成功。
  // 後端回傳 { id, status, createdAt }，在此正規化成與 mock 一致的形狀。
  const created = await apiRequest('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return { ok: true, id: created.id, status: created.status }
}
