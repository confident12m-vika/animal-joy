import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { useLostPets } from '../hooks/useLostPets.js'
import LostPetCard from '../components/LostPetCard.jsx'
import { POST_TYPES, ANIMAL_TYPES } from '../lib/lostPetConstants.js'

export default function LostFound() {
  const { t } = useTranslation()
  const { session } = useAuth()
  const [animalType, setAnimalType] = useState('')
  const [postType, setPostType] = useState('')
  const { posts, loading } = useLostPets({ animalType: animalType || undefined, postType: postType || undefined })

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span style={{ fontSize: 40 }}>{'\uD83D\uDC3E'}</span>
          <h1>{t('lostFound.heroTitle')}</h1>
          <p>{t('lostFound.heroSubtitle')}</p>
          <Link to={session ? '/lost-and-found/new' : '/account'} className="btn btn-primary">
            {t('lostFound.reportButton')}
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="lp-filters">
          <select value={postType} onChange={(e) => setPostType(e.target.value)}>
            <option value="">{t('lostFound.filterAllTypes')}</option>
            {POST_TYPES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.emoji} {t(`lostFound.${p.i18nKey}`)}
              </option>
            ))}
          </select>
          <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
            <option value="">{t('lostFound.filterAllAnimals')}</option>
            {ANIMAL_TYPES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.emoji} {t(`lostFound.${a.i18nKey}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="container section">
        {loading ? (
          <p className="loading-note">{'\u2026'}</p>
        ) : posts.length === 0 ? (
          <p className="empty-note">{t('lostFound.empty')}</p>
        ) : (
          <div className="card-grid">
            {posts.map((p) => (
              <LostPetCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .lp-filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
        .lp-filters select {
          font-family: var(--font-body);
          padding: 10px 14px;
          border-radius: 100px;
          border: 1px solid var(--line);
          background: var(--paper);
          font-size: 14px;
          color: var(--ink);
        }
        .empty-note { color: var(--ink-soft); padding: 40px 0; text-align: center; }
      `}</style>
    </>
  )
}
