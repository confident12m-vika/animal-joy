import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useJokes } from '../hooks/useJokes.js'
import { useArticles } from '../hooks/useArticles.js'

// Build one shared pool of "surprises": jokes + short story/fact teasers,
// resolved to the current language. Anything published in Supabase (or, if
// Supabase isn't configured yet, anything in src/data/) automatically joins
// this rotation — no other code changes needed.
function buildPool(jokes, articles, lang, t) {
  const jokeItems = jokes.map((j) => {
    const content = j.translations[lang] || j.translations.en
    return {
      kind: 'joke',
      kindLabel: `\uD83C\uDFAD ${t('surprise.kindJoke')}`,
      id: j.id,
      title: content.setup,
      body: content.punchline,
    }
  })

  const storyItems = articles
    .filter((a) => ['happy-stories', 'laugh-smile', 'amazing-animals'].includes(a.category))
    .map((a) => {
      const content = a.translations[lang] || a.translations.en
      const isFact = a.category === 'amazing-animals'
      return {
        kind: 'story',
        kindLabel: isFact ? `\uD83E\uDDE0 ${t('surprise.kindFact')}` : `\uD83D\uDC3E ${t('surprise.kindStory')}`,
        id: a.id,
        title: content.title,
        body: content.excerpt,
        image: a.image,
      }
    })

  return [...jokeItems, ...storyItems]
}

function pickRandom(pool, excludeId) {
  const options = pool.length > 1 ? pool.filter((p) => p.id !== excludeId) : pool
  return options[Math.floor(Math.random() * options.length)]
}

function SurpriseModal({ onClose }) {
  const { t, i18n } = useTranslation()
  const { jokes } = useJokes()
  const { articles } = useArticles()
  const pool = useMemo(() => buildPool(jokes, articles, i18n.language, t), [jokes, articles, i18n.language])
  const [current, setCurrent] = useState(null)
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    if (!current && pool.length) {
      setCurrent(pickRandom(pool))
    }
  }, [pool, current])

  const REACTIONS = [
    { key: 'loved', label: `\u2764\uFE0F ${t('surprise.loved')}` },
    { key: 'laughed', label: `\uD83D\uDE02 ${t('surprise.laughed')}` },
    { key: 'cute', label: `\uD83D\uDE0A ${t('surprise.cute')}` },
  ]

  const next = () => {
    setCurrent((c) => pickRandom(pool, c?.id))
    setPicked(null)
  }

  if (!current) return null

  return (
    <div className="surprise-overlay" role="dialog" aria-modal="true" aria-label={t('surprise.button')}>
      <div className="surprise-backdrop" onClick={onClose} />
      <div className="surprise-card">
        <button className="close-x" onClick={onClose} aria-label="Close">
          {'\u2715'}
        </button>

        <span className="tag">{current.kindLabel}</span>

        {current.image && (
          <div className="surprise-image">
            <img src={current.image} alt="" />
          </div>
        )}

        <h3>{current.title}</h3>
        {current.body && <p>{current.body}</p>}

        <div className="reactions">
          {REACTIONS.map((r) => (
            <button
              key={r.key}
              className={`reaction ${picked === r.key ? 'is-picked' : ''}`}
              onClick={() => setPicked(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button className="btn btn-primary again" onClick={next}>
          {'\uD83C\uDFB2'} {t('surprise.again')}
        </button>
      </div>

      <style>{`
        .surprise-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .surprise-backdrop {
          position: absolute; inset: 0;
          background: rgba(56, 51, 44, 0.45);
          backdrop-filter: blur(2px);
        }
        .surprise-card {
          position: relative;
          background: var(--paper);
          border-radius: 28px;
          max-width: 440px;
          width: 100%;
          padding: 36px 30px 30px;
          text-align: center;
          box-shadow: 0 30px 60px -20px rgba(56, 51, 44, 0.4);
          animation: pop 0.32s cubic-bezier(.2,.9,.3,1.2);
        }
        @keyframes pop {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .close-x {
          position: absolute; top: 14px; inset-inline-end: 16px;
          background: none; border: none; font-size: 16px; color: var(--ink-soft);
        }
        .surprise-image {
          margin: 16px -6px 6px;
          border-radius: 18px;
          overflow: hidden;
          aspect-ratio: 16/10;
        }
        .surprise-image img { width: 100%; height: 100%; object-fit: cover; }
        .surprise-card h3 { margin-top: 16px; font-size: 21px; line-height: 1.35; }
        .surprise-card p { color: var(--ink-soft); font-size: 15px; }
        .reactions {
          display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
          margin: 20px 0 18px;
        }
        .reaction {
          padding: 8px 14px; border-radius: 100px; border: 1px solid var(--line);
          background: var(--cream); font-size: 13.5px; color: var(--ink-soft);
          transition: all 0.2s ease;
        }
        .reaction.is-picked {
          background: var(--blush); border-color: var(--blush-deep); color: var(--ink);
        }
        .again { width: 100%; justify-content: center; }
      `}</style>
    </div>
  )
}

export function SurpriseMeButton({ size = 'large' }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className={`surprise-trigger ${size}`} onClick={() => setOpen(true)}>
        {'\u2728'} {t('surprise.button')}
      </button>
      {open && <SurpriseModal onClose={() => setOpen(false)} />}

      <style>{`
        .surprise-trigger {
          border: none;
          border-radius: 100px;
          font-family: var(--font-display);
          font-weight: 500;
          background: linear-gradient(135deg, var(--sage) 0%, var(--sage-dark) 100%);
          color: var(--paper);
          box-shadow: 0 14px 30px -12px rgba(89, 98, 63, 0.55);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .surprise-trigger:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 18px 34px -10px rgba(89, 98, 63, 0.6);
        }
        .surprise-trigger.large { padding: 20px 44px; font-size: 20px; }
        .surprise-trigger.small { padding: 12px 24px; font-size: 15px; }
      `}</style>
    </>
  )
}

export function SurpriseMePrompt() {
  const { t } = useTranslation()
  return (
    <div className="surprise-prompt">
      <p>{t('surprise.promptTitle')}</p>
      <SurpriseMeButton size="small" />
      <style>{`
        .surprise-prompt {
          margin: 48px auto;
          max-width: 480px;
          text-align: center;
          padding: 32px 24px;
          background: var(--sage-pale);
          border-radius: var(--radius);
        }
        .surprise-prompt p {
          font-family: var(--font-display);
          font-size: 20px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  )
}
