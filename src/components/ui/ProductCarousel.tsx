import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CatalogViewRow } from '../../data/entities/catalog'
import { pickImage } from '../../utils/catalogAdapter'
import { currency } from '../../utils/format'
import { useCart } from '../../context/CartContext'
import type { CartItem } from '../../data/entities/cart'
import { useToast } from '../../context/ToastContext'
import SectionDivider from './SectionDivider'

type ProductCarouselProps = {
  products: CatalogViewRow[]
  title: string
  subtitle?: string
  showViewAll?: boolean
  viewAllLink?: string
  loading?: boolean
}

// Skeleton para el carrusel mejorado
function CarouselSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex-shrink-0 w-48 sm:w-56 md:w-64">
          <div className="bg-ch-dark-gray rounded-xl overflow-hidden border border-ch-gray/20 flex flex-col h-full">
            <div className="aspect-square bg-ch-medium-gray animate-pulse" />
            <div className="p-3 space-y-2 flex-1 flex flex-col">
              <div className="h-3 bg-ch-medium-gray rounded animate-pulse" />
              <div className="h-2 bg-ch-medium-gray rounded animate-pulse w-3/4 flex-1" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-ch-medium-gray rounded animate-pulse w-16" />
                <div className="h-2 bg-ch-medium-gray rounded animate-pulse w-6" />
              </div>
            </div>
            <div className="px-3 pb-3">
              <div className="h-7 bg-ch-medium-gray rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ProductCard compacto mejorado para el carrusel
function CarouselProductCard({ p }: { p: CatalogViewRow }) {
  const { add } = useCart()
  const { showToast } = useToast()
  const [fav, setFav] = useState(false)

  const img = pickImage(p.default_images || p.product_images)
  const defaultVariant = (p.variants || []).find(v => v.is_default && v.is_active) || (p.variants || [])[0]
  const canBuy = !!defaultVariant && defaultVariant.stock > 0

  const productForCart: Omit<CartItem, 'quantity'> = {
    id: 0,
    variant_id: defaultVariant?.variant_id || '',
    name: `${p.name}${defaultVariant ? ` – ${defaultVariant.label}` : ''}`,
    type: (p.type || 'protein') as 'creatine' | 'protein',
    price: (defaultVariant?.price_cents || 0) / 100,
    originalPrice: undefined,
    image: img || '',
    images: [img].filter(Boolean) as string[],
    description: p.description || '',
    longDescription: p.long_description || '',
    features: p.features || [],
    ingredients: p.ingredients || [],
    nutritionFacts: p.nutrition_facts || {},
    rating: 4.8,
    reviews: 0,
    inStock: defaultVariant?.stock || 0,
    servings: 0,
    slug: p.slug || '',
  }

  return (
    <div className="group relative bg-ch-dark-gray rounded-xl overflow-hidden border border-ch-gray/20 hover:border-ch-primary/50 card-hover flex flex-col h-full">
      <Link to={`/product/${p.slug}`} className="block card-interactive flex-1">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={img || '/placeholder-product.svg'}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-product.svg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges compactos */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {p.is_featured && (
              <span className="inline-block px-1.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/90 text-black">
                DESTACADO
              </span>
            )}
            <span className="inline-block px-1.5 py-0.5 rounded-full text-xs font-semibold bg-ch-primary/90 text-black">
              {p.type?.toUpperCase()}
            </span>
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setFav(v => !v)
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full hover:bg-black/90 transition-colors card-interactive"
          >
            <Heart className={`w-3.5 h-3.5 ${fav ? 'text-ch-primary fill-current' : 'text-white'}`} />
          </button>
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-sm font-secondary text-white mb-1 group-hover:text-ch-primary transition-colors line-clamp-1">
            {p.name}
          </h3>
          
          {p.description && (
            <p className="text-ch-gray text-xs mb-2 line-clamp-2 flex-1">
              {p.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {defaultVariant?.compare_at_price_cents && defaultVariant.compare_at_price_cents > defaultVariant.price_cents && (
                <span className="text-xs text-ch-gray line-through">
                  {currency(defaultVariant.compare_at_price_cents / 100, 'es-CO', defaultVariant.currency)}
                </span>
              )}
              <span className="text-base sm:text-lg font-bold text-white">
                {currency((defaultVariant?.price_cents || 0) / 100, 'es-CO', defaultVariant?.currency || 'COP')}
              </span>
            </div>
            
            <div className="flex items-center text-xs text-ch-gray">
              <Check className="w-3 h-3 text-ch-primary mr-1" />
              <span className="hidden sm:inline">{defaultVariant?.stock || 0}</span>
            </div>
          </div>

          {/* Variants preview compacto */}
          {(p.variants || []).length > 1 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {(p.variants || []).slice(0, 2).map((variant) => (
                <span
                  key={variant.variant_id}
                  className="inline-block px-1 py-0.5 rounded text-xs bg-ch-gray/20 text-ch-gray border border-ch-gray/30"
                >
                  {variant.label}
                </span>
              ))}
              {(p.variants || []).length > 2 && (
                <span className="inline-block px-1 py-0.5 rounded text-xs bg-ch-gray/20 text-ch-gray border border-ch-gray/30">
                  +{(p.variants || []).length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Add to cart button - siempre en la parte inferior */}
      <div className="px-3 pb-3 mt-auto">
        <button
          onClick={() => {
            add(productForCart)
            showToast('Producto agregado al carrito', { type: 'success' })
          }}
          disabled={!canBuy}
          className="w-full bg-ch-primary text-black py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 card-interactive"
        >
          {canBuy ? 'Agregar' : 'Sin stock'}
        </button>
      </div>
    </div>
  )
}

export default function ProductCarousel({ 
  products, 
  title, 
  subtitle, 
  showViewAll = false, 
  viewAllLink = '/products',
  loading = false
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const cardWidth = container.scrollWidth / products.length
    const scrollPosition = index * cardWidth
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })
    
    setCurrentIndex(index)
  }

  const scrollNext = () => {
    const nextIndex = Math.min(currentIndex + 1, products.length - 1)
    scrollToIndex(nextIndex)
  }

  const scrollPrev = () => {
    const prevIndex = Math.max(currentIndex - 1, 0)
    scrollToIndex(prevIndex)
  }

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollButtons()
    
    const handleScroll = () => {
      updateScrollButtons()
    }

    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [products.length])

  return (
    <section className="py-8 sm:py-12">
            <SectionDivider variant="gradient" />

      <div className="container">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-secondary text-white">{title}</h3>
            {subtitle && (
              <p className="text-ch-gray mt-1 sm:mt-2 text-sm sm:text-base">{subtitle}</p>
            )}
          </div>
          {showViewAll && !loading && (
            <a 
              href={viewAllLink} 
              className="hidden sm:inline-flex items-center text-ch-primary hover:underline text-sm"
            >
              Ver todos
            </a>
          )}
        </div>

        <div className="relative group">
          {/* Botón anterior */}
          {canScrollLeft && !loading && (
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-ch-dark-gray/90 backdrop-blur border border-ch-gray/30 rounded-full flex items-center justify-center text-white hover:bg-ch-dark-gray transition-all duration-200 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Botón siguiente */}
          {canScrollRight && !loading && (
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-ch-dark-gray/90 backdrop-blur border border-ch-gray/30 rounded-full flex items-center justify-center text-white hover:bg-ch-dark-gray transition-all duration-200 shadow-lg"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Contenedor del carrusel */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <CarouselSkeleton />
            ) : (
              products.map((product, index) => (
                <div 
                  key={product.product_id} 
                  className="flex-shrink-0 w-48 sm:w-56 md:w-64"
                >
                  <CarouselProductCard p={product} />
                </div>
              ))
            )}
          </div>

          {/* Indicadores */}
          {products.length > 1 && !loading && (
            <div className="flex justify-center gap-2 mt-4 sm:mt-6">
              {Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index * 2)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    currentIndex >= index * 2 && currentIndex < (index + 1) * 2
                      ? 'bg-ch-primary'
                      : 'bg-ch-gray/30 hover:bg-ch-gray/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Link móvil */}
        {showViewAll && !loading && (
          <div className="sm:hidden mt-6 text-center">
            <a 
              href={viewAllLink} 
              className="inline-flex items-center text-ch-primary hover:underline text-sm"
            >
              Ver todos
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
