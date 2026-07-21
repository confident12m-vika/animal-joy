import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'
import ImageUploader from '../components/ImageUploader.jsx'
import { POST_TYPES, ANIMAL_TYPES } from '../lib/lostPetConstants.js'

export default function LostPetForm() {
  const { t } = useTranslation()
  const { session } = useAuth()
  const navigate = useNavigate()

  const [postType, setPostType] = useState('lost')
  const [animalType, setAnimalType] = useState('cat')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [locationUrl, setLocationUrl] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!session) {
    return (
      <div className="container lp-form-page">
        <p>{t('lostFound.needAccount')}</p>
        <Link to="/account" className="btn btn-primary">
          {t('lostFound.signIn')}
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { data: post, error: postError } = await supabase
      .from('lost_pets')
      .insert({
        user_id: session.user.id,
        post_type: postType,
        animal_type: animalType,
        title,
        description,
        image,
        location_url: locationUrl || null,
        event_date: eventDate || null,
      })
      .select()
      .single()

    if (postError) {
      setError(postError.message)
      setSaving(false)
      return
    }

    const { error: contactError } = await supabase
      .from('lost_pets_contact')
      .insert({ lost_pet_id: post.id, whatsapp })

    setSaving(false)

    if (contactError) {
      setError(contactError.message)
      return
    }

    navigate(`/lost-and-found/${post.id}`)
  }

  return (
    <div className="container lp-form-page">
      <Link to="/lost-and-found" className="back-link">
        {t('lostFound.backLink')}
      </Link>
      <h1>{t('lostFound.formTitle')}</h1>
      <p className="section-note">{t('lostFound.formPrivacyNote')}</p>

      <form onSubmit={handleSubmit} className="lp-form">
        <div className="form-row">
          <label>
            {t('lostFound.formReportType')}
            <select value={postType} onChange={(e) => setPostType(e.target.value)}>
              {POST_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.emoji} {t(`lostFound.${p.i18nKey}`)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('lostFound.formAnimal')}
            <select value={animalType} onChange={(e) => setAnimalType(e.target.value)}>
              {ANIMAL_TYPES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.emoji} {t(`lostFound.${a.i18nKey}`)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          {t('lostFound.formTitleLabel')}
          <input
            type="text"
            placeholder={t('lostFound.formTitlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <div className="field-block">
          <p className="field-label">{t('lostFound.formPhoto')}</p>
          <ImageUploader value={image} onChange={setImage} pathPrefix="lost-pets" />
        </div>

        <div className="form-row">
          <label>
            {t('lostFound.formDate')}
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </label>
          <label>
            {t('lostFound.formLocation')}
            <input
              type="url"
              placeholder="https://maps.google.com/..."
              value={locationUrl}
              onChange={(e) => setLocationUrl(e.target.value)}
            />
          </label>
        </div>

        <label>
          {t('lostFound.formDetails')}
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <span className="field-hint">{t('lostFound.formDetailsHelp')}</span>
        </label>

        <label>
          {t('lostFound.formWhatsapp')}
          <input
            type="tel"
            placeholder="+967..."
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? t('lostFound.formSubmitting') : t('lostFound.formSubmit')}
        </button>
      </form>

      <style>{formStyles}</style>
    </div>
  )
}

const formStyles = `
  .lp-form-page { max-width: 640px; padding-top: 32px; padding-bottom: 60px; }
  .back-link { font-size: 13.5px; color: var(--ink-soft); display: inline-block; margin-bottom: 14px; }
  .back-link:hover { color: var(--sage-dark); }
  .lp-form-page h1 { font-size: 26px; margin-bottom: 8px; }
  .section-note { color: var(--ink-soft); font-size: 13.5px; margin-bottom: 24px; }
  .lp-form { display: flex; flex-direction: column; gap: 18px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .lp-form label {
    display: flex; flex-direction: column; gap: 6px;
    font-size: 13.5px; font-weight: 500; color: var(--ink);
  }
  .lp-form input, .lp-form select, .lp-form textarea {
    font-family: var(--font-body); padding: 10px 12px; border-radius: 10px;
    border: 1px solid var(--line); background: var(--paper); font-size: 14px;
  }
  .lp-form input:focus, .lp-form select:focus, .lp-form textarea:focus {
    outline: 2px solid var(--sage); outline-offset: 1px;
  }
  .field-hint { font-size: 12.5px; color: var(--ink-soft); font-weight: 400; margin-top: 2px; }
  .field-block { display: flex; flex-direction: column; gap: 12px; }
  .field-label { font-size: 13.5px; font-weight: 500; margin: 0; }
  .admin-error { color: #B4432D; font-size: 13.5px; }
  @media (max-width: 640px) {
    .form-row { grid-template-columns: 1fr; }
  }
`
