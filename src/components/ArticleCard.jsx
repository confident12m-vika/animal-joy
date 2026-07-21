import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function ArticleCard({ article }) {
  const { t, i18n } = useTranslation()
  const content = article.translations[i18n.language] || article.translations.en
  const tag = t(`categories.${article.category}`)
  const isBestFinds = article.category === 'best-finds'

  return (
    <article className="article-card">
      <Link to={`/article/${article.id}`} className="thumb">
        <img src={article.image} alt="" loading="lazy" />
      </Link>
      <div className="body">
        <span className="tag">{tag}</span>
        <Link to={`/article/${article.id}`}>
          <h3>{content.title}</h3>
        </Link>
        <p>{content.excerpt}</p>
        <div className="meta">
          <span>{t('common.minRead', { count: article.readMinutes })}</span>
          <span>{'\u2764\uFE0F'} {article.reactions}</span>
        </div>
        {isBestFinds && article.link ? (
          <a className="btn btn-ghost read-more" href={article.link} target="_blank" rel="noreferrer">
            {'\uD83D\uDECD\uFE0F'} Shop now {'\u2192'}
          </a>
        ) : (
          <Link className="btn btn-ghost read-more" to={`/article/${article.id}`}>
            {t('common.readMore')} {'\u2192'}
          </Link>
        )}
      </div>

      <style>{`
        .article-card {
          background: var(--paper);
          border-radius: var(--radius);
          overflow: hidden;
          border: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .article-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 30px -18px rgba(56, 51, 44, 0.25);
        }
        .thumb { aspect-ratio: 4 / 3; overflow: hidden; display: block; }
        .thumb img { width: 100%; height: 100%; object-fit: cover; }
        .article-card .body { padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .article-card h3 {
          font-size: 19px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-card p {
          margin: 0;
          color: var(--ink-soft);
          font-size: 14.5px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .meta { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-soft); }
        .read-more { align-self: flex-start; padding: 8px 16px; font-size: 13.5px; margin-top: 4px; }
      `}</style>
    </article>
  )
}
