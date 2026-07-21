import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useSiteBlock } from '../hooks/useSiteBlock.js'
import ImageUploader from '../components/ImageUploader.jsx'
import { formStyles } from './ArticleForm.jsx'

const fallback = {
  image: 'https://picsum.photos/seed/animaljoy-hero/1400/900',
  title: 'Every animal has a story. Come find one that makes you smile.',
  body: 'Happy endings, honest jokes, astonishing facts and pure animal chaos \u2014 a new reason to smile, every single day.',
}

export default function HomeSettings() {
  const { block, loading, refetch } = useSiteBlock('home', fallback)
  const [image, setImage] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setImage(block.image)
    setTitle(block.title)
    setBody(block.body)
  }, [block])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')

    const { error: err } = await supabase
      .from('site_blocks')
      .upsert({ key: 'home', image, title, body })

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      refetch()
    }
  }

  if (loading) return <p className="loading-note">{'\u2026'}</p>

  return (
    <div className="admin-form-page">
      <h1>Home Page</h1>
      <p className="section-note">
        Only the main photo, headline and short text can be edited here. The page layout, other
        sections, and the Surprise Me button stay as designed.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="field-block">
          <p className="field-label">Main photo</p>
          <ImageUploader value={image} onChange={setImage} />
        </div>

        <label>
          Main headline
          <textarea rows={2} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Short text
          <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>

        {error && <p className="admin-error">{error}</p>}
        {saved && <p className="saved-note">Saved \u2014 changes are live on the site now.</p>}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving\u2026' : 'Save changes'}
        </button>
      </form>

      <style>{formStyles}</style>
      <style>{`
        .section-note { color: var(--ink-soft); font-size: 13.5px; margin: -12px 0 22px; max-width: 520px; }
        .saved-note { color: var(--sage-dark); font-size: 13.5px; }
      `}</style>
    </div>
  )
}
