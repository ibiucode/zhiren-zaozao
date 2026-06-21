/**
 * 表單值與 API 值之間的轉換。
 * list/keyval 在表單中以多行字串編輯，送出 / 載入時轉成陣列 / 物件。
 */

export function toFormValue(field, apiValue) {
  switch (field.type) {
    case 'list':
      return Array.isArray(apiValue) ? apiValue.join('\n') : ''
    case 'keyval':
      return apiValue && typeof apiValue === 'object'
        ? Object.entries(apiValue).map(([k, v]) => `${k}: ${v}`).join('\n')
        : ''
    case 'boolean':
      return !!apiValue
    case 'number':
      return apiValue ?? 0
    case 'date':
      return apiValue || ''
    default:
      return apiValue ?? ''
  }
}

export function toApiValue(field, formValue) {
  switch (field.type) {
    case 'list':
      return String(formValue)
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    case 'keyval': {
      const obj = {}
      String(formValue)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => {
          const idx = line.indexOf(':')
          if (idx > 0) obj[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
        })
      return obj
    }
    case 'boolean':
      return !!formValue
    case 'number':
      return Number(formValue) || 0
    case 'date':
      return formValue || null
    default:
      return formValue
  }
}

export function defaultFormValue(field) {
  switch (field.type) {
    case 'boolean':
      return true
    case 'number':
      return 0
    default:
      return ''
  }
}

/** 將 ISO 日期時間字串格式化為易讀字串。 */
export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 列表表格的儲存格顯示。 */
export function displayCell(value) {
  if (value === true) return '✓'
  if (value === false) return '✗'
  if (Array.isArray(value)) return value.join(', ')
  if (value == null) return '—'
  const s = String(value)
  return s.length > 40 ? s.slice(0, 40) + '…' : s
}
