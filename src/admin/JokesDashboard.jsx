import { Link } from 'react-router-dom'
import { useJokes } from '../hooks/useJokes.js'
import { supabase } from '../lib/supabaseClient.js'
import { dashboardStyles } from './ArticlesDashboard.jsx'

export default function JokesDashboard() {
  const { jokes, loading, refetch } = useJokes({ onlyPublished: false })

  const togglePublished = async (joke) => {
    await supabase.from('jokes').update({ published: !joke.published }).eq('id', joke.id)
    refetch()
  }

  const remove = async (joke) => {
    if (!confirm('Delete this joke? This can\u2019t be undone.')) return
    await supabase.from('jokes').delete().eq('id', joke.id)
    refetch()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Jokes {'\uD83C\uDFAD'}</h1>
        <Link to="/admin/jokes/new" className="btn btn-primary">
          + Add New
        </Link>
      </div>
      <p className="section-note">
        Shown in the Moment Joke page, and picked randomly by the Surprise Me button on the site.
      </p>

      {loading ? (
        <p className="loading-note">{'\u2026'}</p>
      ) : jokes.length === 0 ? (
        <p className="empty-note">No jokes yet. Add your first one.</p>
      ) : (
        <div className="admin-table">
          {jokes.map((j) => (
            <div className="admin-row" key={j.id}>
              <div className="row-body">
                <h3>{j.translations?.en?.setup || '(untitled)'}</h3>
              </div>
              <span className={`status-pill ${j.published ? 'is-live' : 'is-draft'}`}>
                {j.published ? 'Published' : 'Draft'}
              </span>
              <div className="row-actions">
                <button className="btn btn-ghost" onClick={() => togglePublished(j)}>
                  {j.published ? 'Unpublish' : 'Publish'}
                </button>
                <Link className="btn btn-ghost" to={`/admin/jokes/${j.id}`}>
                  Edit
                </Link>
                <button className="btn btn-ghost danger" onClick={() => remove(j)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{dashboardStyles}</style>
      <style>{`.section-note { color: var(--ink-soft); font-size: 13.5px; margin: -14px 0 22px; }`}</style>
    </div>
  )
}
