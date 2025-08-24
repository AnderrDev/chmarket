import { Star } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="py-16 lg:py-20 bg-ch-dark-gray">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-secondary text-white mb-6">
            Listo para transformar tu rendimiento
          </h2>
          <p className="text-ch-gray text-lg mb-8 max-w-2xl mx-auto">
            Únete a miles de atletas que ya confían en CH+ para alcanzar sus objetivos. 
            Productos de calidad premium, resultados comprobados.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-ch-gray">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm">4.8 de 5 estrellas</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-ch-gray/30"></div>
            <div className="text-ch-gray text-sm">
              Más de 10,000 clientes satisfechos
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


