import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge.jsx'
import { downloadInquiryFile, getInquiry, updateInquiry } from '../services/adminApi.js'
import { INQUIRY_STATUSES } from '../config/inquiries.js'
import { formatDateTime } from '../lib/formUtils.js'

const Row = ({ label, children }) => (
  <div className="detail-row">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{children || '—'}</span>
  </div>
)

const FILE_STATUS = {
  ok: { text: '通過', color: '#36c98d' },
  warning: { text: '提醒', color: '#ff6a1a' },
  error: { text: '錯誤', color: '#ff5d5d' },
  unsupported: { text: '需確認', color: '#2f9bff' },
  pending: { text: '待檢查', color: '#6b727c' },
}

function formatSize(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function InquiryDetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const [statusValue, setStatusValue] = useState('new')
  const [note, setNote] = useState('')
  const [quote, setQuote] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getInquiry(id)
      .then((data) => {
        setItem(data)
        setStatusValue(data.status)
        setNote(data.adminNote || '')
        setQuote(data.quotedAmount ?? '')
        setStatus('ready')
      })
      .catch((e) => {
        setError(e.message)
        setStatus('error')
      })
  }, [id])

  const save = async () => {
    setSaving(true)
    setMsg('')
    setError('')
    try {
      const updated = await updateInquiry(id, {
        status: statusValue,
        adminNote: note,
        quotedAmount: quote === '' ? null : Number(quote),
      })
      setItem(updated)
      setMsg('已儲存')
      setTimeout(() => setMsg(''), 2500)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const onDownload = async (f) => {
    try {
      await downloadInquiryFile(id, f.id, f.filename)
    } catch (e) {
      setError(e.message)
    }
  }

  if (status === 'loading') return <div className="muted">載入中…</div>
  if (status === 'error') return <div className="alert alert-error">{error}</div>

  const files = item.files || []

  return (
    <div>
      <div className="page-head">
        <h1>詢價單 #{item.id}</h1>
        <StatusBadge status={item.status} />
      </div>
      <Link to="/inquiries" className="back-link">← 返回列表</Link>

      <div className="detail-cols">
        <section className="panel">
          <h2>客戶聯絡資訊</h2>
          <Row label="姓名">{item.name}</Row>
          <Row label="Email">{item.email}</Row>
          <Row label="電話">{item.phone}</Row>
          <h2 style={{ marginTop: 20 }}>專案資訊</h2>
          <Row label="服務類型">{item.serviceType}</Row>
          <Row label="材料偏好">{item.materialPreference}</Row>
          <Row label="期望交期">{item.deadline}</Row>
          <Row label="專案描述">
            <span style={{ whiteSpace: 'pre-wrap' }}>{item.description}</span>
          </Row>
          <Row label="送出時間">{formatDateTime(item.createdAt)}</Row>
          <Row label="最後更新">{formatDateTime(item.updatedAt)}</Row>
        </section>

        <section className="panel">
          <h2>處理 / 估價</h2>
          <div className="field">
            <label className="field-label">狀態</label>
            <select className="input" value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
              {INQUIRY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">估價金額（TWD，人工填寫）</label>
            <input
              className="input"
              type="number"
              min="0"
              value={quote}
              placeholder="例如 1500"
              onChange={(e) => setQuote(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">後台備註</label>
            <textarea className="input" rows={5} value={note}
              placeholder="內部備註（客戶看不到）" onChange={(e) => setNote(e.target.value)} />
          </div>
          {msg && <div className="alert alert-ok">{msg}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? '儲存中…' : '儲存變更'}
          </button>
        </section>
      </div>

      {/* 附件檔案（Phase 5） */}
      <section className="panel">
        <h2>附件檔案（{files.length}）</h2>
        {files.length === 0 && <p className="muted">客戶未上傳 3D 檔案。</p>}
        {files.map((f) => {
          const st = FILE_STATUS[f.checkStatus] || FILE_STATUS.pending
          const dims = f.checkResult?.dimensionsMm
          return (
            <div key={f.id} className="file-row">
              <div className="file-main">
                <span className="file-name">{f.filename}</span>
                <span className="badge" style={{ color: st.color, borderColor: st.color }}>{st.text}</span>
              </div>
              <div className="file-meta">
                <span>{(f.fileFormat || '').toUpperCase()}</span>
                <span>{formatSize(f.fileSize)}</span>
                {dims && <span>尺寸 {dims.x}×{dims.y}×{dims.z} mm</span>}
                {f.checkResult?.triangleCount != null && <span>{f.checkResult.triangleCount.toLocaleString()} 面</span>}
                {f.checkResult?.watertight != null && (
                  <span>{f.checkResult.watertight ? '封閉' : '可能破面'}</span>
                )}
              </div>
              {f.checkResult?.warnings?.length > 0 && (
                <ul className="file-warnings">
                  {f.checkResult.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
              <button className="btn btn-sm" onClick={() => onDownload(f)}>下載</button>
            </div>
          )
        })}
      </section>
    </div>
  )
}
