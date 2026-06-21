import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge.jsx'
import { listInquiries } from '../services/adminApi.js'
import { INQUIRY_STATUSES } from '../config/inquiries.js'
import { formatDateTime } from '../lib/formUtils.js'

export default function InquiriesPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('') // '' = 全部
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      setItems(await listInquiries(filter || undefined))
      setStatus('ready')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div>
      <div className="page-head">
        <h1>詢價單</h1>
      </div>

      <div className="filters">
        <button
          className={`chip ${filter === '' ? 'chip-active' : ''}`}
          onClick={() => setFilter('')}
        >
          全部
        </button>
        {INQUIRY_STATUSES.map((s) => (
          <button
            key={s.value}
            className={`chip ${filter === s.value ? 'chip-active' : ''}`}
            onClick={() => setFilter(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {status === 'loading' && <div className="muted">載入中…</div>}

      {status === 'ready' && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>姓名</th>
                <th>Email</th>
                <th>服務</th>
                <th>狀態</th>
                <th>送出時間</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="muted center">
                    沒有符合的詢價單
                  </td>
                </tr>
              )}
              {items.map((it) => (
                <tr
                  key={it.id}
                  className="row-link"
                  onClick={() => navigate(`/inquiries/${it.id}`)}
                >
                  <td>{it.id}</td>
                  <td>{it.name}</td>
                  <td>{it.email}</td>
                  <td>{it.serviceType || '—'}</td>
                  <td><StatusBadge status={it.status} /></td>
                  <td>{formatDateTime(it.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
