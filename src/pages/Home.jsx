import { useTranslation } from 'react-i18next'
import { useArticles } from '../hooks/useArticles.js'
import { useSiteBlock } from '../hooks/useSiteBlock.js'
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js'
import ArticleCard from '../components/ArticleCard.jsx'
import { SurpriseMeButton } from '../components/SurpriseMe.jsx'

const heroFallback = {
  image: 'https://picsum.photos/seed/animaljoy-hero/1400/900',
  title: 'Every animal has a story. Come find one that makes you smile.',
  body: 'Happy endings, honest jokes, astonishing facts and pure animal chaos \u2014 a new reason to smile, every single day.',
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const { articles, loading } = useArticles()
  const { block: hero, isCustomized } = useSiteBlock('home', heroFallback)
  const onDemand = useOnDemandTranslate({ title: hero.title, body: hero.body })
  // If admin hasn't customized the hero yet, use the already-translated
  // defaults (available in all 4 languages). If admin wrote their own
  // hero text, it's English-only, so offer on-demand translation instead.
  const heroText = !isCustomized
    ? { title: t('home.title'), body: t('home.subtitle') }
    : onDemand.shown
  const latest = articles.slice(0, 3)
  const popular = [...articles].sort((a, b) => b.reactions - a.reactions).slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">{t('home.eyebrow')}</p>
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
          <h1>{heroText.title}</h1>
          <p className="hero-sub">{heroText.body}</p>
          <SurpriseMeButton size="large" />
        </div>
        <div className="hero-image">
          <img src={hero.image} alt="A happy dog and cat resting together" />
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>{t('home.latest')}</h2>
          <div className="divider-leaf" />
        </div>
        {loading ? (
          <p className="loading-note">{'\u2026'}</p>
        ) : (
          <div className="card-grid">
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>{t('home.popular')}</h2>
          <div className="divider-leaf" />
        </div>
        {loading ? (
          <p className="loading-note">{'\u2026'}</p>
        ) : (
          <div className="card-grid">
            {popular.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>

      <section className="usv-strip">
        <div className="container usv-inner">
          <div>
            <p className="eyebrow">{t('home.usvEyebrow')}</p>
            <h2>{t('home.usvTitle')}</h2>
            <p>{t('home.usvText')}</p>
            <a className="btn btn-ghost" href="/urban-soul-vibe">
              {t('home.usvCta')} {'\u2192'}
            </a>
          </div>
          <img src="https://picsum.photos/seed/animaljoy-usv-strip/700/500" alt="" />
        </div>
      </section>

      <style>{`
        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 40px;
          padding: 56px 0 20px;
        }
        .hero-inner { padding-inline-start: 28px; }
        .hero h1 {
          font-size: clamp(2.1rem, 4vw, 3.1rem);
          line-height: 1.15;
          margin: 10px 0 18px;
        }
        .hero-sub {
          color: var(--ink-soft);
          font-size: 17px;
          max-width: 460px;
          margin-bottom: 28px;
        }
        .translate-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .translate-btn {
          font-size: 13px; font-weight: 600; color: var(--sage-dark);
          background: var(--sage-pale); border: none; padding: 7px 14px; border-radius: 100px;
        }
        .translate-btn:hover { background: var(--blush); }
        .translate-btn:disabled { opacity: 0.6; }
        .translate-error { font-size: 12.5px; color: #B4432D; }
        .hero-image {
          border-radius: 28px;
          overflow: hidden;
          aspect-ratio: 4/3.1;
          margin-inline-end: 28px;
        }
        .hero-image img { width: 100%; height: 100%; object-fit: cover; }
        .section-head { text-align: center; margin-bottom: 28px; }
        .section-head h2 { font-size: 28px; }
        .usv-strip { background: var(--sage-pale); padding: 60px 0; margin-top: 40px; }
        .usv-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 40px;
        }
        .usv-inner img { border-radius: 24px; width: 100%; aspect-ratio: 4/3; object-fit: cover; }
        .usv-inner h2 { font-size: 30px; }
        .usv-inner p { color: var(--ink-soft); margin-bottom: 20px; max-width: 420px; }
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding-top: 0; }
          .hero-inner { padding-inline-start: 0; order: 2; }
          .hero-image { margin-inline-end: 0; order: 1; margin-top: 0; border-radius: 0; aspect-ratio: 4/3; }
          .usv-inner { grid-template-columns: 1fr; }
          .usv-inner img { order: -1; }
        }
        @media (max-width: 480px) {
          .hero-inner { padding: 0 20px; }
          .hero h1 { font-size: 1.7rem; }
          .hero-sub { font-size: 15.5px; }
        }
      `}</style>
    </>
  )
}
