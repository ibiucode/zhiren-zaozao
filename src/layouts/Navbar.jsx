import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAsyncData } from '../lib/useAsyncData.js'
import { getSiteSettings } from '../services/contentService.js'
import { siteSettings as fallbackSite } from '../data/siteSettings.js'
import styles from './Navbar.module.css'

// 導覽列項目（路由設定，與 App.jsx 的 route 對應）。
const navItems = [
  { to: '/', label: '首頁', end: true },
  { to: '/large-production', label: '大型製作' },
  { to: '/gallery', label: '作品' },
  { to: '/news', label: '最新消息' },
  { to: '/faq', label: 'FAQ' },
  { to: '/about', label: '關於我們' },
]

// 「服務」下拉選單內容。
const serviceMenu = [
  { to: '/services', label: '服務總覽', end: true },
  { to: '/services/fdm', label: 'FDM 服務' },
  { to: '/services/sla', label: 'SLA 服務' },
  { to: '/services#materials', label: '材料介紹' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef(null)
  const location = useLocation()

  const close = () => {
    setOpen(false)
    setDropOpen(false)
  }

  // 換頁時關閉選單與下拉。
  useEffect(() => {
    close()
  }, [location.pathname, location.hash])

  // 點擊下拉外側時關閉。
  useEffect(() => {
    if (!dropOpen) return
    const onDocClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [dropOpen])

  // 品牌名稱由後台設定（API）取得；載入前用 src/data 當 fallback。
  const { data } = useAsyncData(getSiteSettings, [])
  const siteName = data?.siteName || fallbackSite.siteName

  const servicesActive = location.pathname.startsWith('/services')

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
            {/* 首頁、大型製作 */}
            {navItems.slice(0, 2).map((item) => (
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

            {/* 服務（下拉） */}
            <li className={styles.dropWrap} ref={dropRef}>
              <button
                type="button"
                className={`${styles.navLink} ${styles.dropBtn} ${servicesActive ? styles.navLinkActive : ''}`}
                aria-haspopup="true"
                aria-expanded={dropOpen}
                onClick={() => setDropOpen((v) => !v)}
              >
                服務
                <span className={`${styles.caret} ${dropOpen ? styles.caretOpen : ''}`} aria-hidden="true">▾</span>
              </button>
              <ul className={`${styles.dropMenu} ${dropOpen ? styles.dropMenuOpen : ''}`}>
                {serviceMenu.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={close}
                      className={({ isActive }) =>
                        `${styles.dropLink} ${isActive && !item.to.includes('#') ? styles.dropLinkActive : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>

            {/* 其餘項目 */}
            {navItems.slice(2).map((item) => (
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
