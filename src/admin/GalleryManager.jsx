import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { deleteStorageFile } from '../lib/storageUtils.js'
import { useGalleryPhotos } from '../hooks/useGalleryPhotos.js'

export default function GalleryManager() {
  const { photos, loading, refetch } = useGalleryPhotos()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setError('')

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `gallery/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadError) {
        setError(uploadError.message)
        continue
      }
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      await supabase.from('gallery_photos').insert({ image: data.publicUrl })
    }

    setUploading(false)
    e.target.value = ''
    refetch()
  }

  const remove = async (photo) => {
    if (!confirm('Delete this photo? This can\u2019t be undone.')) return
    await supabase.from('gallery_photos').delete().eq('id', photo.id)
    await deleteStorageFile(photo.image)
    refetch()
  }

  return (
    <div>
      <div className="dash-head">
        <h1>Gallery {'\uD83D\uDCF7'}</h1>
        <label className="btn btn-primary upload-label">
          {uploading ? 'Uploading\u2026' : '+ Upload New Photo(s)'}
          <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} hidden />
        </label>
      </div>
      <p className="section-note">
        Add as many photos as you like. They appear on the Gallery page automatically, newest
        first.
      </p>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p className="loading-note">{'\u2026'}</p>
      ) : photos.length === 0 ? (
        <p className="empty-note">No photos yet. Upload your first one.</p>
      ) : (
        <div className="gallery-grid">
          {photos.map((p) => (
            <div className="gallery-item" key={p.id}>
              <img src={p.image} alt="" />
              <button className="remove-btn" onClick={() => remove(p)} aria-label="Delete photo">
                {'\u2715'}
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{styles}</style>
    </div>
  )
}

const styles = `
  .dash-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .dash-head h1 { font-size: 26px; }
  .upload-label { cursor: pointer; }
  .section-note { color: var(--ink-soft); font-size: 13.5px; margin: 0 0 22px; }
  .empty-note { color: var(--ink-soft); padding: 40px 0; text-align: center; }
  .admin-error { color: #B4432D; font-size: 13.5px; margin-bottom: 14px; }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
  }
  .gallery-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--line);
  }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
  .remove-btn {
    position: absolute; top: 8px; right: 8px;
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(56, 51, 44, 0.65); color: white; border: none;
    font-size: 13px; cursor: pointer;
  }
  .remove-btn:hover { background: #B4432D; }
`
