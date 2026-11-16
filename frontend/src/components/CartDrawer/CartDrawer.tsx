import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { money } from '../../utils/format'
import { FREE_SHIPPING_FROM } from '../../utils/shipping'
import EmptyState from '../EmptyState/EmptyState'
import OrderTotals from '../OrderTotals/OrderTotals'
import QuantityStepper from '../QuantityStepper/QuantityStepper'
import './CartDrawer.css'

export default function CartDrawer() {
  const { open, setOpen, items, subtotal, shipping, total, setQty, remove, clear } = useCart()

  // Cerrar con Escape y bloquear el scroll de la página mientras está abierto
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, setOpen])

  const missing = Math.max(FREE_SHIPPING_FROM - subtotal, 0)
  const progress = Math.min((subtotal / FREE_SHIPPING_FROM) * 100, 100)
  const close = () => setOpen(false)

  return (
    <>
      <div className={`overlay ${open ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />

      <aside
        className={`drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Tu cesta"
        aria-hidden={!open}
      >
        <div className="drawer__head">
          <h2>Tu cesta</h2>
          <button className="icon-btn" onClick={close} aria-label="Cerrar cesta">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState
            emoji="🛒"
            message="Tu cesta está vacía. Añade productos del catálogo para empezar."
          >
            <Link to="/#catalogo" className="btn" onClick={close}>
              Ver productos
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className="shipping-meter">
              <p>
                {missing > 0 ? (
                  <>
                    Te faltan <strong>{money(missing)}</strong> para el envío gratis
                  </>
                ) : (
                  <strong>¡Envío gratis conseguido!</strong>
                )}
              </p>
              <div className="meter">
                <div style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="drawer__list">
              {items.map((item) => (
                <li key={item.id} className="line">
                  <span className="line__emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <div className="line__info">
                    <strong>{item.name}</strong>
                    <small>
                      {item.unit} · {money(item.price)}
                    </small>
                    <QuantityStepper
                      value={item.quantity}
                      max={item.stock}
                      label={item.name}
                      onChange={(quantity) => setQty(item.id, quantity)}
                    />
                  </div>
                  <div className="line__side">
                    <strong>{money(item.price * item.quantity)}</strong>
                    <button className="link-btn" onClick={() => remove(item.id)}>
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer__foot">
              <OrderTotals subtotal={subtotal} shipping={shipping} total={total} />
              <Link to="/checkout" className="btn btn--lg" onClick={close}>
                Tramitar pedido
              </Link>
              <button className="link-btn" onClick={clear}>
                Vaciar cesta
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
