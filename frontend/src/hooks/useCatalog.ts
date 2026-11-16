import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { PageResponse, Product, ProductQuery } from '../types'

/** Carga el catálogo cada vez que cambian los filtros. */
export function useCatalog({ page, size, sort, onSale, categoryId, q }: ProductQuery) {
  const [data, setData] = useState<PageResponse<Product> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    api
      .products({ page, size, sort, onSale, categoryId, q })
      .then((result) => !cancelled && setData(result))
      .catch((err: Error) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [page, size, sort, onSale, categoryId, q])

  return { data, loading, error }
}
