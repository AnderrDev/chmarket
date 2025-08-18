import { Link } from 'react-router-dom'
import ProductCard from '../products/ProductCard'
import ProductCardSkeleton from '../products/ProductCardSkeleton'
import type { CatalogViewRow } from '../../data/entities/catalog'

type FeaturedProductsProps = {
  products: CatalogViewRow[]
  loading: boolean
  error: string | null
}

export default function FeaturedProducts({ products, loading, error }: FeaturedProductsProps) {
  return (
    <section id="products" className="py-16">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-secondary text-white">Productos Destacados</h2>
            <p className="text-ch-gray mt-2">Formulados científicamente para ayudarte a alcanzar tus metas.</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center text-ch-primary hover:underline">Ver todos</Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}
        {error && !loading && <div className="text-center text-red-400">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((p) => (
              <ProductCard key={p.product_id} p={p} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <Link to="/products" className="inline-flex items-center text-ch-primary hover:underline">Ver todos</Link>
        </div>
      </div>
    </section>
  )
}


