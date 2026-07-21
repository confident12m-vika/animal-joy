import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'

export default function Account() {
  const { session, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isSupabaseConfigured) {
    return (
      <div className="container account-page">
        <p>{'Accounts aren\u2019t available yet on this preview.'}</p>
      </div>
    )
  }

  if (session) {
    return (
      <div className="container account-page">
        <div className="account-card">
          <h1>{'\uD83D\uDC4B You\u2019re signed in'}</h1>
          <p className="subtitle">{session.user.email}</p>
          <button className="btn btn-ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
        <style>{styles}</style>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setInfo('')

    const { error: err } =
      mode === 'signup' ? await signUpWithEmail(email, password) : await signInWithEmail(email, password)

    setSubmitting(false)
    if (err) {
      setError(err.message)
    } else if (mode === 'signup') {
      setInfo('Account created! Check your email to confirm, then sign in.')
      setMode('login')
    } else {
      navigate('/')
    }
  }

  const handleGoogle = async () => {
    setError('')
    const { error: err } = await signInWithGoogle()
    if (err) setError(err.message)
  }

  return (
    <div className="container account-page">
      <form className="account-card" onSubmit={handleSubmit}>
        <h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
        <p className="subtitle">
          {mode === 'signup'
            ? 'Join Animal Joy to get updates and news.'
            : 'Sign in to your Animal Joy account.'}
        </p>

        <button type="button" className="btn btn-ghost google-btn" onClick={handleGoogle}>
          {'\uD83D\uDD35 Continue with Google'}
        </button>

        <div className="divider-text">or</div>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>

        {error && <p className="account-error">{error}</p>}
        {info && <p className="account-info">{info}</p>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Please wait\u2026' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>

        <button
          type="button"
          className="switch-mode"
          onClick={() => {
            setMode(mode === 'signup' ? 'login' : 'signup')
            setError('')
            setInfo('')
          }}
        >
          {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </button>
      </form>
      <style>{styles}</style>
    </div>
  )
}

const styles = `
  .account-page {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 48px;
    padding-bottom: 48px;
  }
  .account-card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 40px 34px;
    width: 100%;
    max-width: 400px;
  }
  .account-card h1 { font-family: var(--font-display); font-size: 24px; margin-bottom: 6px; }
  .subtitle { color: var(--ink-soft); font-size: 14.5px; margin-bottom: 22px; }
  .account-card label {
    display: flex; flex-direction: column; gap: 6px;
    font-size: 13.5px; font-weight: 500; margin-bottom: 14px; color: var(--ink);
  }
  .account-card input {
    font-family: var(--font-body); padding: 11px 13px; border-radius: 10px;
    border: 1px solid var(--line); background: var(--cream); font-size: 15px;
  }
  .account-card input:focus { outline: 2px solid var(--sage); outline-offset: 1px; }
  .google-btn { width: 100%; justify-content: center; margin-bottom: 18px; }
  .divider-text {
    text-align: center; color: var(--ink-soft); font-size: 12.5px;
    margin-bottom: 18px; position: relative;
  }
  .account-error { color: #B4432D; font-size: 13.5px; margin-bottom: 12px; }
  .account-info { color: var(--sage-dark); font-size: 13.5px; margin-bottom: 12px; }
  .account-card .btn-primary { width: 100%; justify-content: center; }
  .switch-mode {
    display: block; width: 100%; text-align: center; background: none; border: none;
    margin-top: 16px; font-size: 13.5px; color: var(--ink-soft); text-decoration: underline;
  }
  .switch-mode:hover { color: var(--sage-dark); }
`
