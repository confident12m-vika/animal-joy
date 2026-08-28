import { useTranslation } from 'react-i18next'
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js'
import { useMeta } from '../lib/useMeta.js'
import { aboutContent as content } from '../content/legalContent.js'

export default function AboutUs() {
  const { t, i18n } = useTranslation()
  useMeta({ title: `${content.title} - Animal Joy`, description: content.description })
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
