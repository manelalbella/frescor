import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Category } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories([]))
  }, [])

  return categories
}
