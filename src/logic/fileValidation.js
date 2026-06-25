/**
 * 3D 檔案檢查邏輯（client 端）。
 *
 * 分工：
 * - 本模組：client 端的格式 / 大小「分級」判斷（送出前先擋）。
 * - 深層網格分析（破面、尺寸）在 backend，由 `src/services/quoteService.js` 的 checkFile() 完成。
 * - 3D 預覽（解析幾何）在 `src/lib/modelLoader.js`，純前端。
 *
 * 大小分級（避免塞爆 + 免費後端限制）：
 * - ≤ 100MB：可預覽、可線上上傳。
 * - 100–500MB：可預覽，但不可線上上傳 → 導向 LINE / email 由專人處理。
 * - > 500MB：不預覽、不上傳 → 同樣導向人工。
 *
 * 此模組為純函式，不得 import React。
 */

export const ACCEPTED_FILE_FORMATS = ['stl', 'obj', 'step', 'stp']

export const UPLOAD_MAX_BYTES = 100 * 1024 * 1024 // 100MB：線上上傳上限
export const PREVIEW_MAX_BYTES = 500 * 1024 * 1024 // 500MB：可預覽上限

/** 取得副檔名（小寫）。 */
export function getFileExtension(filename = '') {
  const idx = filename.lastIndexOf('.')
  return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : ''
}

export function formatBytes(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

/**
 * 對單一檔案做分級判斷。
 * @param {File} file
 * @returns {{
 *   ext: string, formatOk: boolean,
 *   sizeTier: 'ok' | 'preview-only' | 'too-big',
 *   canPreview: boolean, canUpload: boolean,
 *   error: string | null,
 * }}
 */
export function classifyFile(file) {
  const ext = getFileExtension(file?.name)
  const formatOk = ACCEPTED_FILE_FORMATS.includes(ext)
  const size = file?.size ?? 0

  let sizeTier = 'ok'
  if (size > PREVIEW_MAX_BYTES) sizeTier = 'too-big'
  else if (size > UPLOAD_MAX_BYTES) sizeTier = 'preview-only'

  let error = null
  if (!formatOk) {
    error = `不支援的格式：.${ext || '未知'}（僅支援 ${ACCEPTED_FILE_FORMATS.join(' / ').toUpperCase()}）`
  } else if (sizeTier === 'too-big') {
    error = `檔案 ${formatBytes(size)} 超過 ${formatBytes(PREVIEW_MAX_BYTES)}，無法線上處理。`
  }

  return {
    ext,
    formatOk,
    sizeTier,
    canPreview: formatOk && sizeTier !== 'too-big',
    canUpload: formatOk && sizeTier === 'ok',
    error,
  }
}
