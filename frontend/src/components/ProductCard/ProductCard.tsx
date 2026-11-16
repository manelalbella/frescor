import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import type { Product } from '../../types'
import { money } from '../../utils/format'
import QuantityStepper from '../QuantityStepper/QuantityStepper'
import './ProductCard.css'

/** Color de fondo de la imagen según la categoría. */
const CATEGORY_TINTS: Record<string, string> = {
  'frutas-verduras': '#DDEFD5',
  'carnes-pescados': '#F8DCD6',
  'lacteos-huevos': '#E3ECF5',
  panaderia: '#F6E7C8',
  despensa: '#EFE6D6',
  bebidas: '#D9EEF0',
  'hogar-limpieza': '#E6E1F2',
}
const DEFAULT_TINT = '#EEF2EC'
const LOW_STOCK_LIMIT = 10

export default function ProductCard({ product }: { product: Product }) {
  const { items, add, setQty } = useCart()
  const inCart = items.find((item) => item.id === product.id)

  const onSale = product.salePrice !== null
  const soldOut = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= LOW_STOCK_LIMIT
  const discount = onSale ? Math.round((1 - product.currentPrice / product.price) * 100) : 0

  return (
    <article className="card">
      <Link
        to={`/producto/${product.id}`}
        className="card__media"
        style={{ background: CATEGORY_TINTS[product.category.slug] ?? DEFAULT_TINT }}
      >
        <span className="card__emoji" aria-hidden="true">
          {product.emoji}
        </span>
        {onSale && <span className="badge badge--sale">−{discount}%</span>}
        {lowStock && <span className="badge badge--low">Últimas unidades</span>}
      </Link>

      <div className="card__body">
        <Link to={`/producto/${product.id}`} className="card__title">
          {product.name}
        </Link>
        <p className="card__unit">{product.unit}</p>

        {/* Etiqueta de estantería: el precio manda */}
        <div className="shelf-tag">
          <span className={`shelf-tag__price ${onSale ? 'is-sale' : ''}`}>
            {money(product.currentPrice)}
          </span>
          {onSale && <s className="shelf-tag__old">{money(product.price)}</s>}
        </div>

        {soldOut ? (
          <button className="btn btn--ghost" disabled>
            Agotado
          </button>
        ) : inCart ? (
          <QuantityStepper
            value={inCart.quantity}
            max={product.stock}
            label={product.name}
            onChange={(quantity) => setQty(product.id, quantity)}
          />
        ) : (
          <button className="btn" onClick={() => add(product)}>
            Añadir
          </button>
        )}
      </div>
    </article>
  )
}
