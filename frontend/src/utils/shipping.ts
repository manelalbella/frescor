// Deben coincidir con app.shipping.* del backend (el servidor siempre recalcula).
export const FREE_SHIPPING_FROM = 50
export const SHIPPING_COST = 4.9

export const shippingFor = (subtotal: number): number =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
