import React from 'react'
import type { Order, Item } from '../../data/entities/order'
import { currency } from '../../utils/format'

type Props = {
  loading: boolean
  error: string | null
  order: Order | null
  items: Item[]
  discounts: any[]
  onClose: () => void
}

export default function OrderDetailView({ loading, error, order, items, discounts, onClose }: Props) {
  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Pedido {order?.order_number || ''}</div>
        <button onClick={onClose} className="px-2 py-1 rounded border border-white/20">Cerrar</button>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {loading ? (
        <div className="text-white/70">Cargando…</div>
      ) : order ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-white/70 text-xs">Email</div>
              <div>{order.email}</div>
            </div>
            <div>
              <div className="text-white/70 text-xs">Estado</div>
              <div>{order.status} — {order.payment_status || '-'}</div>
            </div>
            <div>
              <div className="text-white/70 text-xs">Fecha</div>
              <div>{new Date(order.created_at).toLocaleString('es-CO')}</div>
            </div>
            <div>
              <div className="text-white/70 text-xs">Resumen</div>
              <div className="text-sm">Items: {totalItems}</div>
              <div className="text-sm">Subtotal: {currency(order.subtotal_cents / 100, 'es-CO', order.currency)}</div>
              <div className="text-sm">Envío: {currency(order.shipping_cents / 100, 'es-CO', order.currency)}</div>
              <div className="text-sm">Descuento: -{currency(order.discount_cents / 100, 'es-CO', order.currency)}</div>
              <div className="text-sm font-semibold">Total: {currency(order.total_cents / 100, 'es-CO', order.currency)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Items</div>
            <div className="overflow-x-auto border border-white/10 rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-left">
                  <tr>
                    <th className="p-2">Producto</th>
                    <th className="p-2">Variante</th>
                    <th className="p-2">Precio</th>
                    <th className="p-2">Cant.</th>
                    <th className="p-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-t border-white/10">
                      <td className="p-2">{it.name_snapshot}</td>
                      <td className="p-2 text-white/70">{it.variant_label}</td>
                      <td className="p-2 text-white/70">{currency(it.unit_price_cents / 100, 'es-CO')}</td>
                      <td className="p-2 text-white/70">{it.quantity}</td>
                      <td className="p-2 text-white/70">{currency((it.unit_price_cents * it.quantity) / 100, 'es-CO')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {discounts?.length ? (
            <div className="space-y-1">
              <div className="font-medium">Descuentos</div>
              {discounts.map((d, idx) => (
                <div key={idx} className="text-sm text-white/80">{d.code_snapshot} — {d.type_snapshot} — -{currency((d.amount_applied_cents || 0) / 100, 'es-CO', order.currency)}</div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}


