import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { deleteStorageFile } from '../lib/storageUtils.js'

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [manualEdit, setManualEdit] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')

    const previousValue = value
    const ext = file.name.split('.').pop()
    const path = `articles/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('media').getPublicUrl(path)
    onChange(data.publicUrl)
    setManualEdit(false)
    setUploading(false)

    // Free up storage space: remove the photo we just replaced, if any.
    if (previousValue && previousValue !== data.publicUrl) {
      deleteStorageFile(previousValue)
    }
  }

  return (
    <div className="image-uploader">
      {value && (
        <div className="preview">
          <img src={value} alt="" />
        </div>
      )}

      <label className="upload-btn">
        {uploading ? 'Uploading\u2026' : value ? 'Replace photo' : 'Upload photo'}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} hidden />
      </label>

      {error && <p className="admin-error">{error}</p>}

      {/* The link below is filled in automatically after upload.
          It's locked to avoid accidentally clearing a working photo link;
          use "Edit link manually" only if you specifically want to paste
          a URL from elsewhere instead of uploading a file. */}
      {!manualEdit ? (
        value && (
          <button type="button" className="manual-toggle" onClick={() => setManualEdit(true)}>
            Edit link manually
          </button>
        )
      ) : (
        <div className="manual-field">
          <p className="hint">
            {'\u26A0\uFE0F Only change this if you mean to \u2014 clearing it removes the photo.'}
          </p>
          <input
            type="url"
            placeholder="https://..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
          <button type="button" className="manual-toggle" onClick={() => setManualEdit(false)}>
            Done
          </button>
        </div>
      )}
      {!value && !manualEdit && (
        <button type="button" className="manual-toggle" onClick={() => setManualEdit(true)}>
          Or paste an image URL instead
        </button>
      )}

      <style>{`
        .image-uploader { display: flex; flex-direction: column; gap: 10px; }
        .preview {
          width: 100%;
          max-width: 320px;
          aspect-ratio: 4/3;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--line);
        }
        .preview img { width: 100%; height: 100%; object-fit: cover; }
        .upload-btn {
          display: inline-flex;
          align-self: flex-start;
          padding: 10px 18px;
          border-radius: 100px;
          background: var(--sage-pale);
          color: var(--sage-dark);
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
        }
        .upload-btn:hover { background: var(--blush); color: var(--ink); }
        .manual-toggle {
          align-self: flex-start;
          background: none;
          border: none;
          padding: 0;
          font-size: 12.5px;
          color: var(--ink-soft);
          text-decoration: underline;
          cursor: pointer;
        }
        .manual-toggle:hover { color: var(--sage-dark); }
        .manual-field { display: flex; flex-direction: column; gap: 8px; }
        .hint { font-size: 12.5px; color: #8A6D2F; margin: 0; }
      `}</style>
    </div>
  )
}
