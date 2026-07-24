import { useTranslation } from 'react-i18next'
import Logo from './Logo.jsx'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Logo />
          <p className="tagline">{t('footer.tagline')}</p>
        </div>

        <div className="footer-col">
          <p className="eyebrow">{t('footer.explore')}</p>
          <a href="/happy-stories">{t('nav.happyStories')}</a>
          <a href="/amazing-animals">{t('nav.amazingAnimals')}</a>
          <a href="/gallery">{t('nav.gallery')}</a>
        </div>

        <div className="footer-col">
          <p className="eyebrow">{t('footer.project')}</p>
          <a href="/urban-soul-vibe">{t('nav.urbanSoulVibe')}</a>
          <a href="/best-finds">{t('nav.bestFinds')}</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>

      <div className="container">
        <p className="fine-print">
          {'\u00A9'} {new Date().getFullYear()} {t('footer.rights')}
        </p>
      </div>

      <style>{`
        .site-footer {
          margin-top: 60px;
          padding-top: 48px;
          border-top: 1px solid var(--line);
          background: var(--cream-deep);
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 32px;
          padding-bottom: 32px;
        }
        .tagline {
          margin-top: 12px;
          max-width: 320px;
          color: var(--ink-soft);
          font-size: 15px;
        }
        .footer-col { display: flex; flex-direction: column; gap: 10px; }
        .footer-col a { color: var(--ink-soft); font-size: 14.5px; }
        .footer-col a:hover { color: var(--sage-dark); }
        .fine-print {
          border-top: 1px solid var(--line);
          padding: 18px 0 28px;
          font-size: 13px;
          color: var(--ink-soft);
        }
        @media (max-width: 640px) {
          .footer-inner { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  )
}
