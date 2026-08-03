import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi, type LoginParams, type RegisterParams } from '../api/auth'

interface User {
  username: string
  email: string
  full_name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (params: LoginParams) => Promise<void>
  register: (data: RegisterParams) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const login = async (params: LoginParams) => {
    const data = await authApi.login(params)
    setToken(data.access_token)
    setUser({ username: params.username, email: '', full_name: '' })
  }

  const register = async (data: RegisterParams) => {
    const userData = await authApi.register(data)
    return userData
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
