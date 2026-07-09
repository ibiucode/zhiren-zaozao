import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import StateMessage from '../components/StateMessage.jsx'
import FileCheckCard from '../components/FileCheckCard.jsx'
import ModelViewer from '../components/ModelViewer.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { useSeo } from '../lib/useSeo.js'
import { loadModel } from '../lib/modelLoader.js'
import { getServices, getMaterials, getSiteSettings } from '../services/contentService.js'
import { submitInquiry } from '../services/inquiryService.js'
import { checkFile, uploadInquiryFile } from '../services/quoteService.js'
import { USE_MOCK } from '../services/apiClient.js'
import { toMaterialOptions } from '../logic/materials.js'
import { ACCEPTED_FILE_FORMATS, classifyFile, formatBytes } from '../logic/fileValidation.js'
import { deadlineOptions } from '../data/inquiryOptions.js'
import styles from './ContactPage.module.css'

const EMPTY_FORM = {
  name: '', email: '', phone: '', serviceType: '', materialPreference: '', description: '', deadline: '',
}
const ACCEPT_ATTR = ACCEPTED_FILE_FORMATS.map((f) => `.${f}`).join(',')

const TIER_LABEL = { ok: '可上傳', 'preview-only': '僅預覽', 'too-big': '過大' }

export default function ContactPage() {
  useSeo({ title: '聯絡與詢價', description: '填寫詢價表單並可附上 3D 檔案，可線上預覽模型尺寸，我們會盡快回覆並提供報價。' })
  const { data: services } = useAsyncData(getServices, [])
  const { data: materials } = useAsyncData(getMaterials, [])
  const { data: site } = useAsyncData(getSiteSettings, [])

  // 支援從作品詳情頁帶入 ?service=xxx 預填服務類型
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    serviceType: searchParams.get('service') || '',
  }))
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [uploadWarning, setUploadWarning] = useState('')

  const [files, setFiles] = useState([]) // 見 handleFilesChange
  const [selectedId, setSelectedId] = useState(null)
  const [sizeConfirmed, setSizeConfirmed] = useState(false)

  const serviceOptions = (services || []).map((s) => ({ value: s.id, label: s.name }))
  const materialOptions = toMaterialOptions(materials || [])
  const contact = site?.contact

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const updateFile = (id, patch) =>
    setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)))

  const handleFilesChange = (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = '' // 允許再次選同一個檔
    const entries = picked.map((file) => {
      const cls = classifyFile(file)
      return {
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file, cls,
        model: null, modelLoading: cls.canPreview, modelError: cls.formatOk ? null : cls.error,
        checkResult: null, checking: false,
      }
    })
    setFiles((fs) => [...fs, ...entries])
    const firstPreviewable = entries.find((x) => x.cls.canPreview) || entries[0]
    if (firstPreviewable) setSelectedId(firstPreviewable.id)

    entries.forEach((entry) => {
      if (entry.cls.canPreview) {
        loadModel(entry.file)
          .then((m) => updateFile(entry.id, { model: m, modelLoading: false }))
          .catch((err) => updateFile(entry.id, { modelError: err.message || '模型解析失敗', modelLoading: false }))
      }
      if (entry.cls.canUpload && !USE_MOCK) {
        updateFile(entry.id, { checking: true })
        checkFile(entry.file)
          .then((r) => updateFile(entry.id, { checkResult: r, checking: false }))
          .catch(() => updateFile(entry.id, { checking: false }))
      }
    })
  }

  const removeFile = (id) => {
    setFiles((fs) => {
      const next = fs.filter((f) => f.id !== id)
      if (selectedId === id) setSelectedId(next[0]?.id ?? null)
      return next
    })
  }

  const selected = files.find((f) => f.id === selectedId) || null
  const uploadable = files.filter((f) => f.cls.canUpload)
  const oversize = files.filter((f) => f.cls.formatOk && f.cls.sizeTier !== 'ok')
  const anyChecking = uploadable.some((f) => f.checking)
  const needConfirm = uploadable.length > 0
  const submitDisabled = status === 'submitting' || anyChecking || (needConfirm && !sizeConfirmed)

  const resetAll = () => {
    setForm(EMPTY_FORM)
    setFiles([])
    setSelectedId(null)
    setSizeConfirmed(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setUploadWarning('')
    try {
      const result = await submitInquiry(form)
      if (!result.ok) {
        setStatus('error')
        return
      }
      const warnings = []
      if (!USE_MOCK && uploadable.length) {
        for (const f of uploadable) {
          try {
            await uploadInquiryFile(result.id, f.file)
          } catch (err) {
            warnings.push(`${f.file.name} 上傳失敗：${err.message}`)
          }
        }
      }
      if (oversize.length) {
        warnings.push(`有 ${oversize.length} 個大檔（>100MB）未上傳，請另用 LINE / email 傳給我們。`)
      }
      setUploadWarning(warnings.join('\n'))
      setStatus('success')
      resetAll()
    } catch {
      setStatus('error')
    }
  }

  const manualContactMsg = (f) => {
    if (!f || f.cls.sizeTier === 'ok' || !f.cls.formatOk) return null
    const tooBig = f.cls.sizeTier === 'too-big'
    return (
      <div className={styles.manualMsg}>
        此檔 {formatBytes(f.file.size)}{tooBig ? '，超過預覽 / 上傳上限' : '，超過線上上傳上限 100MB（仍可預覽）'}。
        請透過{' '}
        {contact?.lineId ? <strong>LINE {contact.lineId}</strong> : null}
        {contact?.lineId && contact?.email ? ' 或 ' : ''}
        {contact?.email ? <strong>{contact.email}</strong> : null}
        {' '}由專人協助處理大檔。
      </div>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact / Quote"
        title="聯絡與詢價"
        description="填寫表單並可附上 3D 檔案（STL / OBJ / STEP），右側可即時預覽模型與尺寸。"
      />

      <section className="section">
        <div className={`container ${styles.layout}`}>
          {status === 'success' ? (
            <div className={styles.success}>
              <h3>已收到你的詢價！</h3>
              <p>
                感謝你的來信，我們會盡快與你聯繫。
                {USE_MOCK && <><br />（展示模式：表單內容僅記錄於瀏覽器 console，尚未送出至後端。）</>}
              </p>
              {uploadWarning && <StateMessage variant="error">{uploadWarning}</StateMessage>}
              <Button variant="outline" onClick={() => setStatus('idle')}>再填一筆</Button>
            </div>
          ) : (
            <>
              {/* 檔案上傳 + 3D 預覽（桌機右側 / 手機最上方） */}
              <div className={styles.previewCol}>
                <span className={styles.label}>3D 檔案（選填，可多檔）</span>
                <input className={styles.fileInput} type="file" accept={ACCEPT_ATTR} multiple onChange={handleFilesChange} />
                <span className={styles.hint}>
                  支援 {ACCEPTED_FILE_FORMATS.join(' / ').toUpperCase()}；≤100MB 可線上上傳，100–500MB 僅預覽（需人工），&gt;500MB 請洽 LINE / email。
                </span>

                {files.length > 0 && (
                  <ul className={styles.fileList}>
                    {files.map((f) => (
                      <li
                        key={f.id}
                        className={`${styles.fileItem} ${f.id === selectedId ? styles.fileItemActive : ''}`}
                        onClick={() => setSelectedId(f.id)}
                      >
                        <span className={styles.fileName}>{f.file.name}</span>
                        <span className={styles.fileMeta}>{(f.cls.ext || '').toUpperCase()} · {formatBytes(f.file.size)}</span>
                        <span className={`${styles.tier} ${styles['tier_' + f.cls.sizeTier.replace('-', '_')]} ${!f.cls.formatOk ? styles.tier_bad : ''}`}>
                          {!f.cls.formatOk ? '不支援' : f.checking ? '檢查中' : TIER_LABEL[f.cls.sizeTier]}
                        </span>
                        <button type="button" className={styles.fileRemove} onClick={(ev) => { ev.stopPropagation(); removeFile(f.id) }} aria-label="移除">✕</button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className={styles.viewerWrap}>
                  <ModelViewer
                    model={selected?.model}
                    loading={selected?.modelLoading}
                    error={selected?.modelError || (selected?.cls.sizeTier === 'too-big' ? '檔案過大，無法預覽' : '')}
                    emptyHint={files.length ? '此檔無法預覽' : '選擇檔案以預覽 3D 模型'}
                  />
                </div>

                {selected && manualContactMsg(selected)}
                {selected?.checkResult && <FileCheckCard result={selected.checkResult} />}

                {needConfirm && (
                  <label className={styles.confirm}>
                    <input type="checkbox" checked={sizeConfirmed} onChange={(e) => setSizeConfirmed(e.target.checked)} />
                    <span>我已確認上方模型尺寸與檢查結果無誤</span>
                  </label>
                )}
              </div>

              {/* 詢價表單 */}
              <form className={styles.formCol} onSubmit={handleSubmit} noValidate>
                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.label}>姓名 *</span>
                    <input className={styles.input} name="name" value={form.name} onChange={handleChange} required placeholder="您的稱呼" />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>電話</span>
                    <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} placeholder="方便聯絡的電話" />
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.label}>Email *</span>
                  <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
                </label>

                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.label}>服務類型</span>
                    <select className={styles.input} name="serviceType" value={form.serviceType} onChange={handleChange}>
                      <option value="">請選擇</option>
                      {serviceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>材料偏好</span>
                    <select className={styles.input} name="materialPreference" value={form.materialPreference} onChange={handleChange}>
                      <option value="">未指定 / 需要建議</option>
                      {materialOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.label}>期望交期</span>
                  <select className={styles.input} name="deadline" value={form.deadline} onChange={handleChange}>
                    <option value="">請選擇</option>
                    {deadlineOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>專案描述 *</span>
                  <textarea className={`${styles.input} ${styles.textarea}`} name="description" value={form.description} onChange={handleChange} required rows={5} placeholder="請描述你的需求：用途、數量、尺寸、是否已有 3D 檔案等。" />
                </label>

                {status === 'error' && <StateMessage variant="error">送出時發生問題，請稍後再試。</StateMessage>}

                <Button type="submit" size="lg" disabled={submitDisabled}>
                  {status === 'submitting' ? '送出中…' : '送出詢價'}
                </Button>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  )
}
