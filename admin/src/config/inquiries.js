/** 詢價狀態設定（與 backend INQUIRY_STATUSES 對齊）。 */
export const INQUIRY_STATUSES = [
  { value: 'new', label: '新詢價', color: '#2f9bff' },
  { value: 'in_review', label: '處理中', color: '#ff6a1a' },
  { value: 'quoted', label: '已報價', color: '#36c98d' },
  { value: 'closed', label: '已結案', color: '#6b727c' },
]

const byValue = Object.fromEntries(INQUIRY_STATUSES.map((s) => [s.value, s]))

export const statusLabel = (v) => byValue[v]?.label || v
export const statusColor = (v) => byValue[v]?.color || '#6b727c'
