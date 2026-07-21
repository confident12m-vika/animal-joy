import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import { deleteStorageFile } from '../lib/storageUtils.js'
import { postTypeInfo, animalTypeInfo } from '../lib/lostPetConstants.js'

export default function LostFoundDashboard() {
  const [posts, setPosts] = useState([])
  const [contacts, setContacts] = useState({})
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data: postsData } = await supabase
      .from('lost_pets')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(postsData || [])

    if (postsData?.length) {
      const { data: contactsData } = await supabase
        .from('lost_pets_contact')
        .select('*')
        .in(
          'lost_pet_id',
          postsData.map((p) => p.id)
        )
      const map = {}
      ;(contactsData || []).forEach((c) => {
        map[c.lost_pet_id] = c.whatsapp
      })
      setContacts(map)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (post) => {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return
    await supabase.from('lost_pets').delete().eq('id', post.id)
    if (post.image) deleteStorageFile(post.image)
    load()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Lost & Found {'\uD83D\uDC3E'}</h1>
      </div>
      <p className="section-note">
        All reports posted by users, including their private WhatsApp numbers (visible to you
        only, for moderation and safety). Anyone can delete their own post from their account;
        use Delete here only to remove abusive or fake reports.
      </p>

      {loading ? (
        <p className="loading-note">{'\u2026'}</p>
      ) : posts.length === 0 ? (
        <p className="empty-note">No reports yet.</p>
      ) : (
        <div className="admin-table">
          {posts.map((p) => {
            const pType = postTypeInfo(p.post_type)
            const aType = animalTypeInfo(p.animal_type)
            return (
              <div className="admin-row" key={p.id}>
                <img className="row-thumb" src={p.image} alt="" />
                <div className="row-body">
                  <div className="row-tags">
                    <span className="row-tag" style={{ color: pType.color }}>
                      {pType.emoji} {pType.label}
                    </span>
                    <span className="row-tag">
                      {aType.emoji} {aType.label}
                    </span>
                  </div>
                  <h3>{p.title}</h3>
                  <p className="row-sub">
                    {'\uD83D\uDCAC'} {contacts[p.id] || '\u2014'}
                  </p>
                </div>
                <span className={`status-pill ${p.status === 'resolved' ? 'is-live' : 'is-draft'}`}>
                  {p.status === 'resolved' ? 'Resolved' : 'Active'}
                </span>
                <Link className="btn btn-ghost" to={`/admin/lost-and-found/${p.id}`}>
                  Edit
                </Link>
                <button className="btn btn-ghost danger" onClick={() => remove(p)}>
                  Delete
                </button>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .dash-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .dash-head h1 { font-size: 26px; }
        .section-note { color: var(--ink-soft); font-size: 13.5px; margin: 0 0 22px; max-width: 620px; }
        .empty-note { color: var(--ink-soft); padding: 40px 0; text-align: center; }
        .admin-table { display: flex; flex-direction: column; gap: 10px; }
        .admin-row {
          display: flex; align-items: center; gap: 16px;
          background: var(--paper); border: 1px solid var(--line); border-radius: 14px; padding: 12px 16px;
        }
        .row-thumb { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; flex-shrink: 0; background: var(--sage-pale); }
        .row-body { flex: 1; min-width: 0; }
        .row-tags { display: flex; gap: 8px; margin-bottom: 4px; }
        .row-tag { font-size: 11px; font-weight: 600; }
        .row-body h3 { font-size: 15px; margin: 0; }
        .row-sub { font-size: 13px; color: var(--ink-soft); margin: 2px 0 0; }
        .status-pill { font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 100px; flex-shrink: 0; }
        .status-pill.is-live { background: var(--sage-pale); color: var(--sage-dark); }
        .status-pill.is-draft { background: #F1E7D8; color: #8A6D2F; }
        .btn.danger { color: #B4432D; padding: 8px 14px; font-size: 13px; flex-shrink: 0; }
      `}</style>
    </div>
  )
}
