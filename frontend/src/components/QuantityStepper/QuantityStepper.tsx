import './QuantityStepper.css'

interface QuantityStepperProps {
  value: number
  max: number
  /** Nombre del producto, para lectores de pantalla. */
  label: string
  onChange: (quantity: number) => void
}

export default function QuantityStepper({ value, max, label, onChange }: QuantityStepperProps) {
  return (
    <div className="stepper" role="group" aria-label={`Cantidad de ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Quitar uno">
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Añadir uno"
      >
        +
      </button>
    </div>
  )
}
