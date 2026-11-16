import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../../components/EmptyState/EmptyState'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'
import type { Order } from '../../types'
import { formatDate, money } from '../../utils/format'
import { statusLabel } from '../../utils/orderStatus'
import './Account.css'

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .myOrders()
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="container page">
      <header className="account__head">
        <span className="account__avatar" aria-hidden="true">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1>Hola, {user.name.split(' ')[0]}</h1>
          <p className="muted">{user.email}</p>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <h2 className="account__title">Mis pedidos</h2>

      {error && (
        <div className="notice notice--error" role="alert">
          {error}
        </div>
      )}

      {!orders && !error && <div className="skeleton" style={{ height: 180 }} />}

      {orders && orders.length === 0 && (
        <EmptyState emoji="📦" message="Todavía no has hecho ningún pedido.">
          <Link to="/#catalogo" className="btn">
            Empezar a comprar
          </Link>
        </EmptyState>
      )}

      {orders && orders.length > 0 && (
        <ul className="orders">
          {orders.map((order) => (
            <li key={order.id} className="panel order-card">
              <div className="order-card__head">
                <div>
                  <strong>Pedido #{order.id}</strong>
                  <p className="muted">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`status status--${order.status.toLowerCase()}`}>
                  {statusLabel(order.status)}
                </span>
              </div>

              <ul className="order-card__items">
                {order.items.map((line) => (
                  <li key={line.productId}>
                    <span aria-hidden="true">{line.emoji}</span> {line.name}
                    <small> × {line.quantity}</small>
                  </li>
                ))}
              </ul>

              <div className="order-card__foot">
                <strong>{money(order.total)}</strong>
                <Link to={`/pedido/${order.id}`} className="link-btn">
                  Ver detalle
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
