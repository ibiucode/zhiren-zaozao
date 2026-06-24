import { Link } from 'react-router-dom'
import { useAsyncData } from '../lib/useAsyncData.js'
import { getSiteSettings } from '../services/contentService.js'
import {
  siteSettings as fallbackSite,
  contactSettings as fallbackContact,
} from '../data/siteSettings.js'
import styles from './Footer.module.css'

export default function Footer() {
  // 由 API 取得網站 / 聯絡設定（後台可改）；載入前先用 src/data 當 fallback，避免閃爍。
  const { data } = useAsyncData(getSiteSettings, [])
  const site = data || fallbackSite
  const contact = data?.contact || fallbackContact

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>3D</span>
            <span>{site.siteName}</span>
          </div>
          <p className={styles.muted}>{site.tagline}</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.heading}>網站導覽</h4>
          <ul className={styles.links}>
            <li><Link to="/services">服務項目</Link></li>
            <li><Link to="/gallery">作品集</Link></li>
            <li><Link to="/news">最新消息</Link></li>
            <li><Link to="/faq">常見問題</Link></li>
            <li><Link to="/about">關於我們</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.heading}>聯絡我們</h4>
          <ul className={styles.contact}>
            <li>{contact.email}</li>
            <li>{contact.phone}</li>
            <li>LINE：{contact.lineId}</li>
            <li>{contact.address}</li>
          </ul>
          <Link to="/contact" className={styles.cta}>立即詢價</Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">{site.footerText}</div>
      </div>
    </footer>
  )
}
