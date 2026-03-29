import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const DEMO = {
  name: 'Demo User',
  email: 'demo@lumina.dev',
  avatar: 'DU',
  plan: 'Pro',
  company: 'StartupBR',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('lumina_user')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })
  const [error, setError] = useState(null)

  const login = async ({ email, password }) => {
    setError(null)
    await new Promise(r => setTimeout(r, 700))
    // demo account
    if (email === 'demo@lumina.dev' && password !== 'Demo@1234') {
      setError('Senha incorreta para a conta demo. Use: Demo@1234')
      throw new Error('wrong_password')
    }
    const initials = email.split('@')[0].slice(0,2).toUpperCase()
    const u = {
      name: email === DEMO.email ? DEMO.name : email.split('@')[0],
      email,
      avatar: initials,
      plan: 'Pro',
      company: email === DEMO.email ? DEMO.company : '',
      loginAt: Date.now(),
    }
    localStorage.setItem('lumina_user', JSON.stringify(u))
    setUser(u)
  }

  const register = async ({ name, email }) => {
    setError(null)
    await new Promise(r => setTimeout(r, 900))
    const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
    const u = {
      name: name.trim(),
      email,
      avatar: initials,
      plan: 'Starter',
      company: '',
      createdAt: Date.now(),
    }
    localStorage.setItem('lumina_user', JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('lumina_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
