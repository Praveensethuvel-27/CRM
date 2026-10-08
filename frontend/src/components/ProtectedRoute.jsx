import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const auth = useAuth()
  if (auth.loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}
