import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  url && key && !url.includes('your-project-ref') && !key.includes('your-anon-public-key')
)

// If .env isn't set up yet, `supabase` is null and the app falls back to the
// bundled sample data in src/data/ so the site still works out of the box.
export const supabase = isSupabaseConfigured ? createClient(url, key) : null
