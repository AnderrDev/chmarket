import { useMemo, useState } from 'react'
import { useCatalog } from '../hooks/useCatalog'
import ProductCard from '../components/products/ProductCard'
import ProductCardSkeleton from '../components/products/ProductCardSkeleton'
import type { CatalogViewRow } from '../data/entities/catalog'
import FiltersPanel from '../components/products/FiltersPanel'

export default function Products() {
  const { items, loading, error } = useCatalog(24)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | 'protein' | 'creatine'>('all')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [sort, setSort] = useState<'relevance' | 'price_asc' | 'price_desc'>('relevance')
  const [showFilters, setShowFilters] = useState<boolean>(false)

  const filtered: CatalogViewRow[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    const min = minPrice !== '' ? Number(minPrice) : undefined
    const max = maxPrice !== '' ? Number(maxPrice) : undefined
    let result = items.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(q)
      const descMatch = (p.description || '').toLowerCase().includes(q)
      const categoryMatch = category === 'all' ? true : p.type === category
      const price = (p.min_price_cents || 0) / 100
      const minOk = typeof min === 'number' ? price >= min : true
      const maxOk = typeof max === 'number' ? price <= max : true
      const stockOk = !inStockOnly ? true : (p.variants || []).some(v => v.stock > 0)
      const textOk = q === '' ? true : (nameMatch || descMatch)
      return categoryMatch && minOk && maxOk && stockOk && textOk
    })

    if (sort === 'price_asc') {
      result = [...result].sort((a, b) => (a.min_price_cents || 0) - (b.min_price_cents || 0))
    } else if (sort === 'price_desc') {
      result = [...result].sort((a, b) => (b.min_price_cents || 0) - (a.min_price_cents || 0))
    } else {
      // relevance: featured primero, luego por nombre
      result = [...result].sort((a, b) => {
        const fa = a.is_featured ? 1 : 0
        const fb = b.is_featured ? 1 : 0
        if (fa !== fb) return fb - fa
        return a.name.localeCompare(b.name)
      })
    }
    return result
  }, [items, query, category, minPrice, maxPrice, inStockOnly, sort])

  const clearAll = () => {
    setQuery('')
    setCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setInStockOnly(false)
    setSort('relevance')
  }

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-secondary text-white mb-2 sm:mb-3">Nuestros Productos</h2>
          <p className="text-ch-gray text-sm sm:text-base">Formulados científicamente para ayudarte a lograr tus objetivos.</p>
        </div>

        {/* Controles móviles */}
        <div className="md:hidden mb-4 sm:mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(true)}
            className="px-3 sm:px-4 py-2 rounded-lg border border-ch-gray/30 text-white bg-ch-dark-gray text-sm"
          >
            Filtrar
          </button>
          <div className="text-ch-gray text-sm">{filtered.length} resultados</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar filtros */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <FiltersPanel
                query={query}
                setQuery={setQuery}
                category={category}
                setCategory={setCategory}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                sort={sort}
                setSort={setSort}
                onClear={clearAll}
              />
            </div>
          </aside>

          {/* Grid productos */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="grid-products">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="text-center text-red-400">{error}</div>
            )}

            {!loading && !error && (
              <>
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-ch-gray text-lg mb-4">No se encontraron productos</div>
                    <button
                      onClick={clearAll}
                      className="px-4 py-2 bg-ch-primary text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid-products">
                    {filtered.map(p => <ProductCard key={p.product_id} p={p} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Drawer móvil */}
        {showFilters && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
            <div
              className="absolute bottom-0 left-0 right-0 bg-ch-dark-gray rounded-t-2xl p-4 border-t border-ch-gray/30 max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white text-lg">Filtros</h4>
                <button className="text-ch-primary" onClick={() => setShowFilters(false)}>Cerrar</button>
              </div>
              <FiltersPanel
                query={query}
                setQuery={setQuery}
                category={category}
                setCategory={setCategory}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                sort={sort}
                setSort={setSort}
                onClear={clearAll}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
