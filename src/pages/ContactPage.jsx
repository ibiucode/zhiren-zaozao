import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import StateMessage from '../components/StateMessage.jsx'
import FileCheckCard from '../components/FileCheckCard.jsx'
import { useAsyncData } from '../lib/useAsyncData.js'
import { getServices, getMaterials, getSiteSettings } from '../services/contentService.js'
import { submitInquiry } from '../services/inquiryService.js'
import { checkFile, uploadInquiryFile } from '../services/quoteService.js'
import { USE_MOCK } from '../services/apiClient.js'
import { toMaterialOptions } from '../logic/materials.js'
import { validateFileBasic, ACCEPTED_FILE_FORMATS } from '../logic/fileValidation.js'
import { deadlineOptions } from '../data/inquiryOptions.js'
import { useSeo } from '../lib/useSeo.js'
import styles from './ContactPage.module.css'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  serviceType: '',
  materialPreference: '',
  description: '',
  deadline: '',
}

const ACCEPT_ATTR = ACCEPTED_FILE_FORMATS.map((f) => `.${f}`).join(',')

export default function ContactPage() {
  useSeo({ title: '聯絡與詢價', description: '填寫詢價表單並可附上 3D 檔案，我們會盡快回覆並提供報價。' })
  const { data: services } = useAsyncData(getServices, [])
  const { data: materials } = useAsyncData(getMaterials, [])
  const { data: site } = useAsyncData(getSiteSettings, [])

  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  // 檔案上傳（Phase 5）
  const [file, setFile] = useState(null)
  const [fileResult, setFileResult] = useState(null)
  const [fileChecking, setFileChecking] = useState(false)
  const [fileError, setFileError] = useState('')
  const [sizeConfirmed, setSizeConfirmed] = useState(false)
  const [uploadWarning, setUploadWarning] = useState('')

  const serviceOptions = (services || []).map((s) => ({ value: s.id, label: s.name }))
  const materialOptions = toMaterialOptions(materials || [])
  const contact = site?.contact

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetFile = () => {
    setFile(null)
    setFileResult(null)
    setFileError('')
    setSizeConfirmed(false)
  }

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0]
    resetFile()
    if (!f) return
    setFile(f)
    // client 端淺層預檢
    const basic = validateFileBasic(f)
    if (!basic.valid) {
      setFileError(basic.errors.join('；'))
      return
    }
    // backend 網格分析
    setFileChecking(true)
    try {
      setFileResult(await checkFile(f))
    } catch (err) {
      setFileError(`檔案檢查失敗：${err.message}`)
    } finally {
      setFileChecking(false)
    }
  }

  const hasDimensions = !!fileResult?.checkResult?.dimensionsMm
  const fileBlocksSubmit =
    !!file && (fileChecking || !!fileError || (hasDimensions && !sizeConfirmed))

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
      // 將檔案附加到剛建立的詢價單（僅真實後端）。
      if (file && !USE_MOCK && !fileError) {
        try {
          await uploadInquiryFile(result.id, file)
        } catch (err) {
          setUploadWarning(`詢價已送出，但檔案上傳失敗：${err.message}`)
        }
      }
      setStatus('success')
      setForm(EMPTY_FORM)
      resetFile()
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact / Quote"
        title="聯絡與詢價"
        description="填寫下方表單告訴我們你的需求，可附上 3D 檔案，我們會盡快回覆並提供報價。"
      />

      <section className="section">
        <div className={`container ${styles.layout}`}>
          <div className={styles.formCol}>
            {status === 'success' ? (
              <div className={styles.success}>
                <h3>已收到你的詢價！</h3>
                <p>
                  感謝你的來信，我們會盡快與你聯繫。
                  {USE_MOCK && (
                    <>
                      <br />
                      （展示模式：表單內容僅記錄於瀏覽器 console，尚未送出至後端。）
                    </>
                  )}
                </p>
                {uploadWarning && (
                  <StateMessage variant="error">{uploadWarning}</StateMessage>
                )}
                <Button variant="outline" onClick={() => setStatus('idle')}>
                  再填一筆
                </Button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.label}>姓名 *</span>
                    <input className={styles.input} name="name" value={form.name}
                      onChange={handleChange} required placeholder="您的稱呼" />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>電話</span>
                    <input className={styles.input} name="phone" value={form.phone}
                      onChange={handleChange} placeholder="方便聯絡的電話" />
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.label}>Email *</span>
                  <input className={styles.input} type="email" name="email" value={form.email}
                    onChange={handleChange} required placeholder="you@example.com" />
                </label>

                <div className={styles.row}>
                  <label className={styles.field}>
                    <span className={styles.label}>服務類型</span>
                    <select className={styles.input} name="serviceType" value={form.serviceType}
                      onChange={handleChange}>
                      <option value="">請選擇</option>
                      {serviceOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span className={styles.label}>材料偏好</span>
                    <select className={styles.input} name="materialPreference"
                      value={form.materialPreference} onChange={handleChange}>
                      <option value="">未指定 / 需要建議</option>
                      {materialOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.label}>期望交期</span>
                  <select className={styles.input} name="deadline" value={form.deadline}
                    onChange={handleChange}>
                    <option value="">請選擇</option>
                    {deadlineOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>專案描述 *</span>
                  <textarea className={`${styles.input} ${styles.textarea}`} name="description"
                    value={form.description} onChange={handleChange} required rows={5}
                    placeholder="請描述你的需求：用途、數量、尺寸、是否已有 3D 檔案等。" />
                </label>

                {/* 3D 檔案上傳（Phase 5） */}
                {USE_MOCK ? (
                  <p className={styles.note}>※ 檔案上傳與尺寸/破面檢查需連線後端，展示模式暫不提供。</p>
                ) : (
                  <div className={styles.field}>
                    <span className={styles.label}>3D 檔案（選填）</span>
                    <input className={styles.fileInput} type="file" accept={ACCEPT_ATTR}
                      onChange={handleFileChange} />
                    <span className={styles.hint}>
                      支援 {ACCEPTED_FILE_FORMATS.join(' / ').toUpperCase()}；上傳後會自動檢查尺寸與破面。
                    </span>

                    {fileChecking && <p className={styles.hint}>檔案檢查中…</p>}
                    {fileError && <StateMessage variant="error">{fileError}</StateMessage>}
                    {fileResult && <FileCheckCard result={fileResult} />}

                    {hasDimensions && (
                      <label className={styles.confirm}>
                        <input type="checkbox" checked={sizeConfirmed}
                          onChange={(e) => setSizeConfirmed(e.target.checked)} />
                        <span>我已確認上方模型尺寸與檢查結果無誤</span>
                      </label>
                    )}
                  </div>
                )}

                {status === 'error' && (
                  <StateMessage variant="error">送出時發生問題，請稍後再試。</StateMessage>
                )}

                <Button type="submit" size="lg" disabled={status === 'submitting' || fileBlocksSubmit}>
                  {status === 'submitting' ? '送出中…' : '送出詢價'}
                </Button>
              </form>
            )}
          </div>

          <aside className={styles.infoCol}>
            <h3 className={styles.infoTitle}>聯絡資訊</h3>
            {contact ? (
              <ul className={styles.infoList}>
                <li><span>Email</span>{contact.email}</li>
                <li><span>電話</span>{contact.phone}</li>
                <li><span>LINE</span>{contact.lineId}</li>
                <li><span>地址</span>{contact.address}</li>
                <li><span>營業時間</span>{contact.businessHours}</li>
              </ul>
            ) : (
              <StateMessage variant="loading" />
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
