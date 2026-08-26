import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
// Context
import { AuthContext } from '../../context/authContext'
// Config
import { ROUTES } from '../../config/routes'

export default function ProtectedRoute() {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  if (!user) return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />

  return <Outlet />
}
