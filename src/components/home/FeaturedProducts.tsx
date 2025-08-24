import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, ShoppingCart, Eye } from 'lucide-react'
import type { CatalogViewRow } from '../../data/entities/catalog'
import { pickImage } from '../../utils/catalogAdapter'
import { currency } from '../../utils/format'
import { useCart } from '../../context/CartContext'
import type { CartItem } from '../../data/entities/cart'
import { useToast } from '../../context/ToastContext'

type FeaturedProductsProps = {
  products: CatalogViewRow[]
  loading: boolean
  error: string | null
}

// Skeleton minimalista
function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="group">
          <div className="aspect-square bg-ch-dark-gray rounded-lg animate-pulse mb-3 sm:mb-4" />
          <div className="space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-ch-dark-gray rounded animate-pulse" />
            <div className="h-2 sm:h-3 bg-ch-dark-gray rounded animate-pulse w-2/3" />
            <div className="h-4 sm:h-6 bg-ch-dark-gray rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Tarjeta de producto minimalista
function FeaturedProductCard({ product }: { product: CatalogViewRow }) {
  const { add } = useCart()
  const { showToast } = useToast()
  const [isHovered, setIsHovered] = useState(false)

  const img = pickImage(product.default_images || product.product_images)
  const defaultVariant = (product.variants || []).find(v => v.is_default && v.is_active) || (product.variants || [])[0]
  const canBuy = !!defaultVariant && defaultVariant.stock > 0

  const productForCart: Omit<CartItem, 'quantity'> = {
    id: 0,
    variant_id: defaultVariant?.variant_id || '',
    name: `${product.name}${defaultVariant ? ` – ${defaultVariant.label}` : ''}`,
    type: (product.type || 'protein') as 'creatine' | 'protein',
    price: (defaultVariant?.price_cents || 0) / 100,
    originalPrice: undefined,
    image: img || '',
    images: [img].filter(Boolean) as string[],
    description: product.description || '',
    longDescription: product.long_description || '',
    features: product.features || [],
    ingredients: product.ingredients || [],
    nutritionFacts: product.nutrition_facts || {},
    rating: 4.8,
    reviews: 0,
    inStock: defaultVariant?.stock || 0,
    servings: 0,
    slug: product.slug || '',
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    add(productForCart)
    showToast('Producto agregado al carrito', { type: 'success' })
  }

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group cursor-pointer block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-ch-dark-gray mb-3 sm:mb-4">
        <img
          src={img || '/placeholder-product.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-product.svg'
          }}
        />
        
        {/* Overlay con botón de agregar al carrito */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={!canBuy}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-ch-primary rounded-full flex items-center justify-center hover:bg-ch-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          </button>
        </div>

        {/* Badge destacado */}
        {product.is_featured && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-ch-primary text-black text-xs font-bold rounded-full">
              DESTACADO
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/60 backdrop-blur rounded-full">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-xs font-semibold">4.8</span>
        </div>
      </div>

      {/* Información del producto */}
      <div className="space-y-1.5 sm:space-y-2">
        <h3 className="text-white font-medium group-hover:text-ch-primary transition-colors text-sm sm:text-base">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-ch-gray text-xs sm:text-sm line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            {defaultVariant?.compare_at_price_cents && defaultVariant.compare_at_price_cents > defaultVariant.price_cents && (
              <span className="text-xs sm:text-sm text-ch-gray line-through">
                {currency(defaultVariant.compare_at_price_cents / 100, 'es-CO', defaultVariant.currency)}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-white">
              {currency((defaultVariant?.price_cents || 0) / 100, 'es-CO', defaultVariant?.currency || 'COP')}
            </span>
          </div>
          
          <span className="text-xs text-ch-gray">
            {defaultVariant?.stock || 0} disponibles
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedProducts({ products, loading, error }: FeaturedProductsProps) {
  if (error) {
    return (
      <section className="py-12 sm:py-16 bg-ch-black">
        <div className="container">
          <div className="text-center text-red-400">{error}</div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-16 sm:py-20 bg-ch-black">
      <div className="container">
        {/* Header simple */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-secondary text-white mb-3 sm:mb-4">
            Productos Destacados
          </h2>
          <p className="text-ch-gray max-w-lg mx-auto text-sm sm:text-base px-4">
            Nuestros productos más populares, formulados para resultados excepcionales
          </p>
        </div>

        {/* Grid de productos */}
        {loading ? (
          <FeaturedSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
            {products.map((product) => (
              <FeaturedProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}


