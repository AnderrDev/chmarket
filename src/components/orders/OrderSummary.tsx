import { currency } from '../../utils/format'
import type { CartItem } from '../../types/cart'

/**
 * Props para `OrderSummary`.
 * - `subtotal` (valor monetario) o `subtotalCents` (en centavos), si ambos se omiten
 *   se calcula a partir de `items`.
 */
type OrderSummaryProps = {
  items: CartItem[]
  subtotalCents?: number
  subtotal?: number
  discountCode?: string | null
  showTotals?: boolean
}

/**
 * Componente presentacional reutilizable de resumen de compra.
 * - Acepta `subtotal` (en moneda) o `subtotalCents`.
 */
export default function OrderSummary({ items, subtotal, subtotalCents, discountCode, showTotals = true }: OrderSummaryProps) {
  const computedSubtotal = typeof subtotal === 'number'
    ? subtotal
    : (typeof subtotalCents === 'number' ? subtotalCents / 100 : items.reduce((acc, i) => acc + i.price * i.quantity, 0))

  return (
    <div className="bg-ch-dark-gray rounded-2xl p-6 border border-ch-gray/20 h-fit">
      <h2 className="text-xl text-white mb-4">Resumen de pago</h2>
      <div className="space-y-3 mb-4 max-h-[320px] overflow-y-auto pr-1">
        {items.map((i) => (
          <div key={(i as any).variant_id || `id:${i.id}`} className="flex justify-between items-start py-2 border-b border-ch-gray/20">
            <div className="text-sm">
              <div className="text-white">{i.name}</div>
              <div className="text-ch-gray">x{i.quantity} · {currency(i.price, 'es-CO', 'COP')} c/u</div>
            </div>
            <div className="text-white font-semibold">{currency(i.price * i.quantity, 'es-CO', 'COP')}</div>
          </div>
        ))}
      </div>

      {showTotals && (
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ch-gray">Subtotal</span>
            <span className="text-white font-semibold">{currency(computedSubtotal, 'es-CO', 'COP')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ch-gray">Envío</span>
            <span className="text-ch-gray">Se calcula al crear la preferencia</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ch-gray">Descuento</span>
            <span className="text-white font-semibold">{discountCode ? `Cupón: ${discountCode}` : '—'}</span>
          </div>
          <div className="flex justify-between border-t border-ch-gray/20 pt-2 text-lg">
            <span className="text-white">Total estimado</span>
            <span className="text-ch-primary font-bold">{currency(computedSubtotal, 'es-CO', 'COP')}</span>
          </div>
          <div className="text-xs text-ch-gray">
            El total final puede variar al aplicar envío y descuentos en el siguiente paso.
          </div>
        </div>
      )}
    </div>
  )
}


