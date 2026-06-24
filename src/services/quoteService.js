/**
 * 3D 檔案檢查 / 上傳服務（Phase 5）。
 * 使用 multipart/form-data，故不走 apiClient（JSON）而直接 fetch。
 * 需要後端（VITE_API_BASE_URL）；mock 模式下無法分析檔案。
 */
const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function postFile(path, file) {
  const fd = new FormData()
  fd.append('file', file)
  // 不要手動設 Content-Type，讓瀏覽器帶上 multipart boundary。
  const res = await fetch(`${BASE}${path}`, { method: 'POST', body: fd, cache: 'no-store' })
  if (!res.ok) {
    let detail
    try {
      detail = (await res.json()).detail
    } catch {
      /* ignore */
    }
    throw new Error(detail || `${res.status} ${res.statusText}`)
  }
  return res.json()
}

/** 即時檢查檔案（不落庫）。回傳 { fileName, fileSize, fileFormat, checkStatus, checkResult }。 */
export const checkFile = (file) => postFile('/api/quote/check-file', file)

/** 將檔案附加到指定詢價單（落庫）。 */
export const uploadInquiryFile = (inquiryId, file) =>
  postFile(`/api/inquiries/${inquiryId}/files`, file)
