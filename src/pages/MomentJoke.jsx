import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useJokes } from '../hooks/useJokes.js'
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js'
import { SurpriseMePrompt } from '../components/SurpriseMe.jsx'

export default function MomentJoke() {
  const { t } = useTranslation()
  const { jokes, loading } = useJokes()

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span style={{ fontSize: 40 }}>{'\uD83C\uDFAD'}</span>
          <h1>{t('pages.momentJoke.title')}</h1>
          <p>{t('pages.momentJoke.description')}</p>
        </div>
      </div>

      <div className="container section joke-list">
        {loading ? (
          <p className="loading-note">{'\u2026'}</p>
        ) : (
          jokes.map((j, i) => <JokeCard key={j.id} joke={j} index={i} />)
        )}
      </div>

      <div className="container">
        <SurpriseMePrompt />
      </div>

      <style>{`
        .joke-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          max-width: 680px;
        }
      `}</style>
    </>
  )
}

function JokeCard({ joke, index }) {
  const { t, i18n } = useTranslation()
  const hasNativeTranslation = Boolean(joke.translations[i18n.language])
  const englishContent = joke.translations.en
  const onDemand = useOnDemandTranslate({ setup: englishContent.setup, punchline: englishContent.punchline })
  const content = hasNativeTranslation ? joke.translations[i18n.language] : onDemand.shown
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="joke-card">
      <span className="joke-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="joke-body">
        {!hasNativeTranslation && onDemand.show && (
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
        <p className="setup">{content.setup}</p>
        {revealed ? (
          <p className="punchline">{content.punchline}</p>
        ) : (
          <button className="btn btn-ghost reveal" onClick={() => setRevealed(true)}>
            {t('common.revealPunchline')}
          </button>
        )}
      </div>

      <style>{`
        .joke-card {
          display: flex;
          gap: 20px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: var(--radius-sm);
          padding: 22px 24px;
        }
        .joke-index {
          font-family: var(--font-display);
          font-size: 26px;
          color: var(--blush-deep);
          line-height: 1;
        }
        .joke-body { flex: 1; }
        .setup { font-size: 17px; margin: 0 0 10px; }
        .punchline { color: var(--sage-dark); font-weight: 500; margin: 0; }
        .reveal { padding: 8px 16px; font-size: 13.5px; }
        .translate-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .translate-btn {
          font-size: 12.5px; font-weight: 600; color: var(--sage-dark);
          background: var(--sage-pale); border: none; padding: 6px 12px; border-radius: 100px;
        }
        .translate-btn:hover { background: var(--blush); }
        .translate-btn:disabled { opacity: 0.6; }
        .translate-error { font-size: 12px; color: #B4432D; }
      `}</style>
    </div>
  )
}
