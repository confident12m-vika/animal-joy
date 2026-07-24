import { useTranslation } from 'react-i18next'
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js'

const content = {
  title: 'Privacy Policy',
  body: `Last updated: 2026

Animal Joy ("we", "our", "the site") respects your privacy. This page explains what information we collect and how we use it.

What we collect
- Account information: your name, email address, and (if you sign in with Google) your profile photo.
- Content you post: articles you interact with, reactions, Lost & Found reports, and messages you send us.
- WhatsApp numbers submitted with Lost & Found reports are kept private and are only visible to you and site administrators, never shown publicly.

How we use it
- To operate your account and let you sign in.
- To show you notifications relevant to your posts and activity.
- To send you emails you've asked for, such as updates about your Lost & Found report or occasional site news.
- We do not sell your personal information to third parties.

Your choices
- You can delete your own Lost & Found reports and reactions at any time from your account.
- You can contact us at any time using the Contact Us page if you'd like your account or data removed.

Cookies and analytics
This site uses only the technical cookies necessary to keep you signed in. We do not run third-party advertising trackers.

Contact
If you have any questions about this policy, please reach out through our Contact Us page.`,
}

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation()
  const onDemand = useOnDemandTranslate({ title: content.title, body: content.body })
  const shown = i18n.language === 'en' ? content : onDemand.shown
  const paragraphs = shown.body.split(/\n\s*\n/).filter(Boolean)

  return (
    <div className="container legal-page">
      <div className="page-hero">
        <h1>{shown.title}</h1>
      </div>

      {i18n.language !== 'en' && (
        <div className="translate-row">
          <button className="translate-btn" onClick={onDemand.toggle} disabled={onDemand.translating}>
            {onDemand.translating
              ? t('common.translating')
              : onDemand.translated
              ? t('common.showOriginal')
              : t('common.translate')}
          </button>
          {onDemand.error && <span className="translate-error">{t('common.translateError')}</span>}
        </div>
      )}

      <div className="legal-body">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <style>{`
        .legal-page { max-width: 720px; padding-top: 20px; padding-bottom: 60px; }
        .legal-page .page-hero { padding: 20px 0; text-align: start; }
        .legal-page .page-hero h1 { font-size: clamp(1.7rem, 4vw, 2.3rem); }
        .translate-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .translate-btn {
          font-size: 13px; font-weight: 600; color: var(--sage-dark);
          background: var(--sage-pale); border: none; padding: 7px 14px; border-radius: 100px;
        }
        .translate-btn:hover { background: var(--blush); }
        .translate-btn:disabled { opacity: 0.6; }
        .translate-error { font-size: 12.5px; color: #B4432D; }
        .legal-body p {
          font-size: 16px; line-height: 1.75; color: var(--ink);
          white-space: pre-line; margin-bottom: 18px;
        }
      `}</style>
    </div>
  )
}
