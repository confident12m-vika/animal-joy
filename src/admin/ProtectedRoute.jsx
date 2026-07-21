import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'

export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading } = useAuth()

  if (!isSupabaseConfigured) {
    return <Navigate to="/admin/login" replace />
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--ink-soft)' }}>{'\u2026'}</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 600 }}>{'\uD83D\uDD12 This account isn\u2019t an admin.'}</p>
        <p style={{ color: 'var(--ink-soft)', maxWidth: 380 }}>
          {'You\u2019re signed in, but this account doesn\u2019t have admin access to Animal Joy.'}
        </p>
      </div>
    )
  }

  return children
}
