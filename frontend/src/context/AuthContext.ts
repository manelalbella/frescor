import { createContext } from 'react'
import type { User } from '../types'

export interface AuthContextValue {
  /** Usuario con sesión iniciada, o null. */
  user: User | null
  /** true mientras se comprueba si el token guardado sigue siendo válido. */
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
