import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

// Fetches the editable content for a fixed-structure page (Home, Urban Soul Vibe):
// one image, one title, one body text. Falls back to `fallback` (the original
// bundled copy) if Supabase isn't configured yet or no row has been saved.
export function useSiteBlock(key, fallback) {
  const [block, setBlock] = useState(fallback)
  const [isCustomized, setIsCustomized] = useState(false)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const refetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setBlock(fallback)
      setIsCustomized(false)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase.from('site_blocks').select('*').eq('key', key).maybeSingle()
    if (data) {
      setBlock({
        image: data.image || fallback.image,
        title: data.title || fallback.title,
        body: data.body || fallback.body,
      })
      setIsCustomized(true)
    } else {
      setBlock(fallback)
      setIsCustomized(false)
    }
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { block, isCustomized, loading, refetch }
}
