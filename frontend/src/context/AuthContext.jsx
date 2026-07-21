import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const ROLE_ROUTES = {
  citizen: '/dashboard/citizen',
  police: '/dashboard/police',
  bank: '/dashboard/bank',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sentinelai_user')
    return stored ? JSON.parse(stored) : null
  })
  const [ready] = useState(true)

  useEffect(() => {
    if (user) {
      localStorage.setItem('sentinelai_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('sentinelai_user')
    }
  }, [user])

  const login = async (role, email) => {
    setUser({ name: email.split('@')[0] || 'Sentinel user', email, role })
    return ROLE_ROUTES[role]
  }

  const signup = async (role, name, email, password) => {
    setUser({ name, email, role })
    return ROLE_ROUTES[role]
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, ready }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
