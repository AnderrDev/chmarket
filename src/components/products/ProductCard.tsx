import { Check, Heart } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { CatalogViewRow, CatalogViewVariant } from '../../data/entities/catalog'
import type { CartItem } from '../../data/entities/cart'
import { pickImage } from '../../utils/catalogAdapter'
import { currency } from '../../utils/format'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'


export default function ProductCard({ p }: { p: CatalogViewRow }) {
  const { add } = useCart()
  const { showToast } = useToast()
  const [fav, setFav] = useState(false)

  const img = pickImage(p.default_images || p.product_images)
  const defaultVariant: CatalogViewVariant | undefined = (p.variants || []).find(v => v.is_default && v.is_active) || (p.variants || [])[0]
  const canBuy = !!defaultVariant && defaultVariant.stock > 0

  // Objeto compatible con el carrito, INCLUYE variant_id ✅
  const productForCart: Omit<CartItem, 'quantity'> = {
    // dejamos id como fallback legacy, pero la clave real será variant_id
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
    rating: 4.8, // Valor por defecto
    reviews: 0, // Valor por defecto
    inStock: defaultVariant?.stock || 0,
    servings: 0,
    slug: p.slug || '', // aseguramos que slug esté presente
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
              // Fallback a imagen placeholder si la imagen falla
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-product.svg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges compactos */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
            {p.is_featured && (
              <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-yellow-500/90 text-black">
                DESTACADO
              </span>
            )}
            <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-ch-primary/90 text-black">
              {p.type?.toUpperCase()}
            </span>
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setFav(v => !v)
            }}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-black/70 rounded-full hover:bg-black/90 transition-colors card-interactive"
          >
            <Heart className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${fav ? 'text-ch-primary fill-current' : 'text-white'}`} />
          </button>
        </div>

        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="text-base sm:text-lg font-secondary text-white mb-1 sm:mb-2 group-hover:text-ch-primary transition-colors line-clamp-1">
            {p.name}
          </h3>
          
          {p.description && (
            <p className="text-ch-gray text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 flex-1">
              {p.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1 sm:gap-2">
              {defaultVariant?.compare_at_price_cents && defaultVariant.compare_at_price_cents > defaultVariant.price_cents && (
                <span className="text-xs sm:text-sm text-ch-gray line-through">
                  {currency(defaultVariant.compare_at_price_cents / 100, 'es-CO', defaultVariant.currency)}
                </span>
              )}
              <span className="text-lg sm:text-xl font-bold text-white">
                {currency((defaultVariant?.price_cents || 0) / 100, 'es-CO', defaultVariant?.currency || 'COP')}
              </span>
            </div>
            
            <div className="flex items-center text-xs sm:text-sm text-ch-gray">
              <Check className="w-3 sm:w-4 h-3 sm:h-4 text-ch-primary mr-1" />
              <span className="hidden sm:inline">{defaultVariant?.stock || 0} disponibles</span>
              <span className="sm:hidden">{defaultVariant?.stock || 0}</span>
            </div>
          </div>

          {/* Variants preview compacto */}
          {(p.variants || []).length > 1 && (
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
              {(p.variants || []).slice(0, 3).map((variant, i) => (
                <span
                  key={variant.variant_id}
                  className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs bg-ch-gray/20 text-ch-gray border border-ch-gray/30"
                >
                  {variant.label}
                </span>
              ))}
              {(p.variants || []).length > 3 && (
                <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs bg-ch-gray/20 text-ch-gray border border-ch-gray/30">
                  +{(p.variants || []).length - 3} más
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Add to cart button - siempre en la parte inferior */}
      <div className="p-3 sm:p-4 pt-0 mt-auto">
        <button
          onClick={() => {
            add(productForCart)
            showToast('Producto agregado al carrito', { type: 'success' })
          }}
          disabled={!canBuy}
          className="w-full bg-ch-primary text-black py-2.5 sm:py-3 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 card-interactive"
        >
          {!canBuy ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}
