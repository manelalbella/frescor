import type {
  AuthResponse,
  Category,
  CreateOrderRequest,
  LoginData,
  Order,
  PageResponse,
  Product,
  ProductQuery,
  RegisterData,
  User,
} from '../types'
import { getToken } from './tokenStorage'

// En desarrollo usa el proxy de Vite; en producción define VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL ?? ''

/** Error devuelto por el backend, con los errores por campo si los hay. */
export class ApiError extends Error {
  status: number
  fields?: Record<string, string>

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}/api${path}`, { ...options, headers })
  const data: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    const body = (data ?? {}) as { message?: string; fields?: Record<string, string> }
    throw new ApiError(
      body.message ?? 'Algo ha salido mal. Inténtalo de nuevo.',
      res.status,
      body.fields,
    )
  }
  return data as T
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) })

export const api = {
  // --- catálogo (público) ---
  categories: () => request<Category[]>('/categories'),

  products: (query: ProductQuery) => {
    const params = new URLSearchParams({
      page: String(query.page),
      size: String(query.size),
      sort: query.sort,
      onSale: String(query.onSale),
    })
    if (query.categoryId) params.set('categoryId', query.categoryId)
    if (query.q) params.set('q', query.q)
    return request<PageResponse<Product>>(`/products?${params}`)
  },

  product: (id: string | number) => request<Product>(`/products/${id}`),

  // --- cuenta ---
  register: (data: RegisterData) => post<AuthResponse>('/auth/register', data),
  login: (data: LoginData) => post<AuthResponse>('/auth/login', data),
  logout: () => post<void>('/auth/logout'),
  me: () => request<User>('/auth/me'),

  // --- pedidos (requieren sesión) ---
  createOrder: (order: CreateOrderRequest) => post<Order>('/orders', order),
  myOrders: () => request<Order[]>('/orders'),
  order: (id: string | number) => request<Order>(`/orders/${id}`),
}
