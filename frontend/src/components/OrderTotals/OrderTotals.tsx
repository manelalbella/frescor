import { money } from '../../utils/format'
import './OrderTotals.css'

interface OrderTotalsProps {
  subtotal: number
  shipping: number
  total: number
  totalLabel?: string
}

export default function OrderTotals({ subtotal, shipping, total, totalLabel = 'Total' }: OrderTotalsProps) {
  return (
    <dl className="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{money(subtotal)}</dd>
      </div>
      <div>
        <dt>Envío</dt>
        <dd>{shipping === 0 ? 'Gratis' : money(shipping)}</dd>
      </div>
      <div className="totals__total">
        <dt>{totalLabel}</dt>
        <dd>{money(total)}</dd>
      </div>
    </dl>
  )
}
