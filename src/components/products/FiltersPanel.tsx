import Accordion from '../ui/Accordion'
import { useMemo } from 'react'

type Props = {
  query: string
  setQuery: (v: string) => void
  category: 'all' | 'protein' | 'creatine'
  setCategory: (v: 'all' | 'protein' | 'creatine') => void
  minPrice: string
  setMinPrice: (v: string) => void
  maxPrice: string
  setMaxPrice: (v: string) => void
  inStockOnly: boolean
  setInStockOnly: (v: boolean) => void
  sort: 'relevance' | 'price_asc' | 'price_desc'
  setSort: (v: 'relevance' | 'price_asc' | 'price_desc') => void
  onClear: () => void
}

export default function FiltersPanel({
  query,
  setQuery,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  sort,
  setSort,
  onClear,
}: Props) {
  const items = useMemo(() => ([
    {
      id: 'category',
      question: 'Categorías',
      defaultOpen: true,
      answer: (
        <div className="space-y-2">
          {[
            { label: 'Todas', value: 'all' },
            { label: 'Proteínas', value: 'protein' },
            { label: 'Creatina', value: 'creatine' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 text-white">
              <input
                type="radio"
                name="category"
                value={opt.value}
                checked={category === (opt.value as any)}
                onChange={() => setCategory(opt.value as any)}
                className="accent-ch-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      ),
    },
    {
      id: 'price',
      question: 'Precio',
      answer: (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-ch-gray mb-1">Mín (COP)</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="w-full bg-ch-dark-gray border border-ch-gray/30 text-white rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-xs text-ch-gray mb-1">Máx (COP)</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="w-full bg-ch-dark-gray border border-ch-gray/30 text-white rounded-lg p-2"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'availability',
      question: 'Disponibilidad',
      answer: (
        <label className="inline-flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="accent-ch-primary"
          />
          Solo en stock
        </label>
      ),
    },
    {
      id: 'sort',
      question: 'Ordenar',
      answer: (
        <div className="space-y-2 text-white">
          {[
            { label: 'Relevancia', value: 'relevance' },
            { label: 'Precio: menor a mayor', value: 'price_asc' },
            { label: 'Precio: mayor a menor', value: 'price_desc' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sort === (opt.value as any)}
                onChange={() => setSort(opt.value as any)}
                className="accent-ch-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      ),
    },
  ]), [category, minPrice, maxPrice, inStockOnly, sort, setCategory, setMinPrice, setMaxPrice, setInStockOnly, setSort])

  const hasFilters = query || category !== 'all' || minPrice || maxPrice || inStockOnly || sort !== 'relevance'

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm text-ch-gray mb-2">Buscar</label>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Nombre o descripción"
          className="w-full bg-ch-dark-gray border border-ch-gray/30 text-white rounded-lg p-3"
        />
      </div>
      <Accordion items={items} />
      {hasFilters && (
        <button onClick={onClear} className="mt-4 text-sm text-ch-primary hover:underline">Limpiar filtros</button>
      )}
    </div>
  )
}


