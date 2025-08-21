import type { Order, Item } from '../entities/order'

export interface AdminOrdersDataSource {
  list(params?: { page?: number; pageSize?: number; status?: string; payment_status?: string; date_from?: string; date_to?: string; q?: string }): Promise<{ items: Array<Order & { items_count?: number }>; page: number; pageSize: number; total: number }>
  get(orderNumber: string): Promise<{ order: Order; items: Item[]; discounts?: any[] }>
  action(orderNumber: string, action: 'FULFILL' | 'CANCEL'): Promise<{ ok: true }>
}

function getFunctionsBaseUrl(): string {
  const explicit = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '')
  if (explicit) return explicit
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '')
  if (supa) return `${supa}/functions/v1`
  return '/api'
}

export class FunctionsAdminOrdersDataSource implements AdminOrdersDataSource {
  private base = getFunctionsBaseUrl()

  async list(params?: { page?: number; pageSize?: number; status?: string; payment_status?: string; date_from?: string; date_to?: string; q?: string }) {
    const url = new URL(`${this.base}/admin-orders`)
    if (params?.page) url.searchParams.set('page', String(params.page))
    if (params?.pageSize) url.searchParams.set('pageSize', String(params.pageSize))
    if (params?.status) url.searchParams.set('status', params.status)
    if (params?.payment_status) url.searchParams.set('payment_status', params.payment_status)
    if (params?.date_from) url.searchParams.set('date_from', params.date_from)
    if (params?.date_to) url.searchParams.set('date_to', params.date_to)
    if (params?.q) url.searchParams.set('q', params.q)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ items: Array<Order & { items_count?: number }>; page: number; pageSize: number; total: number }>
  }

  async get(orderNumber: string) {
    const url = new URL(`${this.base}/admin-orders`)
    url.searchParams.set('order_number', orderNumber)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ order: Order; items: Item[]; discounts?: any[] }>
  }

  async action(orderNumber: string, action: 'FULFILL' | 'CANCEL') {
    const res = await fetch(`${this.base}/admin-orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_number: orderNumber, action }) })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ ok: true }>
  }
}


