import { Link } from 'react-router-dom'
import { siteSettings, contactSettings } from '../data/siteSettings.js'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>3D</span>
            <span>{siteSettings.siteName}</span>
          </div>
          <p className={styles.muted}>{siteSettings.tagline}</p>
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
            <li>{contactSettings.email}</li>
            <li>{contactSettings.phone}</li>
            <li>LINE：{contactSettings.lineId}</li>
            <li>{contactSettings.address}</li>
          </ul>
          <Link to="/contact" className={styles.cta}>立即詢價</Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">{siteSettings.footerText}</div>
      </div>
    </footer>
  )
}
