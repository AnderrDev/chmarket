function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl bg-ch-black border border-ch-gray/20 p-4 lg:p-6 text-center">
      <div className="text-2xl lg:text-3xl font-secondary text-ch-primary">{number}</div>
      <div className="text-ch-gray mt-1 text-sm lg:text-base">{label}</div>
    </div>
  )
}

import { Link } from 'react-router-dom'

export default function WhyCH() {
  return (
    <section id="about" className="py-16 lg:py-20 bg-ch-dark-gray">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-secondary text-white">¿Por qué elegir CH+?</h3>
            <p className="text-ch-gray mt-3 lg:mt-4 text-sm lg:text-base">
              Combinamos ingredientes de máxima pureza con control de calidad de laboratorio para entregar resultados
              consistentes. Cada lote es analizado y las fórmulas están alineadas con la evidencia científica más reciente.
              Cumplimos con todas las regulaciones del INVIMA para garantizar tu seguridad.
            </p>
            <ul className="mt-5 lg:mt-6 space-y-2 lg:space-y-3">
              {[
                'Transparencia total en etiquetas',
                'Dosis óptimas por porción',
                'Sabor y disolución superiores',
                'Soporte al cliente 7 días a la semana'
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-4 lg:w-5 h-4 lg:h-5 text-ch-primary mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="text-white text-sm lg:text-base">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 lg:mt-8">
              <Link to="/products" className="inline-flex items-center px-6 py-3 rounded-lg bg-ch-primary text-black font-semibold hover:opacity-90">
                Comprar ahora
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <Stat number="99.9%" label="Pureza" />
            <Stat number="50+" label="Estudios científicos" />
            <Stat number="15+" label="Años de investigación" />
            <Stat number="10K+" label="Clientes en Colombia" />
          </div>
        </div>
      </div>
    </section>
  )
}


