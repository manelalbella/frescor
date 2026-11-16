import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import FormField from '../../components/FormField/FormField'
import { useAuth } from '../../hooks/useAuth'
import { ApiError } from '../../services/api'
import './Auth.css'

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  // Página a la que volver después de iniciar sesión (p. ej. el checkout)
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={from} replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'No se ha podido iniciar sesión. Comprueba que el servidor está encendido.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container page auth">
      <aside className="auth__side">
        <h2>Tu compra, siempre a mano.</h2>
        <ul>
          <li>Guarda todos tus pedidos</li>
          <li>Datos de entrega en un clic</li>
          <li>Repite tu compra de siempre</li>
        </ul>
      </aside>

      <form className="panel auth__card" onSubmit={handleSubmit} noValidate>
        <h1>Iniciar sesión</h1>

        {from === '/checkout' && (
          <p className="notice">Inicia sesión para finalizar tu pedido. Tu cesta se mantiene.</p>
        )}

        <FormField
          name="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          name="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="notice notice--error" role="alert">
            {error}
          </div>
        )}

        <button className="btn btn--lg" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="auth__switch">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/registro" state={{ from }}>
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  )
}
