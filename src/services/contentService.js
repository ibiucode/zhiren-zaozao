/**
 * 內容讀取服務。對應 SKILL.md Public API 的 GET 端點。
 * 每個函式都回傳 Promise，介面與未來真實 API 一致。
 *
 * Phase 1：USE_MOCK 時回傳 src/data 的 placeholder。
 * Phase 2：將下方對應的 apiRequest 取消註解、移除 mock 分支即可。
 */
import { USE_MOCK, mockResponse, apiRequest } from './apiClient.js'
import { siteSettings, contactSettings } from '../data/siteSettings.js'
import { services } from '../data/services.js'
import { portfolioItems, portfolioCategories } from '../data/portfolio.js'
import { materials } from '../data/materials.js'
import { newsPosts } from '../data/news.js'
import { faqItems } from '../data/faq.js'

// GET /api/site-settings
export function getSiteSettings() {
  if (USE_MOCK) return mockResponse({ ...siteSettings, contact: contactSettings })
  return apiRequest('/api/site-settings')
}

// GET /api/services
export function getServices() {
  if (USE_MOCK) return mockResponse(services.filter((s) => s.isActive))
  return apiRequest('/api/services')
}

// GET /api/portfolio
export function getPortfolio() {
  if (USE_MOCK) return mockResponse({ items: portfolioItems, categories: portfolioCategories })
  return apiRequest('/api/portfolio')
}

// GET /api/materials
export function getMaterials() {
  if (USE_MOCK) return mockResponse(materials.filter((m) => m.isActive))
  return apiRequest('/api/materials')
}

// GET /api/news
export function getNews() {
  if (USE_MOCK) return mockResponse(newsPosts.filter((n) => n.isPublished))
  return apiRequest('/api/news')
}

// GET /api/news/{id}
export function getNewsById(id) {
  if (USE_MOCK) return mockResponse(newsPosts.find((n) => n.id === id) || null)
  return apiRequest(`/api/news/${id}`)
}

// GET /api/faq
export function getFaq() {
  if (USE_MOCK) return mockResponse(faqItems.filter((f) => f.isPublished))
  return apiRequest('/api/faq')
}
