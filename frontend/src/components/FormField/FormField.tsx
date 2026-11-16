import type { ChangeEvent, InputHTMLAttributes } from 'react'
import './FormField.css'

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange'> {
  name: string
  label: string
  value: string
  error?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FormField({
  name,
  label,
  value,
  error,
  onChange,
  className = '',
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={name}>{label}</label>
      <input
        {...inputProps}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p className="field__error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
