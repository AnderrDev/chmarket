/** Orden almacenada en la tabla `orders`. */
export type Order = {
  order_number: string
  email: string
  status: 'CREATED' | 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
  currency: string
  subtotal_cents: number
  shipping_cents: number
  discount_cents: number
  total_cents: number
  created_at: string
}

/** Último pago asociado a la orden (puede ser null si aún no se generó). */
export type Payment = {
  provider: string
  status: string
  preference_id: string
  external_reference: string
  created_at: string
} | null

export type Item = {
  variant_id: string
  product_id: string
  name_snapshot: string
  variant_label: string
  unit_price_cents: number
  quantity: number
}

/**
 * Consulta el estado de una orden (orden + último pago + items) en la Edge Function `order-status`.
 */
export async function fetchOrderSummary(order_number: string, email: string): Promise<{ order: Order; payment: Payment; items: Item[] }> {
  const base = import.meta.env.VITE_FUNCTIONS_URL as string
  const res = await fetch(`${base}/order-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_number, email }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<{ order: Order; payment: Payment; items: Item[] }>
}
