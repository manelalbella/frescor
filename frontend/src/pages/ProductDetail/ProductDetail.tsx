import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import QuantityStepper from '../../components/QuantityStepper/QuantityStepper'
import { useCart } from '../../hooks/useCart'
import { api } from '../../services/api'
import type { Product } from '../../types'
import { money } from '../../utils/format'
import './ProductDetail.css'

const LOW_STOCK_LIMIT = 10

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { add } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!id) return
    setProduct(null)
    setError(null)
    setQuantity(1)
    api.product(id).then(setProduct).catch((err: Error) => setError(err.message))
  }, [id])

  if (error) {
    return (
      <div className="container page">
        <div className="notice notice--error">{error}</div>
        <Link to="/" className="btn">
          Volver a la tienda
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container page">
        <div className="skeleton" style={{ height: 360 }} />
      </div>
    )
  }

  const onSale = product.salePrice !== null
  const stockMessage =
    product.stock === 0
      ? 'Agotado'
      : product.stock > LOW_STOCK_LIMIT
        ? 'Disponible'
        : `Solo quedan ${product.stock} unidades`

  return (
    <div className="container page">
      <p className="crumbs">
        <Link to="/">Inicio</Link> /{' '}
        <Link to={`/?categoria=${product.category.id}#catalogo`}>{product.category.name}</Link> /{' '}
        {product.name}
      </p>

      <div className="detail">
        <div className="detail__media">
          <span aria-hidden="true">{product.emoji}</span>
        </div>

        <div className="detail__info">
          <h1>{product.name}</h1>
          <p className="muted">{product.unit}</p>
          <p className="detail__desc">{product.description}</p>

          <div className="shelf-tag shelf-tag--lg">
            <span className={`shelf-tag__price ${onSale ? 'is-sale' : ''}`}>
              {money(product.currentPrice)}
            </span>
            {onSale && <s className="shelf-tag__old">{money(product.price)}</s>}
          </div>

          <p className={product.stock > LOW_STOCK_LIMIT ? 'stock stock--ok' : 'stock stock--low'}>
            {stockMessage}
          </p>

          {product.stock > 0 && (
            <div className="detail__buy">
              <QuantityStepper
                value={quantity}
                max={product.stock}
                label={product.name}
                onChange={(next) => setQuantity(Math.max(1, next))}
              />
              <button className="btn btn--lg" onClick={() => add(product, quantity)}>
                Añadir · {money(product.currentPrice * quantity)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
