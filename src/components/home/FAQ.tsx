import Accordion from '../ui/Accordion'
import type { AccordionItem } from '../../data/entities/ui'

export default function FAQ({ items }: { items: AccordionItem[] }) {
  return (
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
          <Accordion items={items} />
        </div>
      </div>
    </section>
  )
}


