import type { Order, Payment, Item } from '../entities/order'

export interface OrdersDataSource {
  fetchOrderSummary(orderNumber: string, email: string): Promise<{ order: Order; payment: Payment; items: Item[] }>
}

function getFunctionsBaseUrl(): string {
  const explicit = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '')
  if (explicit) return explicit
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '')
  if (supa) return `${supa}/functions/v1`
  return '/api'
}

export class FunctionsOrdersDataSource implements OrdersDataSource {
  async fetchOrderSummary(orderNumber: string, email: string) {
    const base = getFunctionsBaseUrl()
    const url = new URL(`${base}/order-status`)
    url.searchParams.set('order_number', orderNumber)
    if (email) url.searchParams.set('email', email)
    const res = await fetch(url.toString(), { method: 'GET' })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ order: Order; payment: Payment; items: Item[] }>
  }
}


