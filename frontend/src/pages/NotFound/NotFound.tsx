import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState/EmptyState'

export default function NotFound() {
  return (
    <div className="container page">
      <EmptyState emoji="🤷" message="Esta página no existe o se ha movido de estantería.">
        <Link to="/" className="btn">
          Volver al inicio
        </Link>
      </EmptyState>
    </div>
  )
}
