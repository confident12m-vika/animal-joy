import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useArticle } from '../hooks/useArticle.js'
import { useOnDemandTranslate } from '../hooks/useOnDemandTranslate.js'
import { SurpriseMePrompt } from '../components/SurpriseMe.jsx'

export default function ArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { article, loading, notFound } = useArticle(id)
  const [copied, setCopied] = useState(false)

  const englishContent = article?.translations?.en || { title: '', excerpt: '' }
  const hasNativeTranslation = article ? Boolean(article.translations[i18n.language]) : true
  const onDemand = useOnDemandTranslate({ title: englishContent.title, excerpt: englishContent.excerpt })

  if (loading) {
    return (
      <div className="container">
        <p className="loading-note">{'\u2026'}</p>
      </div>
    )
  }

  if (notFound || !article) {
    return (
      <div className="container not-found">
        <h1>{'\uD83D\uDC3E'}</h1>
        <p>{'This story isn\u2019t here anymore.'}</p>
        <Link to="/" className="btn btn-primary">
          {'\u2190'} Back to Animal Joy
        </Link>
      </div>
    )
  }

  const content = hasNativeTranslation ? article.translations[i18n.language] : onDemand.shown
  const tag = t(`categories.${article.category}`)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = content.title

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl })
      } catch {
        // person cancelled the share sheet, nothing to do
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available, silently ignore
    }
  }

  return (
    <article className="article-page">
      <div className="container top-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          {'\u2190'} Back
        </button>
      </div>

      <div className="container article-head">
        <span className="tag">{tag}</span>
        <h1>{content.title}</h1>
        <div className="meta">
          <span>{t('common.minRead', { count: article.readMinutes })}</span>
          <span>{'\u2764\uFE0F'} {article.reactions}</span>
        </div>
      </div>

      <div className="container hero-image-wrap">
        <img src={article.image} alt="" className="hero-image" />
      </div>

      <div className="container article-body">
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
        <p>{content.excerpt}</p>

        {article.category === 'best-finds' && article.link && (
          <a className="btn btn-primary shop-link" href={article.link} target="_blank" rel="noreferrer">
            {'\uD83D\uDECD\uFE0F'} Shop now {'\u2192'}
          </a>
        )}

        <div className="share-row">
          <p className="share-label">Share this story</p>
          <div className="share-buttons">
            {typeof navigator !== 'undefined' && navigator.share && (
              <button className="share-btn" onClick={handleNativeShare}>
                {'\uD83D\uDCE4'} Share
              </button>
            )}
            <a
              className="share-btn"
              href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              className="share-btn"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>
            <a
              className="share-btn"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <button className="share-btn" onClick={handleCopyLink}>
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <SurpriseMePrompt />
      </div>

      <style>{`
        .top-bar { padding: 20px 28px 0; }
        .back-btn {
          background: none;
          border: none;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--ink-soft);
          padding: 8px 4px;
        }
        .back-btn:hover { color: var(--sage-dark); }

        .article-head {
          padding: 20px 28px 0;
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }
        .meta { justify-content: center; }
        .article-head h1 {
          font-size: clamp(1.7rem, 4vw, 2.6rem);
          line-height: 1.2;
          margin: 12px 0 14px;
        }
        .meta { display: flex; gap: 16px; font-size: 14px; color: var(--ink-soft); }
        .translate-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .translate-btn {
          font-size: 13px; font-weight: 600; color: var(--sage-dark);
          background: var(--sage-pale); border: none; padding: 7px 14px; border-radius: 100px;
        }
        .translate-btn:hover { background: var(--blush); }
        .translate-btn:disabled { opacity: 0.6; }
        .translate-error { font-size: 12.5px; color: #B4432D; }

        .hero-image-wrap {
          max-width: 760px;
          margin: 24px auto 0;
        }
        .hero-image {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          border-radius: var(--radius);
          display: block;
        }

        .article-body {
          max-width: 760px;
          margin: 0 auto;
          padding: 28px 28px 8px;
        }
        .article-body p {
          font-size: 17px;
          line-height: 1.75;
          color: var(--ink);
          white-space: pre-line;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .shop-link { margin-top: 8px; }

        .share-row {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid var(--line);
        }
        .share-label { font-size: 13.5px; color: var(--ink-soft); margin-bottom: 10px; }
        .share-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
        .share-btn {
          padding: 9px 16px;
          border-radius: 100px;
          border: 1px solid var(--line);
          background: var(--paper);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--ink);
        }
        .share-btn:hover { border-color: var(--sage); color: var(--sage-dark); }

        .not-found {
          text-align: center;
          padding: 90px 20px;
        }
        .not-found h1 { font-size: 40px; }
        .not-found p { color: var(--ink-soft); margin-bottom: 20px; }

        @media (max-width: 640px) {
          .article-head, .article-body, .top-bar { padding-left: 20px; padding-right: 20px; }
          .hero-image { max-height: 280px; border-radius: 16px; }
          .article-body p { font-size: 16px; }
          .share-buttons { gap: 6px; }
          .share-btn { padding: 8px 13px; font-size: 13px; }
        }
      `}</style>
    </article>
  )
}
