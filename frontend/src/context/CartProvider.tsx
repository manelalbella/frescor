import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types'
import { shippingFor } from '../utils/shipping'
import { CartContext } from './CartContext'
import type { CartContextValue } from './CartContext'
import { STORAGE_KEY, cartReducer, loadCart } from './cartReducer'

const TOAST_DURATION_MS = 2200

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Persistir la cesta en el navegador
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Ocultar el toast automáticamente
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast])

  const add = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: 'add', product, quantity })
    setToast(`${product.name} añadido a tu cesta`)
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = shippingFor(subtotal)

    return {
      items,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      add,
      setQty: (id, quantity) => dispatch({ type: 'setQty', id, quantity }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
      open,
      setOpen,
      toast,
    }
  }, [items, open, toast, add])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
