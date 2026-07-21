import { supabase, isSupabaseConfigured } from './supabaseClient.js'

// Public Supabase storage URLs look like:
// https://<project>.supabase.co/storage/v1/object/public/media/articles/<file>.jpg
// This pulls out the "articles/<file>.jpg" part so we can delete the actual
// file from the "media" bucket, not just the database row that pointed to it.
function extractStoragePath(url) {
  if (!url || typeof url !== 'string') return null
  const marker = '/storage/v1/object/public/media/'
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
}

// Deletes the underlying file in Storage for a given public URL, if it
// belongs to our "media" bucket. Safe to call with external/placeholder
// URLs (picsum.photos etc.) \u2014 those are simply ignored.
export async function deleteStorageFile(url) {
  if (!isSupabaseConfigured) return
  const path = extractStoragePath(url)
  if (!path) return
  await supabase.storage.from('media').remove([path])
}

// Deletes multiple files at once (skips anything not in our bucket).
export async function deleteStorageFiles(urls) {
  if (!isSupabaseConfigured) return
  const paths = (urls || []).map(extractStoragePath).filter(Boolean)
  if (!paths.length) return
  await supabase.storage.from('media').remove(paths)
}
