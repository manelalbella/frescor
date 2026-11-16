import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './UserMenu.css'

export default function UserMenu() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar el menú al hacer clic fuera o pulsar Escape
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (loading) return null

  if (!user) {
    return (
      <Link to="/login" className="user-login">
        Entrar
      </Link>
    )
  }

  const firstName = user.name.split(' ')[0]

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu__trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="user-menu__avatar" aria-hidden="true">
          {firstName.charAt(0).toUpperCase()}
        </span>
        <span className="user-menu__name">{firstName}</span>
      </button>

      {open && (
        <div className="user-menu__panel" role="menu">
          <p className="user-menu__email">{user.email}</p>
          <Link to="/cuenta" role="menuitem" onClick={() => setOpen(false)}>
            Mis pedidos
          </Link>
          <button role="menuitem" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
