import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import ImageUploader from '../components/ImageUploader.jsx'
import { POST_TYPES, ANIMAL_TYPES } from '../lib/lostPetConstants.js'
import { formStyles } from './ArticleForm.jsx'

export default function LostPetAdminForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [postType, setPostType] = useState('lost')
  const [animalType, setAnimalType] = useState('cat')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [locationUrl, setLocationUrl] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [status, setStatus] = useState('active')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      supabase.from('lost_pets').select('*').eq('id', id).single(),
      supabase.from('lost_pets_contact').select('*').eq('lost_pet_id', id).maybeSingle(),
    ]).then(([postRes, contactRes]) => {
      if (postRes.error) {
        setError(postRes.error.message)
      } else if (postRes.data) {
        const p = postRes.data
        setPostType(p.post_type)
        setAnimalType(p.animal_type)
        setTitle(p.title)
        setDescription(p.description)
        setImage(p.image || '')
        setLocationUrl(p.location_url || '')
        setEventDate(p.event_date || '')
        setStatus(p.status)
      }
      if (contactRes.data) setWhatsapp(contactRes.data.whatsapp)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error: postError } = await supabase
      .from('lost_pets')
      .update({
        post_type: postType,
        animal_type: animalType,
        title,
        description,
        image,
        location_url: locationUrl || null,
        event_date: eventDate || null,
        status,
      })
      .eq('id', id)

    if (postError) {
      setError(postError.message)
      setSaving(false)
      return
    }

    const { error: contactError } = await supabase
      .from('lost_pets_contact')
      .upsert({ lost_pet_id: id, whatsapp })

    setSaving(false)
    if (contactError) {
      setError(contactError.message)
      return
    }

    navigate('/admin/lost-and-found')
  }

  if (loading) return <p className="loading-note">{'\u2026'}</p>

  return (
    <div className="admin-form-page">
      <Link to="/admin/lost-and-found" className="back-link">
        {'\u2190'} Back to Lost & Found
      </Link>
      <h1>Edit report</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <label>
            Report type
            <select value={postType} onChange={(e) => setPostType(e.target.value)}>
              {POST_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.emoji} {p.value}
                </option>
              ))}
            </select>
          </label>
          <label>
            Animal
            <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
              {ANIMAL_TYPES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.emoji} {a.value}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={status === 'resolved'}
            onChange={(e) => setStatus(e.target.checked ? 'resolved' : 'active')}
          />
          Marked as resolved
        </label>

        <label>
          Title
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <div className="field-block">
          <p className="field-label">Photo</p>
          <ImageUploader value={image} onChange={setImage} pathPrefix="lost-pets" />
        </div>

        <div className="form-row">
          <label>
            Date lost / spotted
            <input type="date" value={eventDate || ''} onChange={(e) => setEventDate(e.target.value)} />
          </label>
          <label>
            Google Maps link
            <input type="url" value={locationUrl} onChange={(e) => setLocationUrl(e.target.value)} />
          </label>
        </div>

        <label>
          Details
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>

        <label>
          {'Poster\u2019s WhatsApp (private \u2014 visible to you and the poster only)'}
          <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving\u2026' : 'Save changes'}
        </button>
      </form>

      <style>{formStyles}</style>
    </div>
  )
}
