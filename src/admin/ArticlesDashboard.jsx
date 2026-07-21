import { Link } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles.js'
import { supabase } from '../lib/supabaseClient.js'
import { deleteStorageFile } from '../lib/storageUtils.js'

const CATEGORIES = [
  { value: 'happy-stories', label: '\u2764\uFE0F Happy Stories' },
  { value: 'laugh-smile', label: '\uD83D\uDE02 Laugh & Smile' },
  { value: 'amazing-animals', label: '\uD83E\uDDE0 Amazing Animals' },
  { value: 'pet-life', label: '\uD83D\uDC36 Pet Life' },
  { value: 'best-finds', label: '\uD83D\uDECD\uFE0F Best Finds' },
  { value: 'urban-soul-vibe', label: '\uD83C\uDF3F Urban Soul Vibe' },
]

export default function ArticlesDashboard() {
  const { articles, loading, refetch } = useArticles({ onlyPublished: false })

  const togglePublished = async (article) => {
    await supabase.from('articles').update({ published: !article.published }).eq('id', article.id)
    refetch()
  }

  const remove = async (article) => {
    const en = article.translations?.en?.title || 'this item'
    if (!confirm(`Delete "${en}"? This can't be undone.`)) return
    await supabase.from('articles').delete().eq('id', article.id)
    await deleteStorageFile(article.image)
    refetch()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Content</h1>
        <Link to="/admin/articles/new" className="btn btn-primary">
          + Add New
        </Link>
      </div>

      {loading ? (
        <p className="loading-note">{'\u2026'}</p>
      ) : (
        <div className="category-sections">
          {CATEGORIES.map((cat) => {
            const items = articles.filter((a) => a.category === cat.value)
            return (
              <section className="category-section" key={cat.value}>
                <div className="category-head">
                  <h2>{cat.label}</h2>
                  <span className="category-count">{items.length}</span>
                  <Link to={`/admin/articles/new?category=${cat.value}`} className="add-here-link">
                    + Add New
                  </Link>
                </div>

                {items.length === 0 ? (
                  <p className="empty-note small">Nothing here yet.</p>
                ) : (
                  <div className="admin-table">
                    {items.map((a) => (
                      <div className="admin-row" key={a.id}>
                        <img className="row-thumb" src={a.image} alt="" />
                        <div className="row-body">
                          <h3>{a.translations?.en?.title || '(untitled)'}</h3>
                          {a.category === 'best-finds' && a.link && (
                            <a className="row-link" href={a.link} target="_blank" rel="noreferrer">
                              {a.link}
                            </a>
                          )}
                        </div>
                        <span className={`status-pill ${a.published ? 'is-live' : 'is-draft'}`}>
                          {a.published ? 'Published' : 'Draft'}
                        </span>
                        <div className="row-actions">
                          <button className="btn btn-ghost" onClick={() => togglePublished(a)}>
                            {a.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <Link className="btn btn-ghost" to={`/admin/articles/${a.id}`}>
                            Edit
                          </Link>
                          <button className="btn btn-ghost danger" onClick={() => remove(a)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}

      <style>{dashboardStyles}</style>
    </div>
  )
}

export const dashboardStyles = `
  .dash-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .dash-head h1 { font-size: 26px; }
  .empty-note { color: var(--ink-soft); padding: 40px 0; text-align: center; }
  .empty-note.small { padding: 4px 4px 16px; text-align: start; font-size: 13.5px; }
  .category-sections { display: flex; flex-direction: column; gap: 34px; }
  .category-head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--line);
  }
  .category-head h2 { font-size: 17px; flex: 1; }
  .category-count {
    font-size: 12.5px;
    color: var(--ink-soft);
    background: var(--sage-pale);
    padding: 2px 9px;
    border-radius: 100px;
  }
  .add-here-link { font-size: 13px; font-weight: 600; color: var(--sage-dark); }
  .add-here-link:hover { text-decoration: underline; }
  .admin-table { display: flex; flex-direction: column; gap: 10px; }
  .admin-row {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 12px 16px;
  }
  .row-thumb {
    width: 56px; height: 56px; border-radius: 10px; object-fit: cover; flex-shrink: 0;
    background: var(--sage-pale);
  }
  .row-body { flex: 1; min-width: 0; }
  .row-body h3 { font-size: 15.5px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .row-link {
    display: block; font-size: 12.5px; color: var(--sage-dark); margin-top: 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .status-pill {
    font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 100px; flex-shrink: 0;
  }
  .status-pill.is-live { background: var(--sage-pale); color: var(--sage-dark); }
  .status-pill.is-draft { background: #F1E7D8; color: #8A6D2F; }
  .row-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .row-actions .btn { padding: 8px 14px; font-size: 13px; }
  .row-actions .btn.danger { color: #B4432D; }
  .row-actions .btn.danger:hover { border-color: #B4432D; }
`
