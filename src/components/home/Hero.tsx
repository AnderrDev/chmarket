import { Shield, Award, Zap, Users, ArrowRight } from 'lucide-react'

type HeroProps = {
  imageUrl: string | null
  altText?: string
}

export default function Hero({ imageUrl, altText = 'CH+' }: HeroProps) {
  return (
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
                {imageUrl ? (
                  <img src={imageUrl} alt={altText} className="w-full h-full object-cover" />
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


