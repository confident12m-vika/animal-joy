import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import ImageUploader from '../components/ImageUploader.jsx'

const CATEGORIES = [
  { value: 'happy-stories', label: 'Happy Stories' },
  { value: 'laugh-smile', label: 'Laugh & Smile' },
  { value: 'amazing-animals', label: 'Amazing Animals' },
  { value: 'pet-life', label: 'Pet Life' },
  { value: 'best-finds', label: 'Best Finds' },
  { value: 'urban-soul-vibe', label: 'Urban Soul Vibe' },
]

export default function ArticleForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const preselectedCategory = searchParams.get('category')
  const validCategory = CATEGORIES.some((c) => c.value === preselectedCategory)

  const [category, setCategory] = useState(validCategory ? preselectedCategory : 'happy-stories')
  const [image, setImage] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [link, setLink] = useState('')
  const [readMinutes, setReadMinutes] = useState(5)
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message)
        } else if (data) {
          setCategory(data.category)
          setImage(data.image || '')
          setTitle(data.translations?.en?.title || '')
          setExcerpt(data.translations?.en?.excerpt || '')
          setLink(data.link || '')
          setReadMinutes(data.read_minutes ?? 5)
          setPublished(data.published)
        }
        setLoading(false)
      })
  }, [id, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      category,
      image,
      link: category === 'best-finds' ? link : null,
      read_minutes: Number(readMinutes) || 5,
      published,
      // Only English is filled in for now — other languages fall back to
      // English automatically on the live site until multi-language admin
      // support is added.
      translations: { en: { title, excerpt } },
    }

    const query = isEditing
      ? supabase.from('articles').update(payload).eq('id', id)
      : supabase.from('articles').insert({ ...payload, reactions: 0 })

    const { error: err } = await query
    setSaving(false)

    if (err) {
      setError(err.message)
    } else {
      navigate('/admin/articles')
    }
  }

  if (loading) return <p className="loading-note">{'\u2026'}</p>

  return (
    <div className="admin-form-page">
      <Link to="/admin/articles" className="back-link">
        {'\u2190'} Back to Content
      </Link>
      <h1>
        {isEditing ? 'Edit' : 'New'} {CATEGORIES.find((c) => c.value === category)?.label || 'Article'}
      </h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <label>
            Section
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Read time (minutes)
            <input type="number" min="1" value={readMinutes} onChange={(e) => setReadMinutes(e.target.value)} />
          </label>
        </div>

        <label className="checkbox-row">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published (visible on the live site)
        </label>

        <div className="field-block">
          <p className="field-label">Photo</p>
          <ImageUploader value={image} onChange={setImage} />
        </div>

        <div className="field-block">
          <label>
            Title
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Text
            <textarea rows={5} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
          </label>
          {category === 'best-finds' && (
            <label>
              Shop link (URL)
              <input
                type="url"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving\u2026' : isEditing ? 'Save changes' : 'Publish'}
        </button>
      </form>

      <style>{formStyles}</style>
    </div>
  )
}

export const formStyles = `
  .admin-form-page { max-width: 640px; }
  .back-link { font-size: 13.5px; color: var(--ink-soft); display: inline-block; margin-bottom: 14px; }
  .back-link:hover { color: var(--sage-dark); }
  .admin-form-page h1 { font-size: 24px; margin-bottom: 20px; }
  .admin-form { display: flex; flex-direction: column; gap: 20px; }
  .form-row { display: grid; grid-template-columns: 1.5fr 1fr; gap: 14px; }
  .admin-form label {
    display: flex; flex-direction: column; gap: 6px;
    font-size: 13.5px; font-weight: 500; color: var(--ink);
  }
  .admin-form input, .admin-form select, .admin-form textarea {
    font-family: var(--font-body);
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--line);
    background: var(--paper);
    font-size: 14px;
  }
  .admin-form input:focus, .admin-form select:focus, .admin-form textarea:focus {
    outline: 2px solid var(--sage);
    outline-offset: 1px;
  }
  .checkbox-row { flex-direction: row !important; align-items: center; gap: 8px !important; }
  .checkbox-row input { width: auto; }
  .field-block { display: flex; flex-direction: column; gap: 14px; }
  .field-label { font-size: 13.5px; font-weight: 500; margin: 0; }
  .admin-error { color: #B4432D; font-size: 13.5px; }
`
