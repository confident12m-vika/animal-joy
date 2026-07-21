import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export default function UsersDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setUsers(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="dash-head">
        <h1>Users {'\uD83D\uDC65'}</h1>
      </div>
      <p className="section-note">
        Everyone who created an account on the site (email or Google sign-in). Use Notifications
        to message all of them at once.
      </p>

      {loading ? (
        <p className="loading-note">{'\u2026'}</p>
      ) : users.length === 0 ? (
        <p className="empty-note">No registered users yet.</p>
      ) : (
        <div className="admin-table">
          {users.map((u) => (
            <div className="admin-row" key={u.id}>
              <div className="row-avatar">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="" />
                ) : (
                  <span>{(u.display_name || u.email || '?').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="row-body">
                <h3>{u.display_name || u.email || 'Unnamed user'}</h3>
                <p className="row-sub">{u.email}</p>
              </div>
              {u.is_admin && <span className="status-pill is-live">Admin</span>}
              <span className="joined-date">
                Joined {new Date(u.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .dash-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .dash-head h1 { font-size: 26px; }
        .section-note { color: var(--ink-soft); font-size: 13.5px; margin: 0 0 22px; }
        .empty-note { color: var(--ink-soft); padding: 40px 0; text-align: center; }
        .admin-table { display: flex; flex-direction: column; gap: 10px; }
        .admin-row {
          display: flex; align-items: center; gap: 16px;
          background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 12px 16px;
        }
        .row-avatar {
          width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
          background: var(--sage-pale); display: flex; align-items: center; justify-content: center;
          font-weight: 700; color: var(--sage-dark);
        }
        .row-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .row-body { flex: 1; min-width: 0; }
        .row-body h3 { font-size: 15px; margin: 0; }
        .row-sub { font-size: 13px; color: var(--ink-soft); margin: 2px 0 0; }
        .status-pill { font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 100px; }
        .status-pill.is-live { background: var(--sage-pale); color: var(--sage-dark); }
        .joined-date { font-size: 12.5px; color: var(--ink-soft); flex-shrink: 0; }
      `}</style>
    </div>
  )
}
