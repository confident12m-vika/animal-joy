import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  url && key && !url.includes('your-project-ref') && !key.includes('your-anon-public-key')
)

// If .env isn't set up yet, `supabase` is null and the app falls back to the
// bundled sample data in src/data/ so the site still works out of the box.
export const supabase = isSupabaseConfigured ? createClient(url, key) : null

// Fires a tiny, fire-and-forget request to wake up the database connection
// as early as possible. Doesn't block anything and ignores the result —
// its only job is to shave time off the very first real query on a cold
// project. Safe to call multiple times; safe to ignore failures.
export function warmUpConnection() {
  if (!supabase) return
  supabase.from('articles').select('id', { head: true, count: 'exact' }).limit(1).then(
    () => {},
    () => {}
  )
}
