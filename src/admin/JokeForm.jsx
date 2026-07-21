import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { formStyles } from './ArticleForm.jsx'

export default function JokeForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [setup, setSetup] = useState('')
  const [punchline, setPunchline] = useState('')
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    supabase
      .from('jokes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) {
          setError(err.message)
        } else if (data) {
          setSetup(data.translations?.en?.setup || '')
          setPunchline(data.translations?.en?.punchline || '')
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
      published,
      translations: { en: { setup, punchline } },
    }

    const query = isEditing
      ? supabase.from('jokes').update(payload).eq('id', id)
      : supabase.from('jokes').insert(payload)

    const { error: err } = await query
    setSaving(false)

    if (err) {
      setError(err.message)
    } else {
      navigate('/admin/jokes')
    }
  }

  if (loading) return <p className="loading-note">{'\u2026'}</p>

  return (
    <div className="admin-form-page">
      <Link to="/admin/jokes" className="back-link">
        {'\u2190'} Back to Jokes
      </Link>
      <h1>{isEditing ? 'Edit Joke' : 'New Joke'}</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <label className="checkbox-row">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published (visible on the live site)
        </label>

        <div className="field-block">
          <label>
            Setup (the question / first line)
            <textarea rows={2} value={setup} onChange={(e) => setSetup(e.target.value)} required />
          </label>
          <label>
            Punchline (revealed when tapped)
            <textarea rows={2} value={punchline} onChange={(e) => setPunchline(e.target.value)} required />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving\u2026' : isEditing ? 'Save changes' : 'Publish joke'}
        </button>
      </form>

      <style>{formStyles}</style>
    </div>
  )
}
