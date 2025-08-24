// src/pages/Home.tsx
import { useMemo } from 'react'
// imports de navegación/íconos locales ya se manejan en componentes
import { useCatalog } from '../hooks/useCatalog'
import { AccordionItem } from '../data/entities/ui'
import Hero from '../components/home/Hero'
import FeaturedProducts from '../components/home/FeaturedProducts'
import WhyCH from '../components/home/WhyCH'
import FAQ from '../components/home/FAQ'
import FinalCTA from '../components/home/FinalCTA'
import SectionDivider from '../components/ui/SectionDivider'

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
      <SectionDivider variant="gradient" />
      <FeaturedProducts products={top} loading={loading} error={error} />
      <SectionDivider variant="gradient" />
      <WhyCH />
      <SectionDivider variant="gradient" />
      <FAQ items={faqItems} />
      <SectionDivider variant="gradient" />
      <FinalCTA />
    </>
  )
}

// componentes locales movidos a `src/components/home/*`

  // pickImage centralizado en utils/catalogAdapter

const faqItems: AccordionItem[] = [
  {
    id: 'envio',
    question: '¿Cuánto cuesta el envío y cuánto tarda?',
    answer:
      'Envío gratis por compras superiores a $150.000. Para compras menores, el costo es de $15.000. Los envíos llegan en 2-4 días hábiles a las principales ciudades y 3-6 días al resto del país.',
    defaultOpen: true,
  },
  {
    id: 'creatina',
    question: '¿Cómo debo tomar la creatina?',
    answer:
      'Toma 5g de creatina todos los días, sin importar si entrenas o no. Puedes tomarla con agua, jugo o en tu batido de proteína. Para mejorar la absorción, tómala con carbohidratos. Los resultados se ven después de 2-4 semanas de uso consistente.',
  },
  {
    id: 'proteina',
    question: '¿La proteína tiene lactosa?',
    answer:
      'Nuestra Whey Isolate es baja en lactosa (menos del 1%) gracias al proceso de microfiltración. Si eres intolerante a la lactosa, empieza con media porción y evalúa tu tolerancia. También ofrecemos opciones veganas sin lactosa.',
  },
  {
    id: 'devoluciones',
    question: '¿Puedo devolver o cambiar productos?',
    answer:
      'Sí, tenemos garantía de satisfacción de 30 días. Si el producto llega dañado, no cumple tus expectativas o tienes alguna reacción, contáctanos y te reembolsamos o cambiamos el producto sin preguntas.',
  },
]
