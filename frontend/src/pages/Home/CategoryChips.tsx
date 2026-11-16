import type { Category } from '../../types'
import './CategoryChips.css'

interface CategoryChipsProps {
  categories: Category[]
  selectedCategoryId: string
  onSale: boolean
  onSelectAll: () => void
  onSelectSale: () => void
  onSelectCategory: (id: number) => void
}

export default function CategoryChips({
  categories,
  selectedCategoryId,
  onSale,
  onSelectAll,
  onSelectSale,
  onSelectCategory,
}: CategoryChipsProps) {
  const allActive = !selectedCategoryId && !onSale

  return (
    <div className="chips" role="group" aria-label="Categorías">
      <button className={`chip ${allActive ? 'is-active' : ''}`} onClick={onSelectAll}>
        Todo
      </button>
      <button className={`chip chip--sale ${onSale ? 'is-active' : ''}`} onClick={onSelectSale}>
        Ofertas
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`chip ${String(category.id) === selectedCategoryId ? 'is-active' : ''}`}
          onClick={() => onSelectCategory(category.id)}
        >
          <span aria-hidden="true">{category.emoji}</span> {category.name}
        </button>
      ))}
    </div>
  )
}
