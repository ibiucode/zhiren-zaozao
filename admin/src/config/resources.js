/**
 * 各內容資源的欄位設定，驅動通用的 ResourceManager（列表 + 表單）。
 * 對齊 backend 的 schema 欄位（camelCase）。
 *
 * field.type：text | textarea | number | boolean | date | list | keyval
 * - list：陣列，表單以「每行一項」編輯（如 details / tags / colorOptions）
 * - keyval：物件，表單以「key: value 每行一組」編輯（如 material properties）
 * field.createOnly：僅新增時可編輯（id 為主鍵 slug）
 */
export const RESOURCE_ORDER = ['services', 'materials', 'portfolio', 'news', 'faq']

export const resources = {
  services: {
    label: '服務項目',
    endpoint: 'services',
    columns: ['id', 'name', 'sortOrder', 'isActive'],
    fields: [
      { name: 'id', label: 'ID（slug，建立後不可改）', type: 'text', required: true, createOnly: true, placeholder: '例如 fdm-printing' },
      { name: 'name', label: '名稱', type: 'text', required: true },
      { name: 'icon', label: '圖示（符號）', type: 'text', placeholder: '例如 ⬢' },
      { name: 'description', label: '描述', type: 'textarea' },
      { name: 'details', label: '細項（每行一項）', type: 'list' },
      { name: 'linkTo', label: '連結（選填）', type: 'text', placeholder: '/services#materials' },
      { name: 'sortOrder', label: '排序', type: 'number' },
      { name: 'isActive', label: '啟用（顯示於前台）', type: 'boolean' },
    ],
  },
  materials: {
    label: '材料',
    endpoint: 'materials',
    columns: ['id', 'name', 'sortOrder', 'isActive'],
    fields: [
      { name: 'id', label: 'ID（slug，建立後不可改）', type: 'text', required: true, createOnly: true, placeholder: '例如 pla' },
      { name: 'name', label: '名稱', type: 'text', required: true },
      { name: 'description', label: '描述', type: 'textarea' },
      { name: 'colorOptions', label: '可選色（每行一項）', type: 'list' },
      { name: 'properties', label: '特性（每行 key: value）', type: 'keyval', placeholder: 'strength: 高\nheatResistance: 中\ndetail: 高' },
      { name: 'image', label: '圖片 URL（選填）', type: 'text' },
      { name: 'sortOrder', label: '排序', type: 'number' },
      { name: 'isActive', label: '啟用', type: 'boolean' },
    ],
  },
  portfolio: {
    label: '作品集',
    endpoint: 'portfolio',
    columns: ['id', 'title', 'category', 'isFeatured'],
    fields: [
      { name: 'id', label: 'ID（slug，建立後不可改）', type: 'text', required: true, createOnly: true, placeholder: '例如 pf-007' },
      { name: 'title', label: '標題', type: 'text', required: true },
      { name: 'category', label: '分類 id', type: 'text', placeholder: 'prototype / figure / product / custom' },
      { name: 'materialId', label: '材料 id', type: 'text', placeholder: '例如 pla' },
      { name: 'serviceId', label: '服務 id', type: 'text', placeholder: '例如 fdm-printing' },
      { name: 'description', label: '描述', type: 'textarea' },
      { name: 'tags', label: '標籤（每行一項）', type: 'list' },
      { name: 'sortOrder', label: '排序', type: 'number' },
      { name: 'isFeatured', label: '精選（首頁顯示）', type: 'boolean' },
    ],
  },
  news: {
    label: '最新消息',
    endpoint: 'news',
    columns: ['id', 'title', 'publishedAt', 'isPublished'],
    fields: [
      { name: 'id', label: 'ID（slug，建立後不可改）', type: 'text', required: true, createOnly: true, placeholder: '例如 news-004' },
      { name: 'title', label: '標題', type: 'text', required: true },
      { name: 'slug', label: 'slug', type: 'text' },
      { name: 'summary', label: '摘要', type: 'textarea' },
      { name: 'content', label: '內文', type: 'textarea' },
      { name: 'coverImage', label: '封面圖 URL（選填）', type: 'text' },
      { name: 'publishedAt', label: '發布日期', type: 'date' },
      { name: 'isPublished', label: '發布（顯示於前台）', type: 'boolean' },
    ],
  },
  faq: {
    label: '常見問題',
    endpoint: 'faq',
    columns: ['id', 'question', 'category', 'isPublished'],
    fields: [
      { name: 'id', label: 'ID（slug，建立後不可改）', type: 'text', required: true, createOnly: true, placeholder: '例如 faq-007' },
      { name: 'question', label: '問題', type: 'text', required: true },
      { name: 'answer', label: '回答', type: 'textarea' },
      { name: 'category', label: '分類', type: 'text' },
      { name: 'sortOrder', label: '排序', type: 'number' },
      { name: 'isPublished', label: '發布', type: 'boolean' },
    ],
  },
}
