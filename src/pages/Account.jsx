import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import { authErrorKey } from '../lib/authErrors.js'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.8-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 36.1 26.9 37 24 37c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.6 40.6 16.3 45 24 45z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C39.8 37.4 43 31.4 43 24c0-1.4-.1-2.8-.4-3.5z"
      />
    </svg>
  )
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.7 19.7 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.5 19.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function Account() {
  const { t } = useTranslation()
  const { session, signInWithEmail, signUpWithEmail, verifySignupCode, resendSignupCode, signInWithGoogle, signOut } =
    useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'verify'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [code, setCode] = useState('')
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
          <h1>{`\uD83D\uDC4B ${t('account.signedInAs')}`}</h1>
          <p className="subtitle">{session.user.email}</p>
          <button className="btn btn-ghost" onClick={signOut}>
            {t('account.signOut')}
          </button>
        </div>
        <style>{styles}</style>
      </div>
    )
  }

  const validate = () => {
    if (mode === 'signup' && !name.trim()) return t('account.errorNameRequired')
    if (!email.trim()) return t('account.errorEmailRequired')
    if (!password) return t('account.errorPasswordRequired')
    if (mode === 'signup') {
      if (password.length < 6) return t('account.errorPasswordTooShort')
      if (!confirmPassword) return t('account.errorConfirmRequired')
      if (password !== confirmPassword) return t('account.errorPasswordMismatch')
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError('')
    setInfo('')

    const { error: err } =
      mode === 'signup' ? await signUpWithEmail(email, password, name) : await signInWithEmail(email, password)

    setSubmitting(false)
    if (err) {
      setError(t(authErrorKey(err)))
    } else if (mode === 'signup') {
      setMode('verify')
    } else {
      navigate('/')
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!code.trim()) {
      setError(t('account.errorCodeRequired'))
      return
    }

    setSubmitting(true)
    setError('')

    const { error: err } = await verifySignupCode(email, code)

    setSubmitting(false)
    if (err) {
      setError(t(authErrorKey(err)))
    } else {
      navigate('/')
    }
  }

  const handleResend = async () => {
    setError('')
    setInfo('')
    const { error: err } = await resendSignupCode(email)
    if (err) setError(t(authErrorKey(err)))
    else setInfo(t('account.codeResent'))
  }

  const handleGoogle = async () => {
    setError('')
    const { error: err } = await signInWithGoogle()
    if (err) setError(t(authErrorKey(err)))
  }

  if (mode === 'verify') {
    return (
      <div className="container account-page">
        <form className="account-card" onSubmit={handleVerify} noValidate>
          <h1>{t('account.checkEmail')}</h1>
          <p className="subtitle">{t('account.verifySubtitle', { email })}</p>

          <label>
            {t('account.verificationCode')}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              autoFocus
            />
          </label>

          {error && <p className="account-error">{error}</p>}
          {info && <p className="account-info">{info}</p>}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? t('account.verifying') : t('account.verifyAndContinue')}
          </button>

          <button type="button" className="switch-mode" onClick={handleResend}>
            {t('account.resendCode')}
          </button>
        </form>
        <style>{styles}</style>
      </div>
    )
  }

  return (
    <div className="container account-page">
      <form className="account-card" onSubmit={handleSubmit} noValidate>
        <h1>{mode === 'signup' ? t('account.createAccount') : t('account.welcomeBack')}</h1>
        <p className="subtitle">{mode === 'signup' ? t('account.signUpSubtitle') : t('account.signInSubtitle')}</p>

        <button type="button" className="btn btn-ghost google-btn" onClick={handleGoogle}>
          <GoogleIcon />
          {t('account.continueWithGoogle')}
        </button>

        <div className="divider-text">{t('account.or')}</div>

        {mode === 'signup' && (
          <label>
            {t('account.name')}
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
        )}

        <label>
          {t('account.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>

        <label>
          {t('account.password')}
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? t('account.hidePassword') : t('account.showPassword')}
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
        </label>

        {mode === 'signup' && (
          <label>
            {t('account.confirmPassword')}
            <div className="password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowConfirmPassword((s) => !s)}
                aria-label={showConfirmPassword ? t('account.hidePassword') : t('account.showPassword')}
              >
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
          </label>
        )}

        {error && <p className="account-error">{error}</p>}
        {info && <p className="account-info">{info}</p>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? t('account.pleaseWait') : mode === 'signup' ? t('account.createAccountBtn') : t('account.signIn')}
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
          {mode === 'signup' ? t('account.alreadyHaveAccount') : t('account.newHere')}
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
    box-shadow: 0 20px 44px -28px rgba(56, 51, 44, 0.35);
  }
  .account-card h1 { font-family: var(--font-display); font-size: 24px; margin-bottom: 6px; }
  .subtitle { color: var(--ink-soft); font-size: 14.5px; margin-bottom: 22px; line-height: 1.5; }
  .account-card label {
    display: flex; flex-direction: column; gap: 6px;
    font-size: 13.5px; font-weight: 500; margin-bottom: 14px; color: var(--ink);
  }
  .account-card input {
    font-family: var(--font-body); padding: 11px 13px; border-radius: 10px;
    border: 1px solid var(--line); background: var(--cream); font-size: 15px;
    width: 100%;
  }
  .account-card input:focus { outline: 2px solid var(--sage); outline-offset: 1px; }
  .password-field { position: relative; display: flex; align-items: center; }
  .password-field input { padding-inline-end: 42px; }
  .eye-toggle {
    position: absolute; inset-inline-end: 10px;
    background: none; border: none; padding: 4px; color: var(--ink-soft);
    display: flex; align-items: center; justify-content: center;
  }
  .eye-toggle:hover { color: var(--sage-dark); }
  .google-btn {
    width: 100%; justify-content: center; margin-bottom: 18px; gap: 10px;
    font-weight: 600;
  }
  .divider-text {
    text-align: center; color: var(--ink-soft); font-size: 12.5px;
    margin-bottom: 18px; position: relative;
    text-transform: uppercase; letter-spacing: 0.06em;
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
