import { useEffect, useState } from 'react'
import { listCatalog } from '../services/catalog'
import { CatalogProduct } from '../types/catalog'
import ProductCard from '../components/products/ProductCard'

export default function Products() {
  const [items, setItems] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          setLoading(true)
          const data = await listCatalog(24)
          if (mounted) setItems(data)
        } catch (e: any) {
          setError(e?.message || 'Error cargando productos')
        } finally {
          if (mounted) setLoading(false)
        }
      })()
    return () => { mounted = false }
  }, [])

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-secondary text-white mb-3">Nuestros Productos</h2>
          <p className="text-ch-gray">Formulados científicamente para ayudarte a lograr tus objetivos.</p>
        </div>

        {loading && (
          <div className="text-center text-ch-gray">Cargando…</div>
        )}

        {error && !loading && (
          <div className="text-center text-red-400">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map(p => <ProductCard key={p.variant_id} p={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}
