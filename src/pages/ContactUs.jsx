import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export default function ContactUs() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    const { error: err } = await supabase.from('contact_messages').insert({ name, email, message })

    setSending(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
      setName('')
      setEmail('')
      setMessage('')
    }
  }

  return (
    <div className="container contact-page">
      <div className="page-hero">
        <span style={{ fontSize: 40 }}>{'\uD83D\uDCEC'}</span>
        <h1>Contact Us</h1>
        <p>{'Questions, feedback, or anything else \u2014 we\u2019d love to hear from you.'}</p>
      </div>

      {sent ? (
        <div className="sent-card">
          <p>{'\u2705 Message sent! We\u2019ll get back to you soon.'}</p>
          <button className="btn btn-ghost" onClick={() => setSent(false)}>
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Message
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>
          {error && <p className="admin-error">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? 'Sending\u2026' : 'Send message'}
          </button>
        </form>
      )}

      <style>{`
        .contact-page { max-width: 560px; padding-bottom: 60px; }
        .page-hero { text-align: center; padding: 40px 0 20px; }
        .page-hero p { color: var(--ink-soft); }
        .contact-form { display: flex; flex-direction: column; gap: 18px; }
        .contact-form label {
          display: flex; flex-direction: column; gap: 6px;
          font-size: 13.5px; font-weight: 500; color: var(--ink);
        }
        .contact-form input, .contact-form textarea {
          font-family: var(--font-body); padding: 11px 13px; border-radius: 10px;
          border: 1px solid var(--line); background: var(--paper); font-size: 15px;
        }
        .contact-form input:focus, .contact-form textarea:focus {
          outline: 2px solid var(--sage); outline-offset: 1px;
        }
        .admin-error { color: #B4432D; font-size: 13.5px; }
        .sent-card {
          text-align: center; padding: 40px 24px; background: var(--sage-pale);
          border-radius: var(--radius);
        }
        .sent-card p { font-size: 16px; margin-bottom: 16px; }
      `}</style>
    </div>
  )
}
