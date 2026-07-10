import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import StateMessage from '../components/StateMessage.jsx'
import styles from './MainLayout.module.css'

/**
 * 全站主要 layout：固定的 Navbar + 內容區（Outlet）+ Footer。
 * 換頁時自動捲回頂端。內容以 Suspense 包住，配合 lazy 路由顯示載入中。
 */
export default function MainLayout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // 有 anchor（如 /services#materials）時交給目標頁自行捲動，不強制回頂。
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>
        <Suspense fallback={<div className="container section"><StateMessage variant="loading" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
