import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from './AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  showIf?: boolean | (() => boolean) | undefined
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  showIf = true,
}) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext)
  console.log(user, isAuthenticated, loading)
  const location = useLocation()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    debugger
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  const showIfResult = typeof showIf === 'function' ? showIf() : showIf
  if (!showIfResult || !user) {
    debugger
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
