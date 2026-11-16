import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import OrderLines from '../../components/OrderLines/OrderLines'
import OrderTotals from '../../components/OrderTotals/OrderTotals'
import { api } from '../../services/api'
import type { Order } from '../../types'
import './OrderConfirmation.css'

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>()
  // Al venir del checkout el pedido llega en el estado de navegación
  const location = useLocation()
  const initialOrder = (location.state as { order?: Order } | null)?.order ?? null

  const [order, setOrder] = useState<Order | null>(initialOrder)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (order || !id) return
    api.order(id).then(setOrder).catch((err: Error) => setError(err.message))
  }, [id, order])

  if (error) {
    return (
      <div className="container page">
        <div className="notice notice--error">{error}</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container page">
        <div className="skeleton" style={{ height: 300 }} />
      </div>
    )
  }

  const firstName = order.customerName.split(' ')[0]

  return (
    <div className="container page">
      <div className="confirm panel">
        <span className="confirm__check" aria-hidden="true">
          ✓
        </span>
        <h1>¡Pedido confirmado!</h1>
        <p>
          Gracias, {firstName}. Hemos guardado tu pedido <strong>#{order.id}</strong> y lo
          llevaremos a {order.address}, {order.city}.
        </p>

        <OrderLines
          className="confirm__items"
          lines={order.items.map((line) => ({
            id: line.productId,
            emoji: line.emoji,
            name: line.name,
            quantity: line.quantity,
            total: line.lineTotal,
          }))}
        />
        <OrderTotals
          subtotal={order.subtotal}
          shipping={order.shipping}
          total={order.total}
          totalLabel="Total a pagar al recibir"
        />

        <Link to="/" className="btn btn--lg">
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
