import { useTranslation } from 'react-i18next'
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js'

const content = {
  title: 'Terms of Service',
  body: `Last updated: 2026

Welcome to Animal Joy. By using this website, you agree to these terms.

Using the site
- You must be able to form a legally binding agreement to create an account. If you're a minor, please only use the site with a parent or guardian's involvement.
- You agree to provide accurate information when creating an account or posting content, including Lost & Found reports.
- You're responsible for what you post: articles you react to, Lost & Found reports, contact messages, and any information you share through the site.

Lost & Found reports
- Reports should be truthful and made in good faith to help reunite animals with their owners or flag animals in need of help.
- Your WhatsApp number submitted with a report is kept private and shared only with you and site administrators for safety and moderation purposes.
- We may remove any report that appears fake, abusive, or violates these terms.

Acceptable use
- Don't use Animal Joy to harass, spam, or mislead other users.
- Don't post content that is illegal, hateful, or infringes on someone else's rights.
- We may suspend or remove accounts that violate these terms.

Content ownership
- You retain ownership of what you post, but you grant Animal Joy permission to display it on the site as part of its normal operation.
- Site content (articles, jokes, photos published by the site itself) belongs to Animal Joy / Urban Soul Vibe.

Disclaimer
- Animal Joy is a community platform to help share stories and find lost animals. We don't guarantee outcomes for any Lost & Found report, and we recommend using good judgment and normal safety precautions when meeting someone through the site.
- The site is provided "as is" without warranties of any kind.

Changes to these terms
We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.

Contact
Questions about these terms? Reach out through our Contact Us page.`,
}

export default function TermsOfService() {
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
