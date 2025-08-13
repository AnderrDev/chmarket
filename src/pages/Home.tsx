// src/pages/Home.tsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Award, Zap, Users, ArrowRight, CheckCircle2 } from 'lucide-react'
import CatalogCard from '../components/products/CatalogCard'
import Accordion, { AccordionItem } from '../components/ui/Accordion'
import { listCatalog } from '../services/catalog'
import { CatalogProduct } from '../types/catalog'
import ProductCard from '../components/products/ProductCard'
import { catalogToProduct } from '../utils/catalogAdapter'


export default function Home() {
  const [items, setItems] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          setLoading(true)
          const data = await listCatalog(24)
          if (mounted) setItems(data)
        } catch (e: any) {
          setError(e?.message || 'No se pudieron cargar los productos')
        } finally {
          if (mounted) setLoading(false)
        }
      })()
    return () => { mounted = false }
  }, [])

  const top = useMemo(() => items.slice(0, 4), [items])
  const heroImage = useMemo(() => pickImage(items[0]?.images), [items])

  return (
    <>
      {/* Hero */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-ch-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-ch-primary/5 blur-3xl" />
        </div>
        <div className="container pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-5xl md:text-6xl font-secondary leading-tight text-white">
                Fuel your <span className="text-ch-primary">performance</span>
              </h1>
              <p className="mt-4 text-lg text-ch-gray max-w-xl">
                Suplementos premium (creatina y proteína) diseñados para atletas que exigen resultados reales.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a href="#products" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-ch-primary text-black font-semibold hover:opacity-90">
                  Ver productos <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a href="#about" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-ch-gray/30 text-white hover:bg-ch-light-gray">
                  Conocer CH+
                </a>
              </div>

              {/* Trust bar */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Feature icon={<Shield className="w-5 h-5" />} title="Third-party tested" />
                <Feature icon={<Award className="w-5 h-5" />} title="Premium quality" />
                <Feature icon={<Zap className="w-5 h-5" />} title="Fast results" />
                <Feature icon={<Users className="w-5 h-5" />} title="Trusted by athletes" />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-lg">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-ch-gray/20 bg-ch-dark-gray shadow-3xl">
                  {heroImage ? (
                    <img src={heroImage} alt={items[0]?.name || 'CH+'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-ch-medium-gray" />
                  )}
                </div>
                <div className="absolute -bottom-6 -left-6 bg-ch-dark-gray/80 backdrop-blur border border-ch-gray/30 rounded-2xl p-4 text-sm text-white max-w-[220px]">
                  <p className="font-semibold">Resultados visibles</p>
                  <p className="text-ch-gray mt-1">Programas guiados + suplementación inteligente.</p>
                </div>
                <div className="absolute -top-6 -right-6 bg-ch-dark-gray/80 backdrop-blur border border-ch-gray/30 rounded-2xl p-4 text-sm text-white max-w-[220px]">
                  <p className="font-semibold">Envíos LATAM</p>
                  <p className="text-ch-gray mt-1">Entrega 3-7 días hábiles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section id="products" className="py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-secondary text-white">Productos Destacados</h2>
              <p className="text-ch-gray mt-2">Formulados científicamente para ayudarte a alcanzar tus metas.</p>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center text-ch-primary hover:underline">Ver todos</Link>
          </div>

          {loading && <div className="text-center text-ch-gray">Cargando…</div>}
          {error && !loading && <div className="text-center text-red-400">{error}</div>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {top.map(p => <ProductCard key={p.variant_id} p={p} />)}

            </div>
          )}

          <div className="sm:hidden mt-6 text-center">
            <Link to="/products" className="inline-flex items-center text-ch-primary hover:underline">Ver todos</Link>
          </div>
        </div>
      </section>

      {/* About / Why CH+ */}
      <section id="about" className="py-16 bg-ch-dark-gray">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-secondary text-white">¿Por qué elegir CH+?</h3>
              <p className="text-ch-gray mt-4">
                Combinamos ingredientes de máxima pureza con control de calidad de laboratorio para entregar resultados
                consistentes. Cada lote es analizado y las fórmulas están alineadas con la evidencia científica más reciente.
              </p>
              <ul className="mt-6 space-y-3">
                {['Transparencia de etiquetas', 'Dosis óptimas por porción', 'Sabor y disolución superiores', 'Soporte al cliente 7/7'].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-ch-primary mt-0.5" />
                    <span className="text-white">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/products" className="inline-flex items-center px-6 py-3 rounded-lg bg-ch-primary text-black font-semibold hover:opacity-90">
                  Comprar ahora
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Stat number="99.9%" label="Pureza" />
              <Stat number="50+" label="Estudios" />
              <Stat number="15+" label="Años de I+D" />
              <Stat number="100K+" label="Clientes" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="pqrs" className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ch-primary/20 border border-ch-primary/30">
                <span className="text-ch-primary font-bold">?</span>
              </div>
              <h3 className="mt-4 text-3xl font-secondary text-white">Preguntas frecuentes (PQRS)</h3>
              <p className="text-ch-gray mt-2">
                Resuelve dudas rápidas. Si no ves tu respuesta, contáctanos por WhatsApp o email.
              </p>
            </div>
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-2xl border border-ch-primary/30 bg-gradient-to-r from-ch-primary/10 to-transparent p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-secondary text-white">Potencia tu entrenamiento con CH+</h3>
            <p className="text-ch-gray mt-2">Calidad certificada, envío rápido y atención cercana.</p>
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center px-6 py-3 rounded-lg bg-ch-primary text-black font-semibold hover:opacity-90">
                Explorar catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-ch-gray/90">
      <span className="text-ch-primary">{icon}</span>
      <span className="text-sm">{title}</span>
    </div>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl bg-ch-black border border-ch-gray/20 p-6 text-center">
      <div className="text-3xl font-secondary text-ch-primary">{number}</div>
      <div className="text-ch-gray mt-1">{label}</div>
    </div>
  )
}

/** Util: soporta images como string[] o [{url: string}] */
function pickImage(images: any): string | null {
  // if (!images) return null
  // if (Array.isArray(images) && images.length > 0) {
  //   const first = images[0]
  //   if (typeof first === 'string') return first
  //   if (first?.url) return first.url
  // }
  // if (images?.url) return images.url
  // return null
  return "https://iqeuktsyzrkrbkjiqfvy.supabase.co/storage/v1/object/public/images/Captura%20de%20pantalla%202025-08-11%20a%20la(s)%209.37.53%20p.m..png"
}

const faqItems: AccordionItem[] = [
  {
    id: 'envio',
    question: '¿Tiempos y costo de envío?',
    answer:
      'Enviamos a la mayoría de países de LATAM. Los tiempos típicos son 3–7 días hábiles. Envío gratis por sobre el umbral configurado.',
    defaultOpen: true,
  },
  {
    id: 'creatina',
    question: '¿Cómo tomar la creatina CH+?',
    answer:
      '5g al día, todos los días (entrenes o no). Puedes tomarla post-entreno con agua o junto a carbohidratos para mejorar la absorción.',
  },
  {
    id: 'proteina',
    question: '¿La proteína tiene lactosa?',
    answer:
      'La Whey Isolate CH+ es baja en lactosa gracias al proceso de filtrado. Si eres muy sensible, empieza con 1/2 scoop y evalúa tolerancia.',
  },
  {
    id: 'devoluciones',
    question: '¿Tienen cambios o devoluciones?',
    answer:
      'Sí. 30 días con garantía de satisfacción. Si el producto llega dañado o no estás conforme, escríbenos y lo resolvemos.',
  },
  {
    id: 'pago',
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Mercado Pago (redirección segura), tarjetas de crédito/débito, transferencia bancaria y efectivo según el país.',
  },
]
