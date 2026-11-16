const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

export const money = (amount: number): string => eur.format(amount)

const dateFormat = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeStyle: 'short' })

export const formatDate = (iso: string): string => dateFormat.format(new Date(iso))
