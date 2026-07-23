import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    setProfile(data || null)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      if (data.session) await loadProfile(data.session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession) await loadProfile(newSession.user.id)
      else setProfile(null)
    })

    return () => listener.subscription.unsubscribe()
  }, [loadProfile])

  const signUpWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  // Confirms the 6-digit code the person got by email after signing up.
  const verifySignupCode = async (email, code) => {
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'signup' })
    return { error }
  }

  const resendSignupCode = async (email) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    return { error }
  }

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const markNotificationsSeen = async () => {
    if (!session) return
    const now = new Date().toISOString()
    await supabase.from('profiles').update({ last_seen_notification_at: now }).eq('id', session.user.id)
    setProfile((p) => (p ? { ...p, last_seen_notification_at: now } : p))
  }

  const value = {
    session,
    user: session?.user || null,
    profile,
    isAdmin: Boolean(profile?.is_admin),
    loading,
    signUpWithEmail,
    verifySignupCode,
    resendSignupCode,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    markNotificationsSeen,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
