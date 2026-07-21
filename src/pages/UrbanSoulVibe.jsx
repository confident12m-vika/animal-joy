import { useTranslation } from 'react-i18next'
import { useArticles } from '../hooks/useArticles.js'
import { useSiteBlock } from '../hooks/useSiteBlock.js'
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js'
import ArticleCard from '../components/ArticleCard.jsx'
import { SurpriseMePrompt } from '../components/SurpriseMe.jsx'

const missionFallback = {
  image: 'https://picsum.photos/seed/animaljoy-mission/900/650',
  title: 'Why we started this',
  body:
    'Urban Soul Vibe began with a simple idea: every rescued animal deserves to be seen, and every reader deserves a place that feels warm. Animal Joy is where that idea lives \u2014 one article, one photo, one small smile at a time.\n\nAs the project grows, we plan to support local shelters directly, share ways to foster and volunteer, and eventually offer a small collection of Urban Soul Vibe goods to help fund rescue work.',
}

export default function UrbanSoulVibe() {
  const { t, i18n } = useTranslation()
  const { articles, loading } = useArticles()
  const { block: mission, isCustomized } = useSiteBlock('urban-soul-vibe', missionFallback)
  const onDemand = useOnDemandTranslate({ title: mission.title, body: mission.body })
  const missionText = !isCustomized
    ? {
        title: t('pages.urbanSoulVibe.storyTitle'),
        body: `${t('pages.urbanSoulVibe.p1')}\n\n${t('pages.urbanSoulVibe.p2')}`,
      }
    : onDemand.shown
  const items = articles.filter((a) => a.category === 'urban-soul-vibe')
  const paragraphs = missionText.body.split(/\n\s*\n/).filter(Boolean)

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span style={{ fontSize: 40 }}>{'\uD83C\uDF3F'}</span>
          <h1>{t('pages.urbanSoulVibe.title')}</h1>
          <p>{t('pages.urbanSoulVibe.intro')}</p>
        </div>
      </div>

      <div className="container mission">
        <div className="mission-image">
          <img src={mission.image} alt="" />
        </div>
        <div className="mission-copy">
          <p className="eyebrow">{t('pages.urbanSoulVibe.storyEyebrow')}</p>
          {isCustomized && i18n.language !== 'en' && (
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
          <h2>{missionText.title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="container section">
        {loading ? (
          <p className="loading-note">{'\u2026'}</p>
        ) : (
          <div className="card-grid">
            {items.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>

      <div className="container">
        <SurpriseMePrompt />
      </div>

      <style>{`
        .mission {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding-bottom: 20px;
        }
        .mission-image { border-radius: 26px; overflow: hidden; }
        .mission-image img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
        .mission-copy h2 { font-size: clamp(1.4rem, 3vw, 1.9rem); }
        .mission-copy p:not(.eyebrow) { color: var(--ink-soft); margin-bottom: 14px; }
        .translate-row { display: flex; align-items: center; gap: 12px; margin: 4px 0 10px; }
        .translate-btn {
          font-size: 13px; font-weight: 600; color: var(--sage-dark);
          background: var(--sage-pale); border: none; padding: 7px 14px; border-radius: 100px;
        }
        .translate-btn:hover { background: var(--blush); }
        .translate-btn:disabled { opacity: 0.6; }
        .translate-error { font-size: 12.5px; color: #B4432D; }
        @media (max-width: 860px) {
          .mission { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
