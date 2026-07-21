import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const fallbackPhotos = Array.from({ length: 9 }, (_, i) => ({
  id: `fallback-${i}`,
  image: `https://picsum.photos/seed/animaljoy-gallery-${i}/600/${i % 3 === 0 ? 760 : i % 3 === 1 ? 600 : 500}`,
}))

export function useGalleryPhotos() {
  const [photos, setPhotos] = useState(isSupabaseConfigured ? [] : fallbackPhotos)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const refetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setPhotos(fallbackPhotos)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false })
    setPhotos(data && data.length ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { photos, loading, refetch }
}
