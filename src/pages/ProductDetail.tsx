import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Heart, Share2, Star, Truck, RotateCcw, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { CatalogProduct } from '../types/catalog'
import { currency } from '../utils/format'


export default function ProductDetail() {
  const { slug } = useParams()
  const { add } = useCart()
  const [p, setP] = useState<CatalogProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [fav, setFav] = useState(false)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('catalog_public')
        .select('*')
        .eq('slug', slug)
        .limit(1)
        .maybeSingle()
      if (!ignore) {
        if (error) console.error(error)
        setP(data ?? null)
        setLoading(false)
      }
    }
    if (slug) load()
    return () => { ignore = true }
  }, [slug])

  if (loading) return <div className="container py-16 text-ch-gray">Cargando…</div>
  if (!p) return <div className="container py-16 text-ch-gray">Producto no encontrado</div>

  // Normaliza imágenes: cadena[] o [{url}]
  const imgs: string[] = Array.isArray(p.images)
    ? (typeof p.images[0] === 'string'
        ? (p.images as string[])
        : (p.images as any[]).map(i => i.url).filter(Boolean))
    : []

  const priceCOP = p.price_cents / 100
  const inStock = p.stock ?? 0

  return (
    <div className="container py-10">
      <Link to="/" className="inline-flex items-center text-ch-primary mb-8"><ArrowLeft className="w-5 h-5 mr-2"/>Back to Products</Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative overflow-hidden rounded-2xl bg-ch-dark-gray">
            <img src={imgs[imgIdx]} alt={p.name} className="w-full h-96 object-cover"/>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-black/70 rounded-full hover:bg-black/90"><Share2 className="w-5 h-5 text-white"/></button>
              <button onClick={() => setFav(v => !v)} className="p-2 bg-black/70 rounded-full hover:bg-black/90">
                <Heart className={`w-5 h-5 ${fav ? 'text-ch-primary fill-current' : 'text-white'}`}/>
              </button>
            </div>
          </div>
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {imgs.map((src: string, i: number) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${imgIdx===i?'border-ch-primary':'border-ch-gray/30'}`}>
                <img src={src} alt={`${p.name} ${i+1}`} className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-ch-primary/20 text-ch-primary border border-ch-primary/30">
              {p.type?.toUpperCase()}
            </span>
            <h1 className="text-4xl font-secondary text-white mt-4">{p.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(Number(p.rating || 0)) ? 'text-ch-primary fill-current' : 'text-ch-gray/30'}`} />
                ))}
                <span className="ml-2 text-white font-semibold">{Number(p.rating || 0).toFixed(1)}</span>
              </div>
              <span className="text-ch-gray">({p.reviews ?? 0} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-white">{currency(priceCOP, 'es-CO', 'COP')}</span>
          </div>

          <p className="text-ch-gray text-lg">{p.long_description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<Truck className="w-6 h-6 text-ch-primary" />} title="Free Shipping" subtitle="Pedidos +$50" />
            <InfoCard icon={<RotateCcw className="w-6 h-6 text-ch-primary" />} title="30-Day Return" subtitle="Garantía" />
            <InfoCard icon={<Shield className="w-6 h-6 text-ch-primary" />} title="Third-Party Tested" subtitle="Calidad" />
          </div>

          <div className="bg-ch-dark-gray rounded-lg p-6 border border-ch-gray/20">
            <h3 className="text-xl font-secondary text-white mb-4">Key Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(p.features ?? []).map((f, i) => (
                <li key={i} className="flex items-center text-ch-gray"><Check className="w-5 h-5 text-ch-primary mr-3"/>{f}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between text-sm bg-ch-dark-gray rounded-lg p-4 border border-ch-gray/20">
            <span className="text-ch-gray">In Stock:</span>
            <span className="text-ch-primary font-semibold">{inStock} units available</span>
          </div>

          <button
            onClick={() => add({
              id: 0, // si tu CartItem necesita id numérico, o ajusta para aceptar variant_id/product_id
              name: p.name,
              type: p.type as any,
              price: priceCOP,
              image: imgs[0] || '',
              images: imgs,
              description: p.description,
              longDescription: p.long_description,
              features: p.features ?? [],
              ingredients: p.ingredients ?? [],
              nutritionFacts: p.nutrition_facts ?? {},
              rating: Number(p.rating || 0),
              reviews: p.reviews ?? 0,
              inStock: inStock,
              servings: 0,
              // añade campos que tu CartItem requiera o adapta el contexto a usar product_id/variant_id string
            } as any)}
            disabled={inStock === 0}
            className="w-full bg-ch-primary text-black py-4 rounded-lg text-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {inStock === 0 ? 'Out of Stock' : `Add to Cart – ${currency(priceCOP, 'es-CO', 'COP')}`}
          </button>
        </div>
      </div>
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
