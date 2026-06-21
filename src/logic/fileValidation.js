/**
 * 3D 檔案檢查邏輯（client 端）。
 *
 * 分工（Phase 5 後）：
 * - 本模組：client 端的「淺層」檢查（副檔名、大小），送出前先擋掉明顯錯誤。
 * - 真正的網格分析（尺寸、破面、三角面數）在 backend，由 `src/services/quoteService.js`
 *   的 checkFile() 呼叫 POST /api/quote/check-file 完成（重運算放後端）。
 *
 * 此模組為純函式，不得 import React。
 */

/** 規劃支援的 3D 檔案格式。 */
export const ACCEPTED_FILE_FORMATS = ['stl', 'obj', 'step', 'stp']

/** 規劃的單檔大小上限（bytes），此處先以 50MB 為佔位值。 */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

/**
 * 取得副檔名（小寫）。
 * @param {string} filename
 * @returns {string}
 */
export function getFileExtension(filename = '') {
  const idx = filename.lastIndexOf('.')
  return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : ''
}

/**
 * 基本檔案檢查（僅格式與大小的淺層檢查；不做網格分析）。
 * 用於送出前的 client 端預檢；通過後再交給 backend 做網格分析。
 * @param {{ name: string, size: number }} file
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateFileBasic(file) {
  const errors = []
  if (!file) {
    return { valid: false, errors: ['未提供檔案'] }
  }
  const ext = getFileExtension(file.name)
  if (!ACCEPTED_FILE_FORMATS.includes(ext)) {
    errors.push(`不支援的格式：.${ext || '未知'}`)
  }
  if (typeof file.size === 'number' && file.size > MAX_FILE_SIZE_BYTES) {
    errors.push('檔案超過大小上限')
  }
  return { valid: errors.length === 0, errors }
}

/**
 * 深層網格分析（破面 / 尺寸 / 三角面數）。
 * 已於 Phase 5 實作於 backend；前端請改用 `src/services/quoteService.js` 的 checkFile()。
 * 壁厚分析與自動估價核心仍為未來工作。
 */
