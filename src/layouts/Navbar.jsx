import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { siteSettings } from '../data/siteSettings.js'
import styles from './Navbar.module.css'

// 導覽列項目（路由設定，與 App.jsx 的 route 對應）。
const navItems = [
  { to: '/', label: '首頁', end: true },
  { to: '/services', label: '服務' },
  { to: '/gallery', label: '作品' },
  { to: '/news', label: '最新消息' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: '關於我們' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand} onClick={close}>
          <span className={styles.brandMark}>3D</span>
          <span className={styles.brandName}>{siteSettings.siteName}</span>
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
