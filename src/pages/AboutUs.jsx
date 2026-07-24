import { useTranslation } from 'react-i18next'
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js'

const content = {
  title: 'About Us',
  body: `Animal Joy is a home for animal lovers \u2014 happy rescue stories, honest jokes, amazing facts, and a community that looks out for lost and stray animals together.

We're part of Urban Soul Vibe, a small project built around one idea: every animal deserves to be seen, and every reader deserves a place that feels warm.

What you'll find here
- Stories worth smiling about, from happy endings to everyday pet life.
- A Lost & Found board where the community helps reunite lost animals with their people, and flags animals that need urgent help.
- A growing space for photos, jokes, and small moments of joy, one article at a time.

Why we do this
We believe kindness toward animals says something good about all of us. Animal Joy exists to make that kindness a little easier to find, share, and act on.

Want to be part of it? Create an account to react to stories, report a lost or found animal, or just say hello through our Contact Us page.`,
}

export default function AboutUs() {
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
