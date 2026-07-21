import { useTranslation } from 'react-i18next'
import { useGalleryPhotos } from '../hooks/useGalleryPhotos.js'
import { SurpriseMePrompt } from '../components/SurpriseMe.jsx'

export default function Gallery() {
  const { t } = useTranslation()
  const { photos, loading } = useGalleryPhotos()

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span style={{ fontSize: 40 }}>{'\uD83D\uDCF7'}</span>
          <h1>{t('pages.gallery.title')}</h1>
          <p>{t('pages.gallery.description')}</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <p className="loading-note">{'\u2026'}</p>
        ) : (
          <div className="masonry">
            {photos.map((p) => (
              <div className="masonry-item" key={p.id}>
                <img src={p.image} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container">
        <SurpriseMePrompt />
      </div>

      <style>{`
        .masonry {
          columns: 3 240px;
          column-gap: 20px;
          padding-bottom: 40px;
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 20px;
          border-radius: 18px;
          overflow: hidden;
        }
        .masonry-item img { width: 100%; display: block; }
        @media (max-width: 640px) {
          .masonry { columns: 2 160px; }
        }
      `}</style>
    </>
  )
}
