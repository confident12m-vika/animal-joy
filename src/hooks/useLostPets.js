import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export function useLostPets({ animalType, postType } = {}) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('lost_pets').select('*').order('created_at', { ascending: false })
    if (animalType) query = query.eq('animal_type', animalType)
    if (postType) query = query.eq('post_type', postType)
    const { data } = await query
    setPosts(data || [])
    setLoading(false)
  }, [animalType, postType])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { posts, loading, refetch }
}
