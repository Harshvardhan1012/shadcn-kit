import { AppRoutes } from '@/routes/routeUtils'
import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  showIf?: boolean | (() => boolean) | undefined
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  showIf = true,
}) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext)
  const location = useLocation()

  if (loading) {
    return <Loader2 />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={AppRoutes.LOGIN}
        state={{ from: location }}
        replace
      />
    )
  }

  const showIfResult = typeof showIf === 'function' ? showIf() : showIf
  if (!showIfResult || !user) {
    return (
      <Navigate
        to={AppRoutes.UNAUTHORIZED}
        replace
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
