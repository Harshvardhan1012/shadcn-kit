import { AuthContext, AuthProvider } from '@/context/AuthContext'
import { AppRoutes } from '@/routes/routeUtils'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as useLoginApi } from './api'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login: setUser, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const loginMutation = useLoginApi()

  useEffect(() => {
    if (user) {
      navigate(AppRoutes.CUSTOM_TABLE, { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    await setUser({ username, password })
    // loginMutation.mutate(
    //   { username, password },
    //   {
    //     onSuccess: (data: any) => {
    //       // You may need to adjust this based on your API response structure
    //       if (data && data.user) {
    //         localStorage.setItem('authToken', data.token)
    //         setUser(data.user)
    //       } else {
    //         setError('Invalid response from server')
    //       }
    //     },
    //     onError: (err: any) => {
    //       setError(err?.message || 'Login failed')
    //     },
    //   },
    // )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 320,
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loginMutation.isPending}>
        Login
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loginMutation.isPending && <div>Logging in...</div>}
    </form>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
