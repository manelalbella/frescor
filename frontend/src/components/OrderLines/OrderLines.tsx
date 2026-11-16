import { money } from '../../utils/format'
import './OrderLines.css'

export interface OrderLineView {
  id: number
  emoji: string
  name: string
  quantity: number
  total: number
}

interface OrderLinesProps {
  lines: OrderLineView[]
  className?: string
}

/** Lista de productos de un pedido (resumen del checkout y confirmación). */
export default function OrderLines({ lines, className = '' }: OrderLinesProps) {
  return (
    <ul className={`order-lines ${className}`.trim()}>
      {lines.map((line) => (
        <li key={line.id}>
          <span aria-hidden="true">{line.emoji}</span>
          <span>
            {line.name} <small>× {line.quantity}</small>
          </span>
          <span>{money(line.total)}</span>
        </li>
      ))}
    </ul>
  )
}
