const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'En reparto',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

export const statusLabel = (status: string): string => STATUS_LABELS[status] ?? status
