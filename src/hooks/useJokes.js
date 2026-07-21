import { useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import staticJokes from '../data/jokes.js'

function normalize(row) {
  return {
    id: row.id,
    published: row.published,
    translations: row.translations,
  }
}

export function useJokes({ onlyPublished = true } = {}) {
  const [jokes, setJokes] = useState(isSupabaseConfigured ? [] : staticJokes)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setJokes(staticJokes)
      setLoading(false)
      return
    }
    setLoading(true)
    let query = supabase.from('jokes').select('*').order('created_at', { ascending: false })
    if (onlyPublished) query = query.eq('published', true)
    const { data, error: err } = await query
    if (err) {
      setError(err)
    } else {
      setJokes((data || []).map(normalize))
      setError(null)
    }
    setLoading(false)
  }, [onlyPublished])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { jokes, loading, error, refetch }
}
