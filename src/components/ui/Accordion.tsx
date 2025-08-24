import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { AccordionItem } from '../../data/entities/ui';

export default function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <Row key={it.id} item={it} />
      ))}
    </div>
  );
}

function Row({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(!!item.defaultOpen);
  
  return (
    <div className="group">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-6 py-5 text-left flex items-center justify-between bg-ch-dark-gray hover:bg-ch-medium-gray transition-all duration-300 border border-ch-gray/20 hover:border-ch-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-ch-primary/40 shadow-sm hover:shadow-md"
        aria-expanded={open}
        aria-controls={`panel-${item.id}`}
      >
        <span className="text-white font-medium text-left pr-4 group-hover:text-ch-primary transition-colors duration-300">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-ch-primary transition-all duration-300 flex-shrink-0 ${
            open ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
          }`}
        />
      </button>
      
      <div
        id={`panel-${item.id}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
        role="region"
        aria-labelledby={`button-${item.id}`}
      >
        <div className="px-6 py-4 bg-ch-dark-gray/50 border border-ch-gray/10 rounded-lg text-ch-gray text-sm leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
}
