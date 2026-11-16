/** Tipos compartidos. Reflejan los DTOs del backend (Spring Boot). */

export interface Category {
  id: number
  name: string
  slug: string
  emoji: string
}

export interface Product {
  id: number
  name: string
  description: string
  unit: string
  price: number
  salePrice: number | null
  /** Precio que realmente se paga (oferta si existe). */
  currentPrice: number
  stock: number
  emoji: string
  category: Category
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ProductQuery {
  page: number
  size: number
  sort: string
  onSale: boolean
  categoryId?: string
  q?: string
}

export interface CartItem {
  id: number
  name: string
  emoji: string
  unit: string
  price: number
  stock: number
  quantity: number
}

export interface CustomerData {
  customerName: string
  customerEmail: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export interface CreateOrderRequest extends CustomerData {
  items: { productId: number; quantity: number }[]
}

export interface OrderLine {
  productId: number
  name: string
  emoji: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface Order {
  id: number
  status: string
  customerName: string
  customerEmail: string
  address: string
  city: string
  postalCode: string
  subtotal: number
  shipping: number
  total: number
  createdAt: string
  items: OrderLine[]
}

/** Cuenta de usuario. */
export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData extends LoginData {
  name: string
}
