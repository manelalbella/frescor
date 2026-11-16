import { useCart } from '../../hooks/useCart'
import './Toast.css'

export default function Toast() {
  const { toast } = useCart()

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
