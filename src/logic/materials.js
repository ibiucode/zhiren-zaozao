/**
 * 材料規則邏輯（placeholder / 骨架）。
 *
 * ⚠️ Phase 1 僅提供最基本的純資料處理 helper，不含正式的材料推薦演算法。
 * 未來（Phase 4/5）可依用途、強度、耐溫、預算等條件做更完整的推薦規則。
 *
 * 此模組為純函式，不得 import React。
 */

/**
 * 將材料陣列轉為表單可用的選項格式。
 * @param {Array} materials Material[]（來自 service / data）
 * @returns {Array<{ value: string, label: string }>}
 */
export function toMaterialOptions(materials = []) {
  return materials.map((m) => ({ value: m.id, label: m.name }))
}

/**
 * 依用途推薦材料（尚未實作正式規則）。
 * @param {Object} _criteria 例如 { usage, strength, heatResistance, budget }
 * @param {Array} materials
 * @returns {{ implemented: boolean, recommended: Array }}
 */
export function recommendMaterials(_criteria, materials = []) {
  // TODO(Phase 4/5): 依條件過濾與排序，回傳推薦材料清單。
  return { implemented: false, recommended: materials }
}
