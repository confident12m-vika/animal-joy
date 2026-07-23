import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLayout() {
  const { signOut } = useAuth()

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <Link to="/admin" className="admin-brand">
            Animal Joy <span>Admin</span>
          </Link>
          <nav className="admin-nav">
            <NavLink to="/admin" end>
              Home
            </NavLink>
            <NavLink to="/admin/articles">Content</NavLink>
            <NavLink to="/admin/jokes">Jokes</NavLink>
            <NavLink to="/admin/gallery">Gallery</NavLink>
            <NavLink to="/admin/urban-soul-vibe">Urban Soul Vibe</NavLink>
            <NavLink to="/admin/lost-and-found">Lost & Found</NavLink>
            <NavLink to="/admin/messages">Messages</NavLink>
            <NavLink to="/admin/users">Users</NavLink>
            <NavLink to="/admin/notifications">Notifications</NavLink>
          </nav>
          <div className="admin-topbar-actions">
            <Link to="/" className="view-site">
              {'\u2192'} View site
            </Link>
            <button className="btn btn-ghost" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>

      <style>{`
        .admin-shell { min-height: 100vh; background: var(--cream); }
        .admin-topbar {
          background: var(--paper);
          border-bottom: 1px solid var(--line);
          position: sticky; top: 0; z-index: 20;
        }
        .admin-topbar-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .admin-brand {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          color: var(--brand-green);
        }
        .admin-brand span { color: var(--ink-soft); font-weight: 400; }
        .admin-nav { display: flex; gap: 6px; flex: 1; }
        .admin-nav a {
          padding: 8px 14px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-soft);
        }
        .admin-nav a.active, .admin-nav a:hover {
          background: var(--sage-pale);
          color: var(--sage-dark);
        }
        .admin-topbar-actions { display: flex; align-items: center; gap: 14px; }
        .view-site { font-size: 13.5px; color: var(--ink-soft); }
        .view-site:hover { color: var(--sage-dark); }
        .admin-topbar-actions .btn { padding: 9px 16px; font-size: 13.5px; }
        .admin-main { max-width: 1100px; margin: 0 auto; padding: 32px 24px 60px; }
      `}</style>
    </div>
  )
}
