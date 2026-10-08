import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        try {
          const res = await api.get('/api/v1/auth/me')
          if (res.data && res.data.user) {
            setUser(res.data.user)
            localStorage.setItem('auth_user', JSON.stringify(res.data.user))
          }
        } catch (err) {
          console.warn('Session verification failed, using cached user if available')
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/api/v1/auth/login', {
      email,
      username: email,
      password,
    })

    const { access_token, user: loggedUser } = response.data
    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('auth_user', JSON.stringify(loggedUser))
    setToken(access_token)
    setUser(loggedUser)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      loading,
      isAuthenticated: Boolean(token),
    }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
