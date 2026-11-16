import { useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import EmptyState from '../../components/EmptyState/EmptyState'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useCatalog } from '../../hooks/useCatalog'
import { useCategories } from '../../hooks/useCategories'
import CategoryChips from './CategoryChips'
import Hero from './Hero'
import './Home.css'

const PAGE_SIZE = 12
const SKELETON_COUNT = 8

type ParamChanges = Record<string, string | number | boolean | undefined>

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'default', label: 'Destacados' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre (A–Z)' },
]

export default function Home() {
  const [params, setParams] = useSearchParams()
  const { hash } = useLocation()
  const catalogRef = useRef<HTMLElement>(null)

  // Filtros: viven en la URL para poder compartir y volver atrás
  const categoryId = params.get('categoria') ?? ''
  const q = params.get('q') ?? ''
  const onSale = params.get('onSale') === 'true'
  const sort = params.get('orden') ?? 'default'
  const page = Number(params.get('pagina') ?? 0)

  const categories = useCategories()
  const { data, loading, error } = useCatalog({
    page,
    size: PAGE_SIZE,
    sort,
    onSale,
    categoryId: categoryId || undefined,
    q: q || undefined,
  })

  // Al llegar con #catalogo, bajar suavemente a la lista
  useEffect(() => {
    if (hash === '#catalogo') {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash, params])

  /** Actualiza la URL; cualquier cambio de filtro vuelve a la primera página. */
  const updateParams = (changes: ParamChanges) => {
    const next = new URLSearchParams(params)
    Object.entries({ pagina: undefined, ...changes }).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === false || value === 'default') {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })
    setParams(next)
  }

  const isFiltering = Boolean(categoryId || q || onSale)
  const activeCategory = categories.find((c) => String(c.id) === categoryId)
  const title = q
    ? `Resultados para «${q}»`
    : onSale
      ? 'Ofertas de la semana'
      : (activeCategory?.name ?? 'Todos los productos')

  return (
    <>
      {!isFiltering && <Hero />}

      <section className="container catalog" id="catalogo" ref={catalogRef}>
        <CategoryChips
          categories={categories}
          selectedCategoryId={categoryId}
          onSale={onSale}
          onSelectAll={() => updateParams({ categoria: '', onSale: false })}
          onSelectSale={() => updateParams({ onSale: !onSale, categoria: '' })}
          onSelectCategory={(id) => updateParams({ categoria: id, onSale: false })}
        />

        <div className="catalog__bar">
          <h2>
            {title}
            {data && <small> · {data.totalElements} productos</small>}
          </h2>
          <label className="select">
            <span>Ordenar por</span>
            <select value={sort} onChange={(e) => updateParams({ orden: e.target.value })}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <div className="notice notice--error" role="alert">
            No hemos podido cargar los productos. {error} Comprueba que el backend está arrancado
            en el puerto 8080.
          </div>
        )}

        {loading && !data ? (
          <div className="grid">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <div key={i} className="card skeleton" />
            ))}
          </div>
        ) : data && data.content.length === 0 ? (
          <EmptyState
            emoji="🔎"
            message="No hay productos que coincidan. Prueba con otra palabra o quita los filtros."
          >
            <button className="btn" onClick={() => setParams({})}>
              Quitar filtros
            </button>
          </EmptyState>
        ) : (
          <div className={`grid ${loading ? 'is-loading' : ''}`}>
            {data?.content.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <nav className="pager" aria-label="Paginación">
            <button
              className="btn btn--ghost"
              disabled={page === 0}
              onClick={() => updateParams({ pagina: page - 1 })}
            >
              Anterior
            </button>
            <span>
              Página {page + 1} de {data.totalPages}
            </span>
            <button
              className="btn btn--ghost"
              disabled={page + 1 >= data.totalPages}
              onClick={() => updateParams({ pagina: page + 1 })}
            >
              Siguiente
            </button>
          </nav>
        )}
      </section>
    </>
  )
}
