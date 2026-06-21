/**
 * 作品集（placeholder）。對齊 SKILL.md 的 PortfolioItem 資料模型：
 * id, title, description, images, material_id(=materialId), service_id(=serviceId),
 * tags, is_featured(=isFeatured), sort_order(=sortOrder)
 * Phase 2 後改由 GET /api/portfolio 提供。
 * 註：images 暫以 null 表示，UI 端以 placeholder 圖塊呈現（不依賴外部圖片）。
 */

/** 作品分類（供作品頁篩選使用）。 */
export const portfolioCategories = [
  { id: 'all', label: '全部' },
  { id: 'prototype', label: '工業原型' },
  { id: 'figure', label: '公仔模型' },
  { id: 'product', label: '產品設計' },
  { id: 'custom', label: '客製小物' },
]

export const portfolioItems = [
  {
    id: 'pf-001',
    title: '工業夾具原型',
    category: 'prototype',
    materialId: 'petg',
    serviceId: 'fdm-printing',
    description: '為自動化產線開發的客製夾具，經多次迭代驗證後量產。',
    images: null,
    tags: ['功能件', 'PETG', '迭代開發'],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: 'pf-002',
    title: '角色公仔（光固化）',
    category: 'figure',
    materialId: 'resin',
    serviceId: 'post-processing',
    description: '高細節光固化列印，含手工上色與保護塗層的完整後處理。',
    images: null,
    tags: ['樹脂', '上色', '高細節'],
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: 'pf-003',
    title: '消費電子外殼',
    category: 'product',
    materialId: 'abs',
    serviceId: 'custom-build',
    description: '從 3D 建模到成品，協助新創團隊完成產品外觀打樣。',
    images: null,
    tags: ['ABS', '外殼', '打樣'],
    isFeatured: true,
    sortOrder: 3,
  },
  {
    id: 'pf-004',
    title: '客製鑰匙圈系列',
    category: 'custom',
    materialId: 'pla',
    serviceId: 'fdm-printing',
    description: '企業活動小物，雙色列印，小批量快速交付。',
    images: null,
    tags: ['PLA', '雙色', '小批量'],
    isFeatured: false,
    sortOrder: 4,
  },
  {
    id: 'pf-005',
    title: '機構連桿原型',
    category: 'prototype',
    materialId: 'abs',
    serviceId: 'model-repair',
    description: '客戶提供之模型先行修復破面，再列印驗證機構運作。',
    images: null,
    tags: ['ABS', '機構', '修復'],
    isFeatured: false,
    sortOrder: 5,
  },
  {
    id: 'pf-006',
    title: '桌面收納設計',
    category: 'product',
    materialId: 'pla',
    serviceId: 'custom-build',
    description: '模組化桌面收納，依使用者需求客製尺寸與配色。',
    images: null,
    tags: ['PLA', '模組化', '設計'],
    isFeatured: false,
    sortOrder: 6,
  },
]
