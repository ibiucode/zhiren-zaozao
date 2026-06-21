/**
 * 估價邏輯（placeholder / 骨架）。
 *
 * ⚠️ Phase 1 不實作正式估價。此處僅保留未來擴充用的函式骨架與型別說明。
 * 正式估價（含自動估價核心）規劃於 Phase 5；屆時重邏輯應下移至 backend
 * 的 app/services，前端僅保留輸入整理與顯示前處理。
 *
 * 設計依據：SKILL.md 的 PriceSettings 資料模型
 *   { base_fee, price_per_gram, price_per_hour, material_multipliers, min_order_amount, currency }
 */

/**
 * 估算列印費用（尚未實作）。
 * @param {Object} params
 * @param {string} params.materialId   材料 id
 * @param {number} [params.weightGram] 預估重量（克）
 * @param {number} [params.hours]      預估列印時數
 * @param {number} [params.quantity]   數量
 * @param {Object} [params.priceSettings] 來自後端的 PriceSettings
 * @returns {{ implemented: boolean, estimate: number | null, note: string }}
 */
export function estimateQuote(params) {
  // TODO(Phase 5): 依 priceSettings 計算
  //   estimate = base_fee + weightGram * price_per_gram + hours * price_per_hour
  //   estimate *= material_multipliers[materialId]
  //   estimate = max(estimate, min_order_amount)
  return {
    implemented: false,
    estimate: null,
    note: '自動估價尚未開放，目前由專人確認報價。',
  }
}

/**
 * 是否已可提供自動估價（給 UI 判斷要不要顯示估價結果）。
 * Phase 1 固定回傳 false。
 */
export function isAutoQuoteAvailable() {
  return false
}
