import type { ReactNode } from 'react'
import './EmptyState.css'

interface EmptyStateProps {
  emoji: string
  message: string
  /** Normalmente un botón o enlace de acción. */
  children?: ReactNode
}

export default function EmptyState({ emoji, message, children }: EmptyStateProps) {
  return (
    <div className="empty">
      <span className="empty__emoji">{emoji}</span>
      <p>{message}</p>
      {children}
    </div>
  )
}
