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

  const img = pickImage(p.images)
  const defaultVariant: CatalogViewVariant | undefined = (p.variants || []).find(v => v.is_active) || (p.variants || [])[0]
  const canBuy = !!defaultVariant && defaultVariant.stock > 0

  // Objeto compatible con el carrito, INCLUYE variant_id ✅
  const productForCart: Omit<CartItem, 'quantity'> = {
    // dejamos id como fallback legacy, pero la clave real será variant_id
    id: 0,
    variant_id: defaultVariant?.variant_id || '',
    name: `${p.name}${defaultVariant ? ` – ${defaultVariant.variant_label}` : ''}`,
    type: (p.type || 'protein') as 'creatine' | 'protein',
    price: (defaultVariant?.price_cents || 0) / 100,
    originalPrice: undefined,
    image: img || 'https://images.unsplash.com/photo-1517033777-6203d1f5c3f1?q=80&w=800&auto=format&fit=crop',
    images: [img].filter(Boolean) as string[],
    description: p.description || '',
    longDescription: p.long_description || '',
    features: (p as any).features || [],
    ingredients: (p as any).ingredients || [],
    nutritionFacts: (p as any).nutrition_facts || {},
    rating: (p as any).rating ?? 4.8,
    reviews: (p as any).reviews ?? 0,
    inStock: defaultVariant?.stock || 0,
    servings: 0,
    slug: p.slug || '', // aseguramos que slug esté presente
  }

  return (
    <div className="bg-ch-dark-gray rounded-xl shadow-2xl border border-ch-gray/20 overflow-hidden group">
      <div className="relative overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={p.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-64 bg-ch-medium-gray" />
        )}

        <button
          onClick={() => setFav(v => !v)}
          className="absolute bottom-4 right-4 p-2 bg-black/70 rounded-full"
        >
          <Heart className={`w-5 h-5 ${fav ? 'text-ch-primary fill-current' : 'text-white'}`} />
        </button>
      </div>

      <div className="p-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-ch-primary/20 text-ch-primary border border-ch-primary/30">
          {p.type?.toUpperCase()}
        </span>

        <div className="mt-3 text-xl font-secondary text-white">{p.name}</div>
        {p.variants && p.variants.length > 0 && (
          <div className="text-ch-gray text-sm mt-1">
            {p.variants.map((variant, index) => (
              <span key={variant.variant_id}>
                {variant.variant_label}
                {index < p.variants!.length - 1 && ', '}
              </span>
            ))}
          </div>
        )}
        {p.description && <p className="text-ch-gray text-sm mt-2 line-clamp-2">{p.description}</p>}

        {p.features?.length ? (
          <div className="grid grid-cols-2 gap-2 my-4">
            {p.features.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center text-sm text-ch-gray">
                <Check className="w-4 h-4 text-ch-primary mr-2" />
                {f}
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {typeof defaultVariant?.compare_at_price_cents === 'number' && defaultVariant!.compare_at_price_cents! > (defaultVariant!.price_cents) && (
              <span className="text-base text-ch-gray line-through mr-1">
                {currency((defaultVariant!.compare_at_price_cents as number) / 100, 'es-CO', defaultVariant!.currency || 'COP')}
              </span>
            )}
            <span className="text-2xl font-bold text-white">
              {currency((defaultVariant?.price_cents || 0) / 100, 'es-CO', defaultVariant?.currency || 'COP')}
            </span>
          </div>
          {/* <div className="flex items-center gap-1 text-sm text-white">
            <Star className="w-4 h-4 text-ch-primary fill-current" />
            <span>{(p.rating ?? 4.8).toFixed(1)}</span>
          </div> */}
        </div>

        <div className="space-y-3">
          <Link
            to={`/product/${p.slug}`}
            className="w-full inline-flex items-center justify-center border border-ch-gray/30 text-white font-semibold py-3 rounded-lg hover:bg-ch-light-gray/70"
          >
            Ver detalles
          </Link>
          <button
            onClick={() => {
              add(productForCart)
              showToast('Producto agregado al carrito', { type: 'success' })
            }}
            disabled={!canBuy}
            className="w-full bg-ch-primary text-black font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {canBuy ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
