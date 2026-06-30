/**
 * 首頁「我們的專業」能力卡（前端靜態內容；非 CMS，不動 schema）。
 * imageUrl 預留：未來填入圖片 URL 即可自動替換 placeholder。
 * to：與大型製作最相關的卡片可點擊導向 /large-production。
 */
export const capabilities = [
  {
    id: 'large-print',
    title: '大型列印製作',
    desc: '適合大型展示件、商業道具與結構本體製作，依尺寸與用途規劃列印方式。',
    imageUrl: null,
    to: '/large-production',
  },
  {
    id: 'part-splitting',
    title: '模型拆件規劃',
    desc: '依尺寸、接縫、強度與後處理需求進行分件，降低製作與組裝風險。',
    imageUrl: null,
    to: '/large-production',
  },
  {
    id: 'prototyping',
    title: '工程原型打樣',
    desc: '協助設計驗證、功能測試與小量試作，讓概念更快進入實體檢查。',
    imageUrl: null,
  },
  {
    id: 'base-display',
    title: '底座展示整合',
    desc: '可依展示需求規劃底座、支撐結構與組裝方式，提升成品穩定性。',
    imageUrl: null,
    to: '/large-production',
  },
  {
    id: 'finishing',
    title: '毛胚整理與表面處理',
    desc: '從列印完成後的毛胚檢查、接縫修整到上色前處理，保留後製彈性。',
    imageUrl: null,
  },
  {
    id: 'painting',
    title: '烤漆上色加值',
    desc: '依展示需求進行底漆、噴塗與局部上色，使模型更接近展示用途。',
    imageUrl: null,
  },
]
