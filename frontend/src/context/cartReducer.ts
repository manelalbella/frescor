import type { CartItem, Product } from '../types'

export const STORAGE_KEY = 'frescor.cart.v1'

export type CartAction =
  | { type: 'add'; product: Product; quantity: number }
  | { type: 'setQty'; id: number; quantity: number }
  | { type: 'remove'; id: number }
  | { type: 'clear' }

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      const { product, quantity } = action
      const existing = state.find((item) => item.id === product.id)
      const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, product.stock)

      if (existing) {
        return state.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQuantity } : item,
        )
      }
      return [
        ...state,
        {
          id: product.id,
          name: product.name,
          emoji: product.emoji,
          unit: product.unit,
          price: product.currentPrice,
          stock: product.stock,
          quantity: nextQuantity,
        },
      ]
    }

    case 'setQty':
      return state
        .map((item) =>
          item.id === action.id
            ? { ...item, quantity: Math.min(action.quantity, item.stock) }
            : item,
        )
        .filter((item) => item.quantity > 0)

    case 'remove':
      return state.filter((item) => item.id !== action.id)

    case 'clear':
      return []
  }
}

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}
