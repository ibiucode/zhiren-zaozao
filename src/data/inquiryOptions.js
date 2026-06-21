/**
 * 詢價表單的選項設定（placeholder）。
 * 服務類型與材料偏好的選項，於頁面端由 services / materials 資料衍生（單一來源），
 * 此檔僅集中「無法從其他資料衍生」的表單設定，例如交期選項。
 */
export const deadlineOptions = [
  { value: 'flexible', label: '不趕，品質優先' },
  { value: '1-week', label: '一週內' },
  { value: '3-days', label: '三天內（急件）' },
  { value: 'specific', label: '有指定日期（請於描述說明）' },
]
