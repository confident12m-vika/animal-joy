import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import staticArticles from '../data/articles.js'

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

export function useArticle(id) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setNotFound(false)

      if (!isSupabaseConfigured) {
        const found = staticArticles.find((a) => a.id === id)
        if (!cancelled) {
          if (found) setArticle(found)
          else setNotFound(true)
          setLoading(false)
        }
        return
      }

      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .maybeSingle()

      if (!cancelled) {
        if (data) setArticle(normalize(data))
        else setNotFound(true)
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return { article, loading, notFound }
}
