import { Check, Heart, Star } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { currency } from '../../utils/format'
import { CatalogProduct } from '../../types/catalog'


function pickImage(images: any): string | null {
  // images puede ser string[], o [{url, ...}], o null
//   if (!images) return null
//   if (Array.isArray(images) && images.length > 0) {
//     const first = images[0]
//     if (typeof first === 'string') return first
//     if (first?.url) return first.url
//   }
//   if (images?.url) return images.url
//   return null
    return "https://iqeuktsyzrkrbkjiqfvy.supabase.co/storage/v1/object/public/images/Captura%20de%20pantalla%202025-08-12%20a%20la(s)%2010.03.05%20p.m..png"
}

export default function CatalogCard({ p }: { p: CatalogProduct }) {
  const { add } = useCart()
  const [fav, setFav] = useState(false)
  const img = pickImage(p.images)

  const pseudoProduct = {
    id: Number.NaN, // no usamos id numérico; el flujo de ADD al carrito espera Product
    // 📝 Para mantener compatibilidad, mapeamos lo mínimo necesario
    name: `${p.name} – ${p.variant_label}`,
    type: p.type as 'creatine' | 'protein',
    price: p.price_cents / 100,
    originalPrice: undefined,
    image: img || 'https://images.unsplash.com/photo-1517033777-6203d1f5c3f1?q=80&w=800&auto=format&fit=crop',
    images: [img].filter(Boolean) as string[],
    description: p.description || '',
    longDescription: p.long_description || '',
    features: p.features || [],
    ingredients: p.ingredients || [],
    nutritionFacts: p.nutrition_facts || {},
    rating: p.rating ?? 4.8,
    reviews: p.reviews ?? 0,
    inStock: p.stock,
    servings: 0,
    // Guardamos info extra para cuando integremos detalle por variant
    // @ts-ignore
    __variant_id: p.variant_id,
  } as any

  const canBuy = p.stock > 0

  return (
    <div className="bg-ch-dark-gray rounded-xl shadow-2xl border border-ch-gray/20 overflow-hidden group">
      <div className="relative overflow-hidden">
        {img ? (
          <img src={img} alt={p.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"/>
        ) : (
          <div className="w-full h-64 bg-ch-medium-gray" />
        )}
        <button onClick={() => setFav(v => !v)} className="absolute bottom-4 right-4 p-2 bg-black/70 rounded-full">
          <Heart className={`w-5 h-5 ${fav ? 'text-ch-primary fill-current' : 'text-white'}`} />
        </button>
      </div>

      <div className="p-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-ch-primary/20 text-ch-primary border border-ch-primary/30">
          {p.type.toUpperCase()}
        </span>

        <div className="mt-3 text-xl font-secondary text-white">{p.name}</div>
        <div className="text-ch-gray text-sm mt-1">{p.variant_label}</div>
        {p.description && <p className="text-ch-gray text-sm mt-2 line-clamp-2">{p.description}</p>}

        {p.features && p.features.length > 0 && (
          <div className="grid grid-cols-2 gap-2 my-4">
            {p.features.slice(0,4).map((f, i) => (
              <div key={i} className="flex items-center text-sm text-ch-gray">
                <Check className="w-4 h-4 text-ch-primary mr-2"/>{f}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{currency(p.price_cents / 100, 'es-CO', 'COP')}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-white">
            <Star className="w-4 h-4 text-ch-primary fill-current"/>
            <span>{(p.rating ?? 4.8).toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Para ahora mantenemos “Agregar al carrito” directo */}
          <button
            onClick={() => {
              console.log(pseudoProduct);
              return add(pseudoProduct)
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
