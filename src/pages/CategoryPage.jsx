import { useTranslation } from 'react-i18next'
import { useArticles } from '../hooks/useArticles.js'
import ArticleCard from '../components/ArticleCard.jsx'
import { SurpriseMePrompt } from '../components/SurpriseMe.jsx'

export default function CategoryPage({ categoryKey, emoji, pageKey }) {
  const { t } = useTranslation()
  const { articles, loading } = useArticles()
  const items = articles.filter((a) => a.category === categoryKey)

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span style={{ fontSize: 40 }}>{emoji}</span>
          <h1>{t(`pages.${pageKey}.title`)}</h1>
          <p>{t(`pages.${pageKey}.description`)}</p>
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
    </>
  )
}
