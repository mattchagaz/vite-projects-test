import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../App.css'

const NAV = [
  { to: '/app/dashboard',   icon: '⊞', label: 'Dashboard' },
  { to: '/app/projects',    icon: '⬡', label: 'Projetos' },
  { to: '/app/reviews',     icon: '✦', label: 'Code Review' },
  { to: '/app/deployments', icon: '⚡', label: 'Deployments' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const notifs = [
    { icon: '✦', color: '#7c3aed', text: 'IA encontrou 2 bugs no PR #48', time: '3 min' },
    { icon: '✓', color: '#10b981', text: 'Deploy de produção concluído', time: '12 min' },
    { icon: '⚠', color: '#f59e0b', text: 'Uso de memória alto em prod-api', time: '28 min' },
    { icon: '👥', color: '#0ea5e9', text: 'Carlos comentou em code-review', time: '1h' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={`app-shell${collapsed ? ' collapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sb-header">
          <div className="sb-logo">
            <span className="logo-gem">◈</span>
            {!collapsed && <span>Lumina</span>}
          </div>
          <button className="sb-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Recolher menu">
            {collapsed ? '»' : '«'}
          </button>
        </div>

        <nav className="sb-nav">
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
              <span className="sb-icon">{icon}</span>
              {!collapsed && <span className="sb-label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sb-bottom">
          <NavLink to="/app/settings" className="sb-link">
            <span className="sb-icon">⚙</span>
            {!collapsed && <span className="sb-label">Configurações</span>}
          </NavLink>
          <button className="sb-link sb-user" onClick={handleLogout} title="Sair">
            <span className="sb-av" style={{ background: '#7c3aed' }}>{user?.avatar || 'U'}</span>
            {!collapsed && (
              <div className="sb-user-info">
                <strong>{user?.name}</strong>
                <small>{user?.plan}</small>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <div className="topbar-search">
              <span className="search-ico">⌕</span>
              <input type="text" placeholder="Buscar projetos, reviews..." />
              <kbd>⌘K</kbd>
            </div>
          </div>
          <div className="topbar-right">
            <div className="notif-wrap">
              <button className="icon-btn notif-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notificações">
                🔔
                <span className="notif-badge">4</span>
              </button>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <strong>Notificações</strong>
                    <button onClick={() => setNotifOpen(false)}>✕</button>
                  </div>
                  {notifs.map((n, i) => (
                    <div key={i} className="notif-item">
                      <span className="notif-icon" style={{ color: n.color }}>{n.icon}</span>
                      <div><span>{n.text}</span><small>{n.time} atrás</small></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="topbar-user">
              <span className="sb-av sm" style={{ background: '#7c3aed' }}>{user?.avatar || 'U'}</span>
              <span className="topbar-name">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
