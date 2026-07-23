import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

const EMPTY_COUNTS = { love: 0, like: 0, laugh: 0, sad: 0 }

export function useArticleReactions(articleId) {
  const { session } = useAuth()
  const [counts, setCounts] = useState(EMPTY_COUNTS)
  const [myReaction, setMyReaction] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data: countRows } = await supabase
      .from('article_reaction_counts')
      .select('*')
      .eq('article_id', articleId)

    const next = { ...EMPTY_COUNTS }
    ;(countRows || []).forEach((r) => {
      next[r.reaction] = r.count
    })
    setCounts(next)

    if (session) {
      const { data } = await supabase
        .from('article_reactions')
        .select('reaction')
        .eq('article_id', articleId)
        .eq('user_id', session.user.id)
        .maybeSingle()
      setMyReaction(data?.reaction || null)
    } else {
      setMyReaction(null)
    }
    setLoading(false)
  }, [articleId, session])

  useEffect(() => {
    load()
  }, [load])

  // Returns true if the reaction was applied/changed, false if the caller
  // needs to prompt sign-in first (no session).
  const react = async (reaction) => {
    if (!session) return false

    if (myReaction === reaction) {
      await supabase
        .from('article_reactions')
        .delete()
        .eq('article_id', articleId)
        .eq('user_id', session.user.id)
    } else {
      await supabase
        .from('article_reactions')
        .upsert(
          { article_id: articleId, user_id: session.user.id, reaction },
          { onConflict: 'article_id,user_id' }
        )
    }
    await load()
    return true
  }

  return { counts, myReaction, loading, react }
}
