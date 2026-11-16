import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../services/api'
import { clearToken, getToken, setToken } from '../services/tokenStorage'
import type { AuthResponse, User } from '../types'
import { AuthContext } from './AuthContext'
import type { AuthContextValue } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Si hay un token guardado, hay que comprobarlo antes de decidir si hay sesión
  const [loading, setLoading] = useState(() => getToken() !== null)

  useEffect(() => {
    if (!getToken()) return
    api
      .me()
      .then(setUser)
      .catch(() => clearToken()) // token caducado o inválido
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const startSession = ({ token, user }: AuthResponse) => {
      setToken(token)
      setUser(user)
    }

    return {
      user,
      loading,
      login: async (email, password) => startSession(await api.login({ email, password })),
      register: async (name, email, password) =>
        startSession(await api.register({ name, email, password })),
      logout: async () => {
        // Aunque falle la llamada, la sesión local se cierra igualmente
        await api.logout().catch(() => undefined)
        clearToken()
        setUser(null)
      },
    }
  }, [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
