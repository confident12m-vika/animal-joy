import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export default function NotificationsManager() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const loadHistory = () => {
    supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setHistory(data || [])
        setLoadingHistory(false)
      })
  }

  useEffect(loadHistory, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    setSuccess('')

    // 1. Save the notification so it shows up as a bell notification for every
    //    logged-in visitor next time they load the site.
    const { error: insertError } = await supabase.from('notifications').insert({ title, body })
    if (insertError) {
      setError(insertError.message)
      setSending(false)
      return
    }

    // 2. Trigger the email broadcast Edge Function (sends to every registered
    //    user's email). If the function isn't deployed yet, the in-site bell
    //    notification above still went out fine, just no email this time.
    const { error: fnError } = await supabase.functions.invoke('send-notification', {
      body: { title, body },
    })

    setSending(false)
    if (fnError) {
      setSuccess('Posted to the site\u2019s notification bell.')
      setError(
        'Email broadcast didn\u2019t go out (the send-notification function may not be deployed yet, see README).'
      )
    } else {
      setSuccess('Sent! Live on the notification bell and emailed to everyone.')
    }

    setTitle('')
    setBody('')
    loadHistory()
  }

  const remove = async (n) => {
    if (!confirm('Delete this notification? It will disappear from everyone\u2019s bell.')) return
    await supabase.from('notifications').delete().eq('id', n.id)
    loadHistory()
  }

  return (
    <div className="admin-form-page">
      <h1>Notifications {'\uD83D\uDCE3'}</h1>
      <p className="section-note">
        Sends to two places at once: the bell icon every logged-in visitor sees on the site, and
        an email to everyone with an account.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          Title
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Message
          <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>

        {error && <p className="admin-error">{error}</p>}
        {success && <p className="saved-note">{success}</p>}

        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? 'Sending\u2026' : 'Send to everyone'}
        </button>
      </form>

      <div className="history">
        <p className="field-label">Sent before</p>
        {loadingHistory ? (
          <p className="loading-note">{'\u2026'}</p>
        ) : history.length === 0 ? (
          <p className="empty-note">No notifications sent yet.</p>
        ) : (
          <div className="admin-table">
            {history.map((n) => (
              <div className="admin-row" key={n.id}>
                <div className="row-body">
                  <h3>{n.title}</h3>
                  <p className="row-sub">{n.body}</p>
                </div>
                <span className="joined-date">{new Date(n.created_at).toLocaleDateString()}</span>
                <button className="btn btn-ghost danger" onClick={() => remove(n)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .admin-form-page { max-width: 640px; }
        .admin-form-page h1 { font-size: 24px; margin-bottom: 6px; }
        .section-note { color: var(--ink-soft); font-size: 13.5px; margin: 0 0 22px; }
        .admin-form { display: flex; flex-direction: column; gap: 18px; }
        .admin-form label {
          display: flex; flex-direction: column; gap: 6px;
          font-size: 13.5px; font-weight: 500; color: var(--ink);
        }
        .admin-form input, .admin-form textarea {
          font-family: var(--font-body); padding: 10px 12px; border-radius: 10px;
          border: 1px solid var(--line); background: var(--paper); font-size: 14px;
        }
        .admin-form input:focus, .admin-form textarea:focus { outline: 2px solid var(--sage); outline-offset: 1px; }
        .admin-error { color: #B4432D; font-size: 13.5px; }
        .saved-note { color: var(--sage-dark); font-size: 13.5px; }
        .history { margin-top: 40px; }
        .field-label { font-size: 13.5px; font-weight: 500; margin-bottom: 12px; }
        .empty-note { color: var(--ink-soft); padding: 20px 0; }
        .admin-table { display: flex; flex-direction: column; gap: 10px; }
        .admin-row {
          display: flex; align-items: center; gap: 16px;
          background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 12px 16px;
        }
        .row-body { flex: 1; min-width: 0; }
        .row-body h3 { font-size: 15px; margin: 0; }
        .row-sub { font-size: 13px; color: var(--ink-soft); margin: 2px 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .joined-date { font-size: 12.5px; color: var(--ink-soft); flex-shrink: 0; }
        .row-actions .btn.danger, .admin-row > .btn.danger { color: #B4432D; padding: 8px 14px; font-size: 13px; }
      `}</style>
    </div>
  )
}
