import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../../components/EmptyState/EmptyState'
import FormField from '../../components/FormField/FormField'
import OrderLines from '../../components/OrderLines/OrderLines'
import OrderTotals from '../../components/OrderTotals/OrderTotals'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { ApiError, api } from '../../services/api'
import type { CustomerData } from '../../types'
import { money } from '../../utils/format'
import './Checkout.css'

const EMPTY_FORM: CustomerData = {
  customerName: '',
  customerEmail: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
}

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<CustomerData>(() => ({
    ...EMPTY_FORM,
    customerName: user?.name ?? '',
    customerEmail: user?.email ?? '',
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState
          emoji="🛒"
          message="No tienes productos en la cesta. Añade algunos para tramitar tu pedido."
        >
          <Link to="/#catalogo" className="btn">
            Ir a la tienda
          </Link>
        </EmptyState>
      </div>
    )
  }

  const handleChange = (field: keyof CustomerData) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    setSubmitError(null)

    try {
      const order = await api.createOrder({
        ...form,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      })
      clear()
      navigate(`/pedido/${order.id}`, { state: { order } })
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields ?? {})
        setSubmitError(err.message)
      } else {
        setSubmitError('No se ha podido enviar el pedido. Inténtalo de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  /** Props comunes de cada campo del formulario. */
  const field = (name: keyof CustomerData) => ({
    name,
    value: form[name],
    error: errors[name],
    onChange: handleChange(name),
    required: true,
  })

  return (
    <div className="container page">
      <h1 className="page__title">Finalizar pedido</h1>

      <div className="checkout">
        <form onSubmit={handleSubmit} className="panel" noValidate>
          <h2>Datos de entrega</h2>
          <div className="form-grid">
            <FormField {...field('customerName')} label="Nombre y apellidos" autoComplete="name" className="span-2" />
            <FormField {...field('customerEmail')} label="Correo electrónico" type="email" autoComplete="email" />
            <FormField {...field('phone')} label="Teléfono" type="tel" autoComplete="tel" />
            <FormField {...field('address')} label="Dirección" autoComplete="street-address" className="span-2" />
            <FormField {...field('city')} label="Ciudad" autoComplete="address-level2" />
            <FormField {...field('postalCode')} label="Código postal" autoComplete="postal-code" inputMode="numeric" />
          </div>

          <h2>Pago</h2>
          <p className="notice">
            Este es un proyecto de demostración: el pago se simula y no se pide ninguna tarjeta.
            Pagarás al recibir el pedido.
          </p>

          {submitError && (
            <div className="notice notice--error" role="alert">
              {submitError}
            </div>
          )}
          <button className="btn btn--lg" disabled={submitting}>
            {submitting ? 'Enviando pedido…' : `Confirmar pedido · ${money(total)}`}
          </button>
        </form>

        <aside className="panel checkout__summary" aria-label="Resumen del pedido">
          <h2>Resumen</h2>
          <OrderLines
            lines={items.map((item) => ({
              id: item.id,
              emoji: item.emoji,
              name: item.name,
              quantity: item.quantity,
              total: item.price * item.quantity,
            }))}
          />
          <OrderTotals subtotal={subtotal} shipping={shipping} total={total} />
        </aside>
      </div>
    </div>
  )
}
