import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import UserMenu from '../UserMenu/UserMenu'
import './Header.css'

export default function Header() {
  const { count, setOpen } = useCart()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')

  // Mantener el campo sincronizado con la URL (p. ej. al quitar filtros)
  useEffect(() => {
    setQuery(params.get('q') ?? '')
  }, [params])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const text = query.trim()
    navigate(text ? `/?q=${encodeURIComponent(text)}#catalogo` : '/#catalogo')
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" aria-label="Frescor, ir al inicio">
          <span className="logo__mark">🥬</span>
          Frescor
        </Link>

        <form className="search" onSubmit={handleSubmit} role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca leche, tomates, café…"
            aria-label="Buscar productos"
          />
          <button type="submit">Buscar</button>
        </form>

        <nav className="header__nav">
          <Link to="/?onSale=true#catalogo" className="header__link">
            Ofertas
          </Link>
          <UserMenu />
          <button
            className="cart-btn"
            onClick={() => setOpen(true)}
            aria-label={`Abrir cesta, ${count} productos`}
          >
            <CartIcon />
            <span>Cesta</span>
            {count > 0 && (
              <span className="cart-btn__badge" key={count}>
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  )
}
