import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import FormField from '../../components/FormField/FormField'
import { useAuth } from '../../hooks/useAuth'
import { ApiError } from '../../services/api'
import './Auth.css'

const MIN_PASSWORD_LENGTH = 8

export default function Register() {
  const { user, register } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={from} replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    // Validación rápida en el navegador; el servidor valida de nuevo
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrors({ password: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` })
      return
    }
    if (password !== confirm) {
      setErrors({ confirm: 'Las contraseñas no coinciden' })
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      await register(name, email, password)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields ?? {})
        setSubmitError(err.message)
      } else {
        setSubmitError('No se ha podido crear la cuenta. Comprueba que el servidor está encendido.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container page auth">
      <aside className="auth__side">
        <h2>Crea tu cuenta en un minuto.</h2>
        <ul>
          <li>Historial de todos tus pedidos</li>
          <li>Compra más rápido en cada visita</li>
          <li>Tus datos, siempre protegidos</li>
        </ul>
      </aside>

      <form className="panel auth__card" onSubmit={handleSubmit} noValidate>
        <h1>Crear cuenta</h1>

        <FormField
          name="name"
          label="Nombre"
          autoComplete="name"
          value={name}
          error={errors.name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormField
          name="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          name="password"
          label="Contraseña (mínimo 8 caracteres)"
          type="password"
          autoComplete="new-password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormField
          name="confirm"
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          value={confirm}
          error={errors.confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {submitError && !errors.email && (
          <div className="notice notice--error" role="alert">
            {submitError}
          </div>
        )}

        <button className="btn btn--lg" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="auth__switch">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" state={{ from }}>
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  )
}
