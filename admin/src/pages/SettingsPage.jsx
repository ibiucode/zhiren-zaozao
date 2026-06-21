import { useEffect, useState } from 'react'
import { getSiteSettings, patchContactSettings, patchSiteSettings } from '../services/adminApi.js'

// social 以「id | label | url」多行編輯。
const socialToText = (arr) =>
  (arr || []).map((s) => `${s.id} | ${s.label} | ${s.url}`).join('\n')
const textToSocial = (text) =>
  String(text)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [id = '', label = '', url = ''] = l.split('|').map((x) => x.trim())
      return { id, label, url }
    })

export default function SettingsPage() {
  const [site, setSite] = useState(null)
  const [contact, setContact] = useState(null)
  const [socialText, setSocialText] = useState('')
  const [status, setStatus] = useState('loading')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        const { contact: c, social, ...siteFields } = data
        setSite(siteFields)
        setSocialText(socialToText(social))
        setContact(c || {})
        setStatus('ready')
      })
      .catch((e) => {
        setErr(e.message)
        setStatus('error')
      })
  }, [])

  const flash = (text) => {
    setMsg(text)
    setErr('')
    setTimeout(() => setMsg(''), 2500)
  }

  const saveSite = async () => {
    try {
      await patchSiteSettings({
        siteName: site.siteName,
        siteNameEn: site.siteNameEn,
        tagline: site.tagline,
        description: site.description,
        footerText: site.footerText,
        social: textToSocial(socialText),
      })
      flash('網站設定已儲存')
    } catch (e) {
      setErr(e.message)
    }
  }

  const saveContact = async () => {
    try {
      await patchContactSettings({
        email: contact.email,
        phone: contact.phone,
        lineId: contact.lineId,
        address: contact.address,
        businessHours: contact.businessHours,
      })
      flash('聯絡資訊已儲存')
    } catch (e) {
      setErr(e.message)
    }
  }

  if (status === 'loading') return <div className="muted">載入中…</div>
  if (status === 'error') return <div className="alert alert-error">{err}</div>

  const siteField = (key) => (e) => setSite({ ...site, [key]: e.target.value })
  const contactField = (key) => (e) => setContact({ ...contact, [key]: e.target.value })

  return (
    <div>
      <div className="page-head">
        <h1>網站設定</h1>
      </div>

      {msg && <div className="alert alert-ok">{msg}</div>}
      {err && <div className="alert alert-error">{err}</div>}

      <section className="panel">
        <h2>基本資訊</h2>
        <div className="field">
          <label className="field-label">網站名稱</label>
          <input className="input" value={site.siteName || ''} onChange={siteField('siteName')} />
        </div>
        <div className="field">
          <label className="field-label">英文名稱</label>
          <input className="input" value={site.siteNameEn || ''} onChange={siteField('siteNameEn')} />
        </div>
        <div className="field">
          <label className="field-label">標語 tagline</label>
          <input className="input" value={site.tagline || ''} onChange={siteField('tagline')} />
        </div>
        <div className="field">
          <label className="field-label">描述</label>
          <textarea className="input" rows={3} value={site.description || ''} onChange={siteField('description')} />
        </div>
        <div className="field">
          <label className="field-label">頁尾文字</label>
          <input className="input" value={site.footerText || ''} onChange={siteField('footerText')} />
        </div>
        <div className="field">
          <label className="field-label">社群連結（每行：id | label | url）</label>
          <textarea className="input" rows={3} value={socialText} onChange={(e) => setSocialText(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={saveSite}>
          儲存基本資訊
        </button>
      </section>

      <section className="panel">
        <h2>聯絡資訊</h2>
        <div className="field">
          <label className="field-label">Email</label>
          <input className="input" value={contact.email || ''} onChange={contactField('email')} />
        </div>
        <div className="field">
          <label className="field-label">電話</label>
          <input className="input" value={contact.phone || ''} onChange={contactField('phone')} />
        </div>
        <div className="field">
          <label className="field-label">LINE ID</label>
          <input className="input" value={contact.lineId || ''} onChange={contactField('lineId')} />
        </div>
        <div className="field">
          <label className="field-label">地址</label>
          <input className="input" value={contact.address || ''} onChange={contactField('address')} />
        </div>
        <div className="field">
          <label className="field-label">營業時間</label>
          <input className="input" value={contact.businessHours || ''} onChange={contactField('businessHours')} />
        </div>
        <button className="btn btn-primary" onClick={saveContact}>
          儲存聯絡資訊
        </button>
      </section>
    </div>
  )
}
