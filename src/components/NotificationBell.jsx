import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function NotificationBell() {
  const { session, profile, markNotificationsSeen } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!session) return
    supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setNotifications(data || [])
        setLoaded(true)
      })
  }, [session])

  if (!session) return null

  const lastSeen = profile?.last_seen_notification_at ? new Date(profile.last_seen_notification_at) : null
  const unreadCount = lastSeen
    ? notifications.filter((n) => new Date(n.created_at) > lastSeen).length
    : notifications.length

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next && unreadCount > 0) markNotificationsSeen()
  }

  return (
    <div className="notif-bell">
      <button className="bell-trigger" onClick={toggle} aria-label="Notifications">
        {'\uD83D\uDD14'}
        {unreadCount > 0 && <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="bell-panel">
          <p className="bell-title">Notifications</p>
          {!loaded ? (
            <p className="bell-empty">{'\u2026'}</p>
          ) : notifications.length === 0 ? (
            <p className="bell-empty">Nothing yet.</p>
          ) : (
            <ul className="bell-list">
              {notifications.map((n) => (
                <li key={n.id}>
                  <p className="bell-item-title">{n.title}</p>
                  <p className="bell-item-body">{n.body}</p>
                  <p className="bell-item-date">{new Date(n.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <style>{`
        .notif-bell { position: relative; }
        .bell-trigger {
          position: relative;
          border: 1px solid var(--line);
          background: var(--paper);
          border-radius: 100px;
          padding: 9px 12px;
          font-size: 15px;
        }
        .bell-trigger:hover { border-color: var(--sage); }
        .bell-badge {
          position: absolute;
          top: -4px;
          inset-inline-end: -4px;
          background: #B4432D;
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
        }
        .bell-panel {
          position: absolute;
          inset-inline-end: 0;
          top: calc(100% + 8px);
          width: 300px;
          max-height: 360px;
          overflow-y: auto;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 16px 30px -14px rgba(56, 51, 44, 0.3);
          z-index: 60;
        }
        .bell-title { font-weight: 600; font-size: 14px; margin-bottom: 10px; }
        .bell-empty { color: var(--ink-soft); font-size: 13.5px; }
        .bell-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
        .bell-list li { border-bottom: 1px solid var(--line); padding-bottom: 10px; }
        .bell-list li:last-child { border-bottom: none; padding-bottom: 0; }
        .bell-item-title { font-size: 13.5px; font-weight: 600; margin: 0 0 3px; }
        .bell-item-body { font-size: 13px; color: var(--ink-soft); margin: 0 0 4px; }
        .bell-item-date { font-size: 11.5px; color: var(--ink-soft); margin: 0; }
      `}</style>
    </div>
  )
}
