import { AppRoutes } from '@/routes/routeUtils'
import axios from 'axios'
import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: any) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: true,
  loading: false,
  login: async () => {},
  logout: () => {},
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated on app start
    const checkAuth = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          // Verify token and get user data
          const userData = await verifyToken(token)
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('authToken')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: any) => {
    try {
      // Your login API call
      const response = await axios.post(
        process.env.SSO_URL as string,
        credentials
      )

      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.token)
        setUser(response.data.user)
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    navigate(AppRoutes.LOGIN)
    setUser(null)
  }

  const verifyToken = async (token: string): Promise<User> => {
    // Your token verification logic
    const response = await fetch('/api/verify', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      throw new Error('Token verification failed')
    }

    return response.json()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
