import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useSiteBlock } from '../hooks/useSiteBlock.js'
import ImageUploader from '../components/ImageUploader.jsx'
import { formStyles } from './ArticleForm.jsx'

const fallback = {
  image: 'https://picsum.photos/seed/animaljoy-mission/900/650',
  title: 'Why we started this',
  body:
    'Urban Soul Vibe began with a simple idea: every rescued animal deserves to be seen, and every reader deserves a place that feels warm. Animal Joy is where that idea lives \u2014 one article, one photo, one small smile at a time.\n\nAs the project grows, we plan to support local shelters directly, share ways to foster and volunteer, and eventually offer a small collection of Urban Soul Vibe goods to help fund rescue work.',
}

export default function UrbanSoulVibeSettings() {
  const { block, loading, refetch } = useSiteBlock('urban-soul-vibe', fallback)
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
      .upsert({ key: 'urban-soul-vibe', image, title, body })

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
      <h1>Urban Soul Vibe Page</h1>
      <p className="section-note">
        Edit the mission photo and story text here. To add or remove the article cards shown
        further down that page, use Content {'\u2192'} Urban Soul Vibe section instead. Page
        layout stays as designed.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="field-block">
          <p className="field-label">Mission photo</p>
          <ImageUploader value={image} onChange={setImage} />
        </div>

        <label>
          Story title
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Story text (leave a blank line between paragraphs)
          <textarea rows={7} value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>

        {error && <p className="admin-error">{error}</p>}
        {saved && <p className="saved-note">Saved \u2014 changes are live on the site now.</p>}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving\u2026' : 'Save changes'}
        </button>
      </form>

      <style>{formStyles}</style>
      <style>{`
        .section-note { color: var(--ink-soft); font-size: 13.5px; margin: -12px 0 22px; max-width: 560px; }
        .saved-note { color: var(--sage-dark); font-size: 13.5px; }
      `}</style>
    </div>
  )
}
