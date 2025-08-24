import Accordion from '../ui/Accordion'
import type { AccordionItem } from '../../data/entities/ui'

export default function FAQ({ items }: { items: AccordionItem[] }) {
  return (
    <section id="pqrs" className="py-16 lg:py-20 bg-ch-black">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-ch-primary/20 border border-ch-primary/30">
              <span className="text-ch-primary font-bold text-sm lg:text-base">?</span>
            </div>
            <h3 className="mt-3 lg:mt-4 text-2xl lg:text-3xl font-secondary text-white">Preguntas frecuentes (PQRS)</h3>
            <p className="text-ch-gray mt-2 text-sm lg:text-base">
              Resuelve dudas rápidas. Si no ves tu respuesta, contáctanos por WhatsApp o email.
            </p>
          </div>
          <Accordion items={items} />
        </div>
      </div>
    </section>
  )
}


