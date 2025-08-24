import { Shield, Award, Zap, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type HeroProps = {
  imageUrl: string
  altText?: string
}

export default function Hero({ imageUrl, altText = 'CH+' }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-ch-black to-ch-dark-gray/80 border-b border-ch-gray/10">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-ch-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-ch-primary/5 blur-3xl" />
      </div>
      <div className="container pt-16 pb-16 lg:pt-20 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-secondary leading-tight text-white">
              Potencia tu <span className="text-ch-primary">rendimiento</span>
            </h1>
            <p className="mt-3 lg:mt-4 text-base lg:text-lg text-ch-gray max-w-xl">
              Suplementos premium de creatina y proteína diseñados para atletas colombianos que exigen resultados reales y calidad certificada.
            </p>
            <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-ch-primary text-black font-semibold hover:opacity-90">
                Ver productos <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="#about" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-ch-gray/30 text-white hover:bg-ch-light-gray">
                Conocer CH+
              </a>
            </div>

            <div className="mt-8 lg:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Feature icon={<Shield className="w-5 h-5" />} title="Certificado INVIMA" />
              <Feature icon={<Award className="w-5 h-5" />} title="Calidad premium" />
              <Feature icon={<Zap className="w-5 h-5" />} title="Resultados rápidos" />
              <Feature icon={<Users className="w-5 h-5" />} title="Atletas confían" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-md lg:max-w-lg">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-ch-gray/20 bg-ch-dark-gray shadow-3xl">
                <img 
                  src={imageUrl} 
                  alt={altText} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback a imagen placeholder si la imagen falla
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-product.svg'
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-ch-dark-gray/80 backdrop-blur border border-ch-gray/30 rounded-2xl p-4 text-sm text-white max-w-[220px]">
                <p className="font-semibold">Resultados comprobados</p>
                <p className="text-ch-gray mt-1">Programas guiados + suplementación inteligente para atletas colombianos.</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-ch-dark-gray/80 backdrop-blur border border-ch-gray/30 rounded-2xl p-4 text-sm text-white max-w-[220px]">
                <p className="font-semibold">Envío a Colombia</p>
                <p className="text-ch-gray mt-1">Entrega 2-4 días hábiles a todo el país.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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


