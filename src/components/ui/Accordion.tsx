import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { AccordionItem } from '../../data/entities/ui';

export default function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="divide-y divide-ch-gray/20 rounded-2xl border border-ch-gray/20 bg-ch-dark-gray overflow-hidden">
      {items.map((it) => (
        <Row key={it.id} item={it} />
      ))}
    </div>
  );
}

function Row({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(!!item.defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-ch-medium-gray transition border border-transparent hover:border-ch-gray/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-ch-primary/40"
        aria-expanded={open}
        aria-controls={`panel-${item.id}`}
      >
        <span className="text-white font-medium">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-ch-primary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={`panel-${item.id}`}
        className={`px-6 py-6 text-ch-gray text-sm ${open ? 'block' : 'hidden'}`}
        role="region"
        aria-labelledby={`button-${item.id}`}
      >
        {item.answer}
      </div>
    </div>
  );
}
