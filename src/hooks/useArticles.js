import { useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import staticArticles from '../data/articles.js'

// Normalizes a Supabase row (snake_case) to the shape the UI already expects
// (the same shape as the bundled sample data in src/data/articles.js).
function normalize(row) {
  return {
    id: row.id,
    category: row.category,
    image: row.image,
    readMinutes: row.read_minutes,
    reactions: row.reactions,
    published: row.published,
    link: row.link || '',
    translations: row.translations,
  }
}

// `onlyPublished`: public-facing pages pass true (default).
// The admin dashboard passes false to see drafts too.
export function useArticles({ onlyPublished = true } = {}) {
  const [articles, setArticles] = useState(isSupabaseConfigured ? [] : staticArticles)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setArticles(staticArticles)
      setLoading(false)
      return
    }
    setLoading(true)
    let query = supabase.from('articles').select('*').order('created_at', { ascending: false })
    if (onlyPublished) query = query.eq('published', true)
    const { data, error: err } = await query
    if (err) {
      setError(err)
    } else {
      setArticles((data || []).map(normalize))
      setError(null)
    }
    setLoading(false)
  }, [onlyPublished])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { articles, loading, error, refetch }
}
