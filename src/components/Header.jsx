import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo.jsx'
import NotificationBell from './NotificationBell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { SUPPORTED_LANGUAGES } from '../i18n/index.js'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/happy-stories', label: `\u2764\uFE0F ${t('nav.happyStories')}` },
    { to: '/laugh-and-smile', label: `\uD83D\uDE02 ${t('nav.laughSmile')}` },
    { to: '/moment-joke', label: `\uD83C\uDFAD ${t('nav.momentJoke')}` },
    { to: '/amazing-animals', label: `\uD83E\uDDE0 ${t('nav.amazingAnimals')}` },
    { to: '/pet-life', label: `\uD83D\uDC36 ${t('nav.petLife')}` },
    { to: '/gallery', label: `\uD83D\uDCF7 ${t('nav.gallery')}` },
    { to: '/best-finds', label: `\uD83D\uDECD\uFE0F ${t('nav.bestFinds')}` },
    { to: '/urban-soul-vibe', label: `\uD83C\uDF3F ${t('nav.urbanSoulVibe')}` },
    { to: '/lost-and-found', label: `\uD83D\uDC3E ${t('nav.lostFound')}` },
  ]

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0]

  const changeLang = (code) => {
    i18n.changeLanguage(code)
    setLangOpen(false)
    setOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container top-row">
        <NavLink to="/" onClick={() => setOpen(false)} className="brand-link">
          <Logo size="large" />
        </NavLink>

        <div className="top-controls">
          <div className="lang-switch">
            <button
              className="lang-trigger"
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              onClick={() => setLangOpen((o) => !o)}
            >
              {'\uD83C\uDF10'} <span className="lang-full">{currentLang.label}</span>
            </button>
            {langOpen && (
              <ul className="lang-menu" role="listbox">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <li key={l.code}>
                    <button
                      role="option"
                      aria-selected={l.code === currentLang.code}
                      className={l.code === currentLang.code ? 'active' : ''}
                      onClick={() => changeLang(l.code)}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <NotificationBell />

          {session ? (
            <NavLink to="/account" className="account-link" onClick={() => setOpen(false)}>
              {'\uD83D\uDC64'}
            </NavLink>
          ) : (
            <NavLink to="/account" className="account-link account-link-text" onClick={() => setOpen(false)}>
              Sign in
            </NavLink>
          )}

          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="container">
        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(251, 243, 236, 0.94);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--line);
          padding: 18px 0 0;
        }
        .top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 14px;
        }
        .brand-link { flex-shrink: 0; }
        .top-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .site-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 6px;
          justify-content: center;
          padding: 10px 0 14px;
          border-top: 1px solid var(--line);
        }
        .site-nav a {
          padding: 8px 13px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-soft);
          white-space: nowrap;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .site-nav a:hover,
        .site-nav a.active {
          background: var(--sage-pale);
          color: var(--sage-dark);
        }
        .account-link {
          border: 1px solid var(--line);
          background: var(--paper);
          border-radius: 100px;
          padding: 9px 12px;
          font-size: 15px;
          color: var(--ink);
        }
        .account-link:hover { border-color: var(--sage); color: var(--sage-dark); }
        .account-link-text { font-size: 13.5px; font-weight: 500; padding: 9px 16px; }
        .lang-switch { position: relative; }
        .lang-trigger {
          border: 1px solid var(--line);
          background: var(--paper);
          border-radius: 100px;
          padding: 9px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
        }
        .lang-trigger:hover { border-color: var(--sage); }
        .lang-menu {
          position: absolute;
          inset-inline-end: 0;
          top: calc(100% + 8px);
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 6px;
          list-style: none;
          margin: 0;
          box-shadow: 0 16px 30px -14px rgba(56, 51, 44, 0.3);
          min-width: 140px;
          z-index: 50;
        }
        .lang-menu button {
          width: 100%;
          text-align: start;
          padding: 9px 12px;
          border: none;
          background: none;
          border-radius: 8px;
          font-size: 14px;
          color: var(--ink);
        }
        .lang-menu button:hover { background: var(--sage-pale); }
        .lang-menu button.active { color: var(--sage-dark); font-weight: 600; }
        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          padding: 8px;
        }
        .nav-toggle span {
          width: 24px;
          height: 2px;
          background: var(--ink);
          border-radius: 2px;
        }
        @media (max-width: 980px) {
          .nav-toggle { display: flex; }
          .site-nav {
            display: none;
            flex-direction: column;
            align-items: flex-start;
          }
          .site-nav.is-open { display: flex; }
        }
        @media (max-width: 420px) {
          .top-row { gap: 8px; }
          .lang-trigger { padding: 8px 10px; font-size: 12.5px; }
          .lang-trigger .lang-full { display: none; }
          .brand-link .logo-large img { width: 40px !important; height: 40px !important; }
          .brand-link .logo-name { font-size: 20px !important; }
        }
      `}</style>
    </header>
  )
}
