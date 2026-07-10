/**
 * FDM / SLA 服務頁內容（前端靜態；非 CMS）。
 * 材料區不在此定義內容，只列 materialIds，由頁面打 GET /api/materials 取得（後台可改）。
 * serviceId 用於詢價 CTA 的 ?service= 預填（對齊 services 資料的 id）。
 * 規格數字為目前對外的保守說法，實際依設備調整時改這裡即可。
 */
export const techServices = {
  fdm: {
    id: 'fdm',
    eyebrow: 'FDM · 熔融沉積成型',
    title: 'FDM 列印服務',
    description: '以工程塑料逐層堆疊成型，適合功能件、治具與大尺寸結構件的打樣與小量製作。',
    serviceId: 'fdm-printing',
    materialIds: ['pla', 'petg', 'abs', 'tpu'],
    materialNote: '以下為常備 FDM 耗材，特殊工程料可另洽詢。',
    specs: [
      { label: '常用層厚', value: '0.1 – 0.3 mm' },
      { label: '單件建議尺寸', value: '≤ 300 mm' },
      { label: '標準交期', value: '2 – 5 個工作天' },
      { label: '適合數量', value: '單件 ～ 小量' },
    ],
    strengths: [
      { id: 'function', title: '功能與結構件', desc: '以強度、韌性為取向選料，適合受力零件、治具與外殼。' },
      { id: 'large', title: '大尺寸與拆件', desc: '超過成型範圍的大型件可拆件列印再組裝，銜接大型製作流程。' },
      { id: 'iterate', title: '迭代成本低', desc: '單件成本低、修改重印快，適合開發中的設計驗證。' },
      { id: 'materials', title: '工程材料選擇', desc: 'PLA / PETG / ABS / TPU 依用途、環境與預算挑選。' },
    ],
    cases: ['工程原型', '治具 / 夾具', '外殼與支架', '機構驗證', '大型件本體', '小量重複件'],
    crossLink: { to: '/services/sla', label: '需要更高細節？看 SLA 服務 →' },
  },
  sla: {
    id: 'sla',
    eyebrow: 'SLA · 光固化成型',
    title: 'SLA 光固化服務',
    description: '以樹脂光固化成型，層紋細緻、表面光滑，適合外觀件、公仔與精密原型。',
    serviceId: 'fdm-printing',
    materialIds: ['resin'],
    materialNote: '一般樹脂之外，韌性 / 高溫 / 半透明樹脂可依需求安排。',
    specs: [
      { label: '常用層厚', value: '0.025 – 0.1 mm' },
      { label: '成型尺寸', value: '以中小型件為主' },
      { label: '標準交期', value: '2 – 5 個工作天' },
      { label: '後處理', value: '清洗＋二次固化' },
    ],
    strengths: [
      { id: 'detail', title: '高細節表現', desc: '細小特徵與曲面完整呈現，層紋遠低於 FDM。' },
      { id: 'surface', title: '表面光滑', desc: '成型面接近射出質感，適合直接展示或上色。' },
      { id: 'figure', title: '公仔與外觀件', desc: '角色模型、外觀打樣與展示樣品的主力工法。' },
      { id: 'post', title: '後處理銜接', desc: '清洗、二次固化到打磨上色，可交付展示等級成品。' },
    ],
    cases: ['公仔 / 角色模型', '外觀打樣', '精密原型', '珠寶 / 小物原模', '展示樣品', '翻模原型'],
    crossLink: { to: '/services/fdm', label: '需要功能件或大尺寸？看 FDM 服務 →' },
  },
}
