import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { deleteStorageFile } from '../lib/storageUtils.js'
import { translateText } from '../lib/translate.js'
import { postTypeInfo, animalTypeInfo } from '../lib/lostPetConstants.js'

export default function LostPetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const { t, i18n } = useTranslation()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [responses, setResponses] = useState([])

  const [showResponseForm, setShowResponseForm] = useState(false)
  const [rName, setRName] = useState('')
  const [rWhatsapp, setRWhatsapp] = useState('')
  const [rMessage, setRMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const [translated, setTranslated] = useState(null) // { title, description } | null
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState('')

  const isOwner = session && post && session.user.id === post.user_id

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('lost_pets').select('*').eq('id', id).maybeSingle()
    if (!data) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setPost(data)
    setLoading(false)

    if (session && session.user.id === data.user_id) {
      const { data: resp } = await supabase
        .from('lost_pet_responses')
        .select('*')
        .eq('lost_pet_id', id)
        .order('created_at', { ascending: false })
      setResponses(resp || [])
    }
  }

  useEffect(() => {
    load()
    setTranslated(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, session])

  if (loading) {
    return (
      <div className="container">
        <p className="loading-note">{'\u2026'}</p>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="container not-found">
        <h1>{'\uD83D\uDC3E'}</h1>
        <p>{t('lostFound.notFound')}</p>
        <Link to="/lost-and-found" className="btn btn-primary">
          {t('lostFound.backLink')}
        </Link>
      </div>
    )
  }

  const pType = postTypeInfo(post.post_type)
  const aType = animalTypeInfo(post.animal_type)
  const shownTitle = translated?.title || post.title
  const shownDescription = translated?.description || post.description

  const markResolved = async () => {
    await supabase.from('lost_pets').update({ status: 'resolved' }).eq('id', post.id)
    load()
  }

  const removePost = async () => {
    if (!confirm(t('lostFound.deleteConfirm'))) return
    await supabase.from('lost_pets').delete().eq('id', post.id)
    if (post.image) deleteStorageFile(post.image)
    navigate('/lost-and-found')
  }

  const handleTranslate = async () => {
    if (translated) {
      setTranslated(null)
      return
    }
    setTranslating(true)
    setTranslateError('')
    try {
      const [title, description] = await Promise.all([
        translateText(post.title, i18n.language),
        translateText(post.description, i18n.language),
      ])
      setTranslated({ title, description })
    } catch {
      setTranslateError('Translation unavailable right now.')
    }
    setTranslating(false)
  }

  const handleRespond = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    const { error: err } = await supabase.from('lost_pet_responses').insert({
      lost_pet_id: post.id,
      responder_id: session.user.id,
      responder_name: rName,
      responder_whatsapp: rWhatsapp,
      message: rMessage,
    })

    setSending(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
      setShowResponseForm(false)
    }
  }

  return (
    <div className="lp-detail-page">
      <div className="container lp-detail">
        <Link to="/lost-and-found" className="back-link">
          {t('lostFound.backLink')}
        </Link>

        <div className="lp-head">
          <div className="lp-tags">
            <span className="lp-tag" style={{ background: `${pType.color}1A`, color: pType.color }}>
              {pType.emoji} {t(`lostFound.${pType.i18nKey}`)}
            </span>
            <span className="lp-tag lp-animal-tag">
              {aType.emoji} {t(`lostFound.${aType.i18nKey}`)}
            </span>
            {post.status === 'resolved' && (
              <span className="lp-tag lp-resolved-tag">{'\u2705'} {t('lostFound.resolved')}</span>
            )}
          </div>

          <h1>{shownTitle}</h1>

          <div className="lp-meta">
            {post.event_date && (
              <span>
                {'\uD83D\uDCC5'} {new Date(post.event_date).toLocaleDateString()}
              </span>
            )}
            {post.location_url && (
              <a href={post.location_url} target="_blank" rel="noreferrer">
                {t('lostFound.viewLocation')}
              </a>
            )}
          </div>
        </div>

        {post.image && (
          <div className="lp-image-wrap">
            <img src={post.image} alt="" />
          </div>
        )}

        <div className="lp-content">
          <div className="translate-row">
            <button className="translate-btn" onClick={handleTranslate} disabled={translating}>
              {translating ? t('lostFound.translating') : translated ? t('lostFound.showOriginal') : t('lostFound.translate')}
            </button>
            {translateError && <span className="translate-error">{translateError}</span>}
          </div>

          <p className="lp-description">{shownDescription}</p>

          {isOwner ? (
            <div className="owner-panel">
              <p className="owner-title">{t('lostFound.ownerTitle')}</p>
              <div className="owner-actions">
                {post.status !== 'resolved' && (
                  <button className="btn btn-primary" onClick={markResolved}>
                    {t('lostFound.markResolved')}
                  </button>
                )}
                <button className="btn btn-ghost danger" onClick={removePost}>
                  {t('lostFound.deleteReport')}
                </button>
              </div>

              <div className="responses">
                <p className="field-label">
                  {t('lostFound.responsesTitle')} {responses.length > 0 && `(${responses.length})`}
                </p>
                {responses.length === 0 ? (
                  <p className="empty-note">{t('lostFound.noResponses')}</p>
                ) : (
                  responses.map((r) => (
                    <div className="response-card" key={r.id}>
                      <p className="response-name">{r.responder_name}</p>
                      <p className="response-message">{r.message}</p>
                      <a
                        className="response-whatsapp"
                        href={`https://wa.me/${r.responder_whatsapp.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {'\uD83D\uDCAC'} WhatsApp {r.responder_whatsapp}
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="respond-panel">
              {sent ? (
                <p className="sent-note">{t('lostFound.respondSent')}</p>
              ) : !session ? (
                <div className="signin-prompt">
                  <p>{t('lostFound.signInToRespond')}</p>
                  <Link to="/account" className="btn btn-primary">
                    {t('lostFound.signIn')}
                  </Link>
                </div>
              ) : !showResponseForm ? (
                <button className="btn btn-primary" onClick={() => setShowResponseForm(true)}>
                  {t('lostFound.respondButton')}
                </button>
              ) : (
                <form onSubmit={handleRespond} className="response-form">
                  <label>
                    {t('lostFound.respondName')}
                    <input type="text" value={rName} onChange={(e) => setRName(e.target.value)} required />
                  </label>
                  <label>
                    {t('lostFound.respondWhatsapp')}
                    <input type="tel" value={rWhatsapp} onChange={(e) => setRWhatsapp(e.target.value)} required />
                  </label>
                  <label>
                    {t('lostFound.respondMessage')}
                    <textarea rows={3} value={rMessage} onChange={(e) => setRMessage(e.target.value)} required />
                  </label>
                  {error && <p className="admin-error">{error}</p>}
                  <button className="btn btn-primary" type="submit" disabled={sending}>
                    {sending ? t('lostFound.respondSending') : t('lostFound.respondSend')}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{styles}</style>
    </div>
  )
}

const styles = `
  .lp-detail-page { padding-top: 24px; padding-bottom: 60px; }
  .lp-detail { max-width: 700px; }
  .back-link { font-size: 14.5px; color: var(--ink-soft); display: inline-block; margin-bottom: 22px; }
  .back-link:hover { color: var(--sage-dark); }

  .lp-head { text-align: center; margin-bottom: 22px; }
  .lp-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-bottom: 14px; }
  .lp-tag { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 100px; }
  .lp-animal-tag { background: var(--sage-pale); color: var(--sage-dark); }
  .lp-resolved-tag { background: var(--sage-dark); color: white; }
  .lp-detail h1 { font-size: clamp(1.5rem, 4vw, 2.2rem); line-height: 1.25; margin-bottom: 12px; }
  .lp-meta { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; font-size: 14px; color: var(--ink-soft); }
  .lp-meta a { color: var(--sage-dark); font-weight: 500; }

  .lp-image-wrap { border-radius: var(--radius); overflow: hidden; margin-bottom: 24px; }
  .lp-image-wrap img { width: 100%; max-height: 440px; object-fit: cover; display: block; }

  .lp-content { max-width: 620px; margin: 0 auto; }
  .translate-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .translate-btn {
    font-size: 13px; font-weight: 600; color: var(--sage-dark);
    background: var(--sage-pale); border: none; padding: 7px 14px; border-radius: 100px;
  }
  .translate-btn:hover { background: var(--blush); }
  .translate-btn:disabled { opacity: 0.6; }
  .translate-error { font-size: 12.5px; color: #B4432D; }

  .lp-description { font-size: 16px; line-height: 1.75; white-space: pre-line; margin-bottom: 32px; }

  .owner-panel, .respond-panel { border-top: 1px solid var(--line); padding-top: 24px; }
  .owner-title { font-weight: 600; margin-bottom: 12px; }
  .owner-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; }
  .owner-actions .btn.danger { color: #B4432D; }
  .field-label { font-size: 13.5px; font-weight: 600; margin-bottom: 10px; }
  .empty-note { color: var(--ink-soft); font-size: 14px; }
  .response-card {
    background: var(--paper); border: 1px solid var(--line); border-radius: 14px;
    padding: 14px 16px; margin-bottom: 10px;
  }
  .response-name { font-weight: 600; font-size: 14px; margin: 0 0 4px; }
  .response-message { font-size: 14px; color: var(--ink); margin: 0 0 8px; }
  .response-whatsapp { font-size: 13px; color: var(--sage-dark); font-weight: 500; }
  .sent-note { color: var(--sage-dark); font-size: 15px; text-align: center; }
  .signin-prompt { text-align: center; }
  .signin-prompt p { margin-bottom: 14px; }
  .respond-panel { text-align: center; }
  .response-form {
    display: flex; flex-direction: column; gap: 14px; max-width: 420px;
    margin: 0 auto; text-align: start;
  }
  .response-form label { display: flex; flex-direction: column; gap: 6px; font-size: 13.5px; font-weight: 500; }
  .response-form input, .response-form textarea {
    font-family: var(--font-body); padding: 10px 12px; border-radius: 10px;
    border: 1px solid var(--line); background: var(--paper); font-size: 14px;
  }
  .admin-error { color: #B4432D; font-size: 13.5px; }
  .not-found { text-align: center; padding: 90px 20px; }
  .not-found h1 { font-size: 40px; }
  .not-found p { color: var(--ink-soft); margin-bottom: 20px; }

  @media (max-width: 640px) {
    .lp-image-wrap img { max-height: 260px; }
  }
`
