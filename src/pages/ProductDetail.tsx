import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Check, Heart, Share2, Star, Truck, RotateCcw, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'
import type { CartItem } from '../data/entities/cart'
import { currency } from '../utils/format'
import { catalogToProduct, pickImage } from '../utils/catalogAdapter'
import useProductBySlug from '../hooks/useProductBySlug'
import ProductGallery from '../components/products/ProductGallery'
import ProductDetailSkeleton from '../components/products/ProductDetailSkeleton'
import BackButton from '../components/common/BackButton'
import ProductCarousel from '../components/ui/ProductCarousel'
import { useCatalog } from '../hooks/useCatalog'
import { useToast } from '../context/ToastContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { add } = useCart()
  const { showToast } = useToast()
  const [fav, setFav] = useState(false)
  const [variantLoading, setVariantLoading] = useState(false)
  const { product: p, loading } = useProductBySlug(slug)

  const initialVariant = useMemo(() => (p?.variants || []).find(v => v.is_default && v.is_active) || (p?.variants || [])[0], [p])
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(initialVariant?.variant_id)
  const selectedVariant = useMemo(() => (p?.variants || []).find(v => v.variant_id === selectedVariantId) || initialVariant, [p, selectedVariantId, initialVariant])
  const price = (selectedVariant?.price_cents || 0) / 100
  const original = typeof selectedVariant?.compare_at_price_cents === 'number' ? (selectedVariant!.compare_at_price_cents as number) / 100 : undefined
  const currencyCode = selectedVariant?.currency || 'COP'
  const inStock = selectedVariant?.stock ?? 0
  const ratingValue = 4.8 // Valor por defecto ya que no está en la nueva estructura
  const reviewsCount = 0 // Valor por defecto ya que no está en la nueva estructura

  // Scroll al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    const qp = searchParams.get('v')
    if (qp && (p?.variants || []).some(v => v.variant_id === qp)) {
      setSelectedVariantId(qp)
    } else if (initialVariant?.variant_id) {
      setSelectedVariantId(initialVariant.variant_id)
    }
  }, [p, searchParams, initialVariant])

  useEffect(() => {
    if (!selectedVariant?.variant_id) return
    const curr = new URLSearchParams(searchParams)
    curr.set('v', selectedVariant.variant_id)
    setSearchParams(curr, { replace: true })
  }, [selectedVariant?.variant_id])

  const handleVariantChange = (newVariantId: string) => {
    setVariantLoading(true)
    setSelectedVariantId(newVariantId)
    
    // Simular un pequeño delay para que se vea el loading
    setTimeout(() => {
      setVariantLoading(false)
    }, 300)
  }

  if (loading) return <ProductDetailSkeleton />
  if (!p) return <div className="container py-16 text-ch-gray">Producto no encontrado</div>

  // Obtener imágenes del producto y variante seleccionada
  const productImages = pickImage(p.product_images) ? [pickImage(p.product_images)!] : []
  const variantImages = selectedVariant?.images ? pickImage(selectedVariant.images) ? [pickImage(selectedVariant.images)!] : [] : []
  const defaultImages = pickImage(p.default_images) ? [pickImage(p.default_images)!] : []
  
  // Combinar imágenes: variante seleccionada > imágenes por defecto > imágenes del producto
  const allImages = [...variantImages, ...defaultImages, ...productImages].filter(Boolean)
  const imgs: string[] = allImages.length > 0 ? allImages : ['/placeholder-product.svg']

  return (
    <div className="container py-10">
      <BackButton className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative">
          {variantLoading ? (
            <div className="relative overflow-hidden rounded-2xl">
              <div className="animate-pulse w-full h-96 bg-ch-medium-gray" />
            </div>
          ) : (
            <ProductGallery images={imgs} alt={p.name} />
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-black/70 rounded-full hover:bg-black/90"><Share2 className="w-5 h-5 text-white"/></button>
            <button onClick={() => setFav(v => !v)} className="p-2 bg-black/70 rounded-full hover:bg-black/90">
              <Heart className={`w-5 h-5 ${fav ? 'text-ch-primary fill-current' : 'text-white'}`}/>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-ch-primary/20 text-ch-primary border border-ch-primary/30">
                {p.type?.toUpperCase()}
              </span>
              {p.is_featured && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-400/30">
                  DESTACADO
                </span>
              )}
              {p.is_active === false && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-400/30">
                  INACTIVO
                </span>
              )}
            </div>
            <h1 className="text-4xl font-secondary text-white mt-4">{p.name}</h1>
            {p.description && (
              <p className="text-ch-gray mt-2">{p.description}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(ratingValue) ? 'text-ch-primary fill-current' : 'text-ch-gray/30'}`} />
                ))}
                <span className="ml-2 text-white font-semibold">{ratingValue.toFixed(1)}</span>
              </div>
              <span className="text-ch-gray">({reviewsCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {typeof original === 'number' && original > price && (
              <span className="text-lg text-ch-gray line-through">{currency(original, 'es-CO', currencyCode)}</span>
            )}
            <span className="text-4xl font-bold text-white">{currency(price, 'es-CO', currencyCode)}</span>
          </div>

          {typeof original === 'number' && original > price && (
            <div className="text-sm text-ch-primary">
              Ahorra {Math.round(((original - price) / original) * 100)}%
            </div>
          )}

          {(p.variants?.length || 0) > 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-ch-gray text-sm">Variante</label>
                <select
                  className="w-full bg-ch-dark-gray border border-ch-gray/30 text-white rounded-lg p-3"
                  value={selectedVariant?.variant_id || ''}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  disabled={variantLoading}
                >
                  {(p.variants || []).map(v => (
                    <option key={v.variant_id} value={v.variant_id}>
                      {v.label} — {currency(v.price_cents / 100, 'es-CO', v.currency || 'COP')}
                    </option>
                  ))}
                </select>
              </div>

              {Array.from(new Set((p.variants || []).map(v => v.flavor).filter(Boolean))).length > 0 && (
                <div className="space-y-2">
                  <div className="text-ch-gray text-sm">Sabor</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set((p.variants || []).map(v => v.flavor).filter(Boolean))).map((fl: any) => {
                      const match = (p.variants || []).find(v => v.flavor === fl)
                      const isSelected = selectedVariant?.flavor === fl
                      return (
                        <button
                          key={String(fl)}
                          onClick={() => match && handleVariantChange(match.variant_id)}
                          disabled={variantLoading}
                          className={`px-3 py-1 rounded-full border ${isSelected ? 'bg-ch-primary text-black border-ch-primary' : 'border-ch-gray/40 text-white'} ${variantLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-ch-gray/60'}`}
                        >
                          {String(fl)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {Array.from(new Set((p.variants || []).map(v => v.size).filter(Boolean))).length > 0 && (
                <div className="space-y-2">
                  <div className="text-ch-gray text-sm">Tamaño</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set((p.variants || []).map(v => v.size).filter(Boolean))).map((sz: any) => {
                      const match = (p.variants || []).find(v => v.size === sz)
                      const isSelected = selectedVariant?.size === sz
                      return (
                        <button
                          key={String(sz)}
                          onClick={() => match && handleVariantChange(match.variant_id)}
                          disabled={variantLoading}
                          className={`px-3 py-1 rounded-full border ${isSelected ? 'bg-ch-primary text-black border-ch-primary' : 'border-ch-gray/40 text-white'} ${variantLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-ch-gray/60'}`}
                        >
                          {String(sz)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedVariant?.sku && (
                <div className="text-ch-gray text-xs">SKU: {selectedVariant.sku}</div>
              )}
            </div>
          )}

          <p className="text-ch-gray text-lg">{p.long_description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<Truck className="w-6 h-6 text-ch-primary" />} title="Free Shipping" subtitle="Pedidos +$50" />
            <InfoCard icon={<RotateCcw className="w-6 h-6 text-ch-primary" />} title="30-Day Return" subtitle="Garantía" />
            <InfoCard icon={<Shield className="w-6 h-6 text-ch-primary" />} title="Third-Party Tested" subtitle="Calidad" />
          </div>

          <div className="bg-ch-dark-gray rounded-lg p-6 border border-ch-gray/20">
            <h3 className="text-xl font-secondary text-white mb-4">Key Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(p.features || []).map((f: string, i: number) => (
                <li key={i} className="flex items-center text-ch-gray"><Check className="w-5 h-5 text-ch-primary mr-3"/>{f}</li>
              ))}
            </ul>
          </div>

          {(p.ingredients || []).length > 0 && (
            <div className="bg-ch-dark-gray rounded-lg p-6 border border-ch-gray/20">
              <h3 className="text-xl font-secondary text-white mb-4">Ingredientes</h3>
              <ul className="list-disc list-inside text-ch-gray">
                {(p.ingredients || []).map((ing: string, i: number) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          

          {p.nutrition_facts && Object.keys(p.nutrition_facts).length > 0 && (
            <div className="bg-ch-dark-gray rounded-lg p-6 border border-ch-gray/20">
              <h3 className="text-xl font-secondary text-white mb-4">Información Nutricional</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(p.nutrition_facts).map(([k, v]: any) => (
                  <div key={k} className="flex justify-between text-ch-gray">
                    <span className="text-white/80">{k}</span>
                    <span>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm bg-ch-dark-gray rounded-lg p-4 border border-ch-gray/20">
            <span className="text-ch-gray">Disponibilidad:</span>
            <span className={`font-semibold ${inStock === 0 ? 'text-red-400' : inStock <= (selectedVariant?.low_stock_threshold || 5) ? 'text-yellow-400' : 'text-ch-primary'}`}>
              {inStock === 0 ? 'Sin stock' : inStock <= (selectedVariant?.low_stock_threshold || 5) ? `Pocas unidades (${inStock})` : `${inStock} unidades`}
            </span>
          </div>

          <button
            onClick={() => {
              const adapted = catalogToProduct(p, selectedVariant)
              const forCart: Omit<CartItem,'quantity'> = {
                id: adapted.id,
                variant_id: adapted.variant_id,
                name: adapted.name,
                type: adapted.type,
                price: adapted.price,
                image: adapted.image,
                images: adapted.images,
                slug: adapted.slug || '',
                description: adapted.description,
                longDescription: adapted.longDescription,
                features: adapted.features,
                ingredients: adapted.ingredients,
                nutritionFacts: adapted.nutritionFacts,
                rating: adapted.rating,
                reviews: adapted.reviews,
                inStock: adapted.inStock,
                servings: adapted.servings,
              }
              add(forCart)
              showToast('Producto agregado al carrito', { type: 'success' })
            }}
            disabled={inStock === 0 || variantLoading}
            className="w-full bg-ch-primary text-black py-4 rounded-lg text-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {inStock === 0 ? 'Out of Stock' : `Add to Cart – ${currency(price, 'es-CO', currencyCode)}`}
          </button>
        </div>
      </div>

      {/* Recomendados */}
      <RecommendedProducts currentSlug={p.slug} currentType={p.type} />
    </div>
  )
}

function InfoCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="bg-ch-dark-gray rounded-lg p-4 border border-ch-gray/20">
      <div className="mb-2">{icon}</div>
      <h3 className="text-white">{title}</h3>
      <p className="text-ch-gray text-sm">{subtitle}</p>
    </div>
  )
}

function RecommendedProducts({ currentSlug, currentType }: { currentSlug: string; currentType?: string }) {
  const { items } = useCatalog(24)
  const recommended = (items || [])
    .filter(it => it.slug !== currentSlug)
    .filter(it => (currentType ? it.type === currentType : true))
    .slice(0, 6)

  if (recommended.length === 0) return null

  return (
    <ProductCarousel
      products={recommended}
      title="Productos relacionados"
      subtitle="Descubre más productos que te pueden interesar"
      showViewAll={true}
      viewAllLink="/products"
    />
  )
}
