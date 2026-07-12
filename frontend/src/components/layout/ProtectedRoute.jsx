import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function ProtectedRoute() {
  const { isAuthenticated, ready } = useAuth()
  if (!ready) return <LoadingSpinner className="min-h-screen" />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
