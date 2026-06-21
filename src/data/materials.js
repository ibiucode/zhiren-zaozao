/**
 * 材料（placeholder）。對齊 SKILL.md 的 Material 資料模型：
 * id, name, description, color_options(=colorOptions), properties, image, is_active(=isActive), sort_order(=sortOrder)
 * Phase 2 後改由 GET /api/materials 提供。
 * 註：image 暫以 null 表示，UI 端以色塊 placeholder 呈現。
 */
export const materials = [
  {
    id: 'pla',
    name: 'PLA',
    description: '最易列印、表面細緻，適合外觀件、模型與一般展示用途。',
    colorOptions: ['白', '黑', '灰', '紅', '橘', '透明'],
    properties: { strength: '中', heatResistance: '低', detail: '高' },
    image: null,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'petg',
    name: 'PETG',
    description: '兼具強度與韌性、耐候性佳，適合功能件與戶外使用。',
    colorOptions: ['黑', '白', '透明', '藍'],
    properties: { strength: '高', heatResistance: '中', detail: '中' },
    image: null,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'abs',
    name: 'ABS',
    description: '耐溫耐衝擊，可後製拋光，常用於工業零件與外殼。',
    colorOptions: ['黑', '白', '灰'],
    properties: { strength: '高', heatResistance: '高', detail: '中' },
    image: null,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'tpu',
    name: 'TPU 軟性',
    description: '具彈性與耐磨性，適合護套、墊片與需要彎曲的零件。',
    colorOptions: ['黑', '白', '紅'],
    properties: { strength: '中', heatResistance: '中', detail: '中' },
    image: null,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'resin',
    name: '光固化樹脂',
    description: '極高細節與光滑表面，適合公仔、珠寶與精密原型。',
    colorOptions: ['灰', '白', '透明', '膚色'],
    properties: { strength: '中', heatResistance: '中', detail: '極高' },
    image: null,
    isActive: true,
    sortOrder: 5,
  },
]
