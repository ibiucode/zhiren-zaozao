import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { RESOURCE_ORDER, resources } from '../config/resources.js'

export default function Layout() {
  const { user, logout } = useAuth()

  const navClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">3D</span>
          <span>職人自造 後台</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end className={navClass}>
            儀表板
          </NavLink>
          <div className="nav-section">詢價管理</div>
          <NavLink to="/inquiries" className={navClass}>
            詢價單
          </NavLink>
          <div className="nav-section">內容管理</div>
          {RESOURCE_ORDER.map((key) => (
            <NavLink key={key} to={`/resources/${key}`} className={navClass}>
              {resources[key].label}
            </NavLink>
          ))}
          <div className="nav-section">設定</div>
          <NavLink to="/settings" className={navClass}>
            網站設定
          </NavLink>
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <span className="muted">後台管理系統</span>
          <div className="topbar-right">
            <span className="user">{user?.username || 'admin'}</span>
            <button className="btn btn-sm" onClick={logout}>
              登出
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
