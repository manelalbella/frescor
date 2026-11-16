import { createContext } from 'react'
import type { CartItem, Product } from '../types'

export interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  shipping: number
  total: number
  add: (product: Product, quantity?: number) => void
  setQty: (id: number, quantity: number) => void
  remove: (id: number) => void
  clear: () => void
  /** Estado del panel lateral de la cesta. */
  open: boolean
  setOpen: (open: boolean) => void
  /** Mensaje temporal (toast) o null. */
  toast: string | null
}

export const CartContext = createContext<CartContextValue | null>(null)
