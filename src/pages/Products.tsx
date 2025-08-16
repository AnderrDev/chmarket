import { useCatalog } from '../hooks/useCatalog'
import ProductCard from '../components/products/ProductCard'
import Skeleton from '../components/ui/Skeleton'

export default function Products() {
  const { items, loading, error } = useCatalog(24)

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-secondary text-white mb-3">Nuestros Productos</h2>
          <p className="text-ch-gray">Formulados científicamente para ayudarte a lograr tus objetivos.</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-ch-dark-gray rounded-xl border border-ch-gray/20 overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="h-6 w-3/4 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-24 rounded" />
                    <Skeleton className="h-5 w-12 rounded" />
                  </div>
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
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
