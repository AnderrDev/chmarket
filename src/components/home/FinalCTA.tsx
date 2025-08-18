import { Link } from 'react-router-dom'

export default function FinalCTA() {
  return (
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
  )
}


