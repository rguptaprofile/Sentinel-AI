import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/services/api'

const AuthContext = createContext(null)

const ROLE_ROUTES = {
  citizen: '/dashboard/citizen',
  police: '/dashboard/police',
  bank: '/dashboard/bank',
  admin: '/dashboard/admin',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sentinelai_user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('sentinelai_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('sentinelai_user')
    }
  }, [user])

  const login = async (role, email, password) => {
    const result = await api.signIn({ role, email, password })
    setUser(result.user)
    return ROLE_ROUTES[result.user.role]
  }

  const signup = async (role, name, email, password) => {
    const result = await api.signUp({ role, name, email, password })
    setUser(result.user)
    return ROLE_ROUTES[result.user.role]
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
