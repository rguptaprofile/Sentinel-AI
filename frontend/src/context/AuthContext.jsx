import { createContext, useContext, useEffect, useState } from 'react'

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

  const login = (role, email, name) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: name || email.split('@')[0].replace('.', ' '),
      email,
      role,
    }
    setUser(newUser)
    return ROLE_ROUTES[role]
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
