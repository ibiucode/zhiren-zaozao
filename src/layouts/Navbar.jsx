import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAsyncData } from '../lib/useAsyncData.js'
import { getSiteSettings } from '../services/contentService.js'
import { siteSettings as fallbackSite } from '../data/siteSettings.js'
import styles from './Navbar.module.css'

// 導覽列項目（路由設定，與 App.jsx 的 route 對應）。
const navItems = [
  { to: '/', label: '首頁', end: true },
  { to: '/large-production', label: '大型製作' },
  { to: '/services', label: '服務' },
  { to: '/gallery', label: '作品' },
  { to: '/news', label: '最新消息' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: '關於我們' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // 品牌名稱由後台設定（API）取得；載入前用 src/data 當 fallback。
  const { data } = useAsyncData(getSiteSettings, [])
  const siteName = data?.siteName || fallbackSite.siteName

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} onClick={close}>
          <span className={styles.brandMark}>3D</span>
          <span className={styles.brandName}>{siteName}</span>
        </Link>

        <button
          className={styles.toggle}
          aria-label="開啟選單"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? styles.barTop : styles.bar} />
          <span className={open ? styles.barHidden : styles.bar} />
          <span className={open ? styles.barBottom : styles.bar} />
        </button>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={close}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/contact" className={styles.cta} onClick={close}>
                免費詢價
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
