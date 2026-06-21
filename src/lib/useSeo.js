import { useEffect } from 'react'

const SITE_NAME = '職人自造 ZhiRen ZaoZao'
const DEFAULT_DESCRIPTION =
  '職人自造 — 專業 3D 列印工作室。提供 3D 列印、模型修復、後處理與客製化製作服務。'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * 設定每頁的 SEO：document.title + description + Open Graph。
 * 因前台為 SPA，於各頁 mount 時動態更新（react-helmet 的輕量替代，無額外依賴）。
 * @param {{ title?: string, description?: string }} opts
 */
export function useSeo({ title, description } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title}｜${SITE_NAME}` : `${SITE_NAME}｜專業 3D 列印工作室`
    const desc = description || DEFAULT_DESCRIPTION
    document.title = fullTitle
    upsertMeta('name', 'description', desc)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', desc)
  }, [title, description])
}
