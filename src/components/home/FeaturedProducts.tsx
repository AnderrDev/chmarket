import ProductCarousel from '../ui/ProductCarousel'
import type { CatalogViewRow } from '../../data/entities/catalog'

type FeaturedProductsProps = {
  products: CatalogViewRow[]
  loading: boolean
  error: string | null
}

export default function FeaturedProducts({ products, loading, error }: FeaturedProductsProps) {
  if (error) {
    return (
      <section id="products" className="py-16">
        <div className="container">
          <div className="text-center text-red-400">{error}</div>
        </div>
      </section>
    )
  }

  return (
    <ProductCarousel
      products={products}
      title="Productos Destacados"
      subtitle="Formulados científicamente para ayudarte a alcanzar tus metas."
      showViewAll={true}
      viewAllLink="/products"
      loading={loading}
    />
  )
}


