import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export default function MessagesDashboard() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const markRead = async (m) => {
    await supabase.from('contact_messages').update({ is_read: !m.is_read }).eq('id', m.id)
    load()
  }

  const remove = async (m) => {
    if (!confirm('Delete this message?')) return
    await supabase.from('contact_messages').delete().eq('id', m.id)
    load()
  }

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div>
      <div className="dash-head">
        <h1>
          Messages {'\uD83D\uDCEC'} {unreadCount > 0 && <span className="unread-badge">{unreadCount} new</span>}
        </h1>
      </div>
      <p className="section-note">
        Messages from the Contact Us form, plus any real emails sent to your domain inbox (once
        set up), all in one place.
      </p>

      {loading ? (
        <p className="loading-note">{'\u2026'}</p>
      ) : messages.length === 0 ? (
        <p className="empty-note">No messages yet.</p>
      ) : (
        <div className="admin-table">
          {messages.map((m) => (
            <div className={`admin-row ${!m.is_read ? 'is-unread' : ''}`} key={m.id}>
              <div className="row-body">
                <div className="row-top">
                  <h3>{m.name || m.email}</h3>
                  <span className="source-tag">
                    {m.source === 'inbound_email' ? '\uD83D\uDCE7 Email' : '\uD83D\uDCDD Form'}
                  </span>
                </div>
                <p className="row-email">{m.email}</p>
                <p className="row-message">{m.message}</p>
                <p className="row-date">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="row-actions">
                <button className="btn btn-ghost" onClick={() => markRead(m)}>
                  {m.is_read ? 'Mark unread' : 'Mark read'}
                </button>
                <button className="btn btn-ghost danger" onClick={() => remove(m)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .dash-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .dash-head h1 { font-size: 26px; display: flex; align-items: center; gap: 10px; }
        .unread-badge {
          font-size: 12.5px; font-weight: 700; background: #B4432D; color: white;
          padding: 3px 10px; border-radius: 100px;
        }
        .section-note { color: var(--ink-soft); font-size: 13.5px; margin: 0 0 22px; max-width: 560px; }
        .empty-note { color: var(--ink-soft); padding: 40px 0; text-align: center; }
        .admin-table { display: flex; flex-direction: column; gap: 10px; }
        .admin-row {
          display: flex; align-items: flex-start; gap: 16px; justify-content: space-between;
          background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px;
        }
        .admin-row.is-unread { border-color: var(--sage); background: var(--sage-pale); }
        .row-body { flex: 1; min-width: 0; }
        .row-top { display: flex; align-items: center; gap: 10px; }
        .row-top h3 { font-size: 15px; margin: 0; }
        .source-tag { font-size: 11.5px; color: var(--ink-soft); }
        .row-email { font-size: 13px; color: var(--sage-dark); margin: 3px 0; }
        .row-message { font-size: 14px; color: var(--ink); margin: 6px 0; white-space: pre-line; }
        .row-date { font-size: 12px; color: var(--ink-soft); margin: 0; }
        .row-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
        .row-actions .btn { padding: 8px 14px; font-size: 13px; white-space: nowrap; }
        .row-actions .btn.danger { color: #B4432D; }
      `}</style>
    </div>
  )
}
