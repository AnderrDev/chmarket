// src/pages/Home.tsx
import { useMemo } from 'react'
// imports de navegación/íconos locales ya se manejan en componentes
import { pickImage } from '../utils/catalogAdapter'
import { useCatalog } from '../hooks/useCatalog'
import { AccordionItem } from '../data/entities/ui'
import Hero from '../components/home/Hero'
import FeaturedProducts from '../components/home/FeaturedProducts'
import WhyCH from '../components/home/WhyCH'
import FAQ from '../components/home/FAQ'
import FinalCTA from '../components/home/FinalCTA'

export default function Home() {
  const { items, loading, error } = useCatalog(24)
  const top = useMemo(() => {
    const featured = items.filter(p => p.is_featured)
    console.log(featured)
    return (featured.length ? featured : items).slice(0, 4)
  }, [items])
  const heroImage = useMemo(() => {
    return  'https://uxhzkpcmufatvrzzuskq.supabase.co/storage/v1/object/public/product-images/Captura%20de%20pantalla%202025-08-11%20a%20la(s)%209.37.53%20p.m..png'
  }, [items])

  return (
    <>
      <Hero imageUrl={heroImage} altText={items[0]?.name || 'CH+'} />
      <FeaturedProducts products={top} loading={loading} error={error} />
      <WhyCH />
      <FAQ items={faqItems} />
      <FinalCTA />
    </>
  )
}

// componentes locales movidos a `src/components/home/*`

  // pickImage centralizado en utils/catalogAdapter

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
