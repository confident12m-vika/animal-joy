import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { postTypeInfo, animalTypeInfo } from '../lib/lostPetConstants.js'

export default function LostPetCard({ post }) {
  const { t } = useTranslation()
  const pType = postTypeInfo(post.post_type)
  const aType = animalTypeInfo(post.animal_type)

  return (
    <Link to={`/lost-and-found/${post.id}`} className="lp-card">
      <div className="lp-thumb">
        {post.image && <img src={post.image} alt="" loading="lazy" />}
        {post.status === 'resolved' && <span className="lp-resolved-ribbon">{t('lostFound.resolved')}</span>}
      </div>
      <div className="lp-body">
        <div className="lp-tags">
          <span className="lp-tag" style={{ background: `${pType.color}1A`, color: pType.color }}>
            {pType.emoji} {t(`lostFound.${pType.i18nKey}`)}
          </span>
          <span className="lp-tag lp-animal-tag">
            {aType.emoji} {t(`lostFound.${aType.i18nKey}`)}
          </span>
        </div>
        <h3>{post.title}</h3>
        {post.event_date && <p className="lp-date">{new Date(post.event_date).toLocaleDateString()}</p>}
      </div>

      <style>{`
        .lp-card {
          display: block;
          background: var(--paper);
          border-radius: var(--radius);
          overflow: hidden;
          border: 1px solid var(--line);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .lp-card:hover { transform: translateY(-4px); box-shadow: 0 18px 30px -18px rgba(56, 51, 44, 0.25); }
        .lp-thumb { aspect-ratio: 4/3; background: var(--sage-pale); position: relative; overflow: hidden; }
        .lp-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .lp-resolved-ribbon {
          position: absolute; top: 12px; inset-inline-end: 12px;
          background: var(--sage-dark); color: white; font-size: 12px; font-weight: 600;
          padding: 4px 12px; border-radius: 100px;
        }
        .lp-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; }
        .lp-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .lp-tag { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 100px; }
        .lp-animal-tag { background: var(--sage-pale); color: var(--sage-dark); }
        .lp-card h3 {
          font-size: 17px;
          line-height: 1.3;
          overflow-wrap: break-word;
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .lp-date { font-size: 12.5px; color: var(--ink-soft); margin: 0; }
      `}</style>
    </Link>
  )
}
