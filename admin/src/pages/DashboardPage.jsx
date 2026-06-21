import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listInquiries, listResource } from '../services/adminApi.js'
import { RESOURCE_ORDER, resources } from '../config/resources.js'

export default function DashboardPage() {
  const [counts, setCounts] = useState({})
  const [inquiries, setInquiries] = useState({ total: '…', pending: '…' })

  useEffect(() => {
    let active = true
    Promise.all(
      RESOURCE_ORDER.map((key) =>
        listResource(resources[key].endpoint)
          .then((items) => [key, items.length])
          .catch(() => [key, '—']),
      ),
    ).then((pairs) => {
      if (active) setCounts(Object.fromEntries(pairs))
    })

    Promise.all([listInquiries(), listInquiries('new')])
      .then(([all, pending]) => {
        if (active) setInquiries({ total: all.length, pending: pending.length })
      })
      .catch(() => {
        if (active) setInquiries({ total: '—', pending: '—' })
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <div className="page-head">
        <h1>儀表板</h1>
      </div>
      <p className="muted">歡迎使用職人自造後台。從下方或左側選單管理網站內容。</p>

      <div className="card-grid">
        <Link to="/inquiries" className="stat-card stat-card-accent">
          <span className="stat-label">詢價單（待處理 / 全部）</span>
          <span className="stat-value">
            {inquiries.pending} <span className="stat-sub">/ {inquiries.total}</span>
          </span>
          <span className="stat-link">前往處理 →</span>
        </Link>
        {RESOURCE_ORDER.map((key) => (
          <Link key={key} to={`/resources/${key}`} className="stat-card">
            <span className="stat-label">{resources[key].label}</span>
            <span className="stat-value">{counts[key] ?? '…'}</span>
            <span className="stat-link">前往管理 →</span>
          </Link>
        ))}
        <Link to="/settings" className="stat-card">
          <span className="stat-label">網站設定</span>
          <span className="stat-value">⚙</span>
          <span className="stat-link">編輯設定 →</span>
        </Link>
      </div>
    </div>
  )
}
