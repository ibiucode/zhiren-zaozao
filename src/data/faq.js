/**
 * 常見問題（placeholder）。對齊 SKILL.md 的 FAQItem 資料模型：
 * id, question, answer, category, sort_order(=sortOrder), is_published(=isPublished)
 * Phase 2 後改由 GET /api/faq 提供。
 */
export const faqItems = [
  {
    id: 'faq-001',
    question: '我沒有 3D 檔案，可以幫忙建模嗎？',
    answer:
      '可以。我們提供 3D 建模與設計服務，你只需要提供草圖、照片或描述需求，我們會協助完成可列印的模型。',
    category: '建模',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'faq-002',
    question: '支援哪些檔案格式？',
    answer:
      '常見的 STL、OBJ 與 STEP 都支援。若檔案有破面或尺寸問題，我們會在列印前協助檢查與修復。',
    category: '檔案',
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: 'faq-003',
    question: '一般要多久可以拿到成品？',
    answer:
      '視尺寸與數量而定，標準件通常 2–5 個工作天。急件可另行協調加速，會在報價時一併告知。',
    category: '交期',
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: 'faq-004',
    question: '費用怎麼計算？',
    answer:
      '報價會綜合材料用量、列印時間、後處理與數量等因素。目前估價由專人確認，未來將提供線上估價工具。',
    category: '報價',
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: 'faq-005',
    question: '可以幫忙上色或後處理嗎？',
    answer:
      '可以。我們提供去支撐、研磨、補土、噴漆、手繪與拋光等後處理服務，讓成品更接近你的期待。',
    category: '後處理',
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: 'faq-006',
    question: '我的設計會被保密嗎？',
    answer:
      '會。我們嚴格保護客戶的檔案與設計，不會用於其他用途或對外公開，必要時可簽署保密協議。',
    category: '保密',
    sortOrder: 6,
    isPublished: true,
  },
]
