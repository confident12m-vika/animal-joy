import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'

export const adminAuthStyles = `
  .admin-auth-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cream);
    padding: 24px;
  }
  .admin-card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 36px 32px;
    width: 100%;
    max-width: 380px;
  }
  .admin-card h1 { font-size: 22px; margin-bottom: 6px; }
  .subtitle { color: var(--ink-soft); font-size: 14px; margin-bottom: 20px; }
  .admin-card label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13.5px;
    font-weight: 500;
    margin-bottom: 14px;
    color: var(--ink);
  }
  .admin-card input, .admin-card textarea, .admin-card select {
    font-family: var(--font-body);
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: var(--cream);
    font-size: 14px;
  }
  .admin-card input:focus, .admin-card textarea:focus, .admin-card select:focus {
    outline: 2px solid var(--sage);
    outline-offset: 1px;
  }
  .admin-error {
    color: #B4432D;
    font-size: 13.5px;
    margin-bottom: 12px;
  }
  .admin-card .btn { width: 100%; justify-content: center; margin-top: 6px; }
`

export default function Login() {
  const { signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-auth-screen">
        <div className="admin-card">
          <h1>Supabase not connected yet</h1>
          <p>
            The admin panel needs a Supabase project to store articles, jokes, and images.
            Follow the setup steps in <code>README.md</code>, then fill in <code>.env</code>{' '}
            with your Project URL and anon key, and restart <code>npm run dev</code>.
          </p>
        </div>
        <style>{adminAuthStyles}</style>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error: err } = await signInWithEmail(email, password)
    setSubmitting(false)
    if (err) {
      setError(err.message)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="admin-auth-screen">
      <form className="admin-card" onSubmit={handleSubmit}>
        <h1>Animal Joy Admin</h1>
        <p className="subtitle">Sign in to manage articles, jokes and photos.</p>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Signing in\u2026' : 'Sign in'}
        </button>
      </form>
      <style>{adminAuthStyles}</style>
    </div>
  )
}
