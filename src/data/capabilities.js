/**
 * 首頁「我們的專業」能力卡（前端靜態內容；非 CMS，不動 schema）。
 * 平衡呈現整體服務，不偏單一項目。
 * imageUrl 預留：未來填入圖片 URL 即可自動替換 placeholder。
 * to：僅「大型製作」導向 /large-production（其餘不連結，避免首頁過度集中）。
 */
export const capabilities = [
  {
    id: 'large-production',
    title: '大型製作',
    desc: '大型展示件、活動道具與結構本體製作，依尺寸與用途規劃製程。',
    imageUrl: null,
    to: '/large-production',
  },
  {
    id: 'fdm-prototyping',
    title: 'FDM 工程打樣',
    desc: '功能件與結構件的快速打樣，適合設計驗證與組裝測試。',
    imageUrl: null,
  },
  {
    id: 'sla-precision',
    title: 'SLA 高精度樣品',
    desc: '高細節光固化樣品，適合外觀件、公仔與精密模型。',
    imageUrl: null,
  },
  {
    id: 'split-assembly',
    title: '模型拆件與組裝',
    desc: '依尺寸、接縫與強度拆件，規劃組裝與後處理流程。',
    imageUrl: null,
  },
  {
    id: 'finishing',
    title: '底座與表面處理',
    desc: '底座訂製、毛胚整理與表面處理，提升成品完成度。',
    imageUrl: null,
  },
  {
    id: 'small-batch',
    title: '小量客製製作',
    desc: '小批量客製與重複件製作，依需求調整數量與工法。',
    imageUrl: null,
  },
]
