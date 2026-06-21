/**
 * Admin API 呼叫集中於此（對應 backend /api/admin/*）。
 */
import { apiRequest, getToken } from '../lib/apiClient.js'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const login = (username, password) =>
  apiRequest('/api/admin/login', { method: 'POST', body: { username, password }, auth: false })

export const getMe = () => apiRequest('/api/admin/me')

// 通用資源 CRUD（resource = services | materials | portfolio | news | faq）
export const listResource = (resource) => apiRequest(`/api/admin/${resource}`)
export const createResource = (resource, data) =>
  apiRequest(`/api/admin/${resource}`, { method: 'POST', body: data })
export const updateResource = (resource, id, data) =>
  apiRequest(`/api/admin/${resource}/${id}`, { method: 'PATCH', body: data })
export const deleteResource = (resource, id) =>
  apiRequest(`/api/admin/${resource}/${id}`, { method: 'DELETE' })

// 詢價單（Phase 4）
export const listInquiries = (status) =>
  apiRequest(`/api/admin/inquiries${status ? `?status=${encodeURIComponent(status)}` : ''}`)
export const getInquiry = (id) => apiRequest(`/api/admin/inquiries/${id}`)
export const updateInquiry = (id, data) =>
  apiRequest(`/api/admin/inquiries/${id}`, { method: 'PATCH', body: data })

/** 下載詢價附件（帶 JWT，取 blob 後觸發瀏覽器下載）。 */
export async function downloadInquiryFile(inquiryId, fileId, filename) {
  const res = await fetch(
    `${BASE}/api/admin/inquiries/${inquiryId}/files/${fileId}/download`,
    { headers: { Authorization: `Bearer ${getToken()}` } },
  )
  if (!res.ok) throw new Error(`下載失敗（${res.status}）`)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `file-${fileId}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// 網站設定
export const getSiteSettings = () => apiRequest('/api/admin/site-settings')
export const patchSiteSettings = (data) =>
  apiRequest('/api/admin/site-settings', { method: 'PATCH', body: data })
export const patchContactSettings = (data) =>
  apiRequest('/api/admin/contact-settings', { method: 'PATCH', body: data })
