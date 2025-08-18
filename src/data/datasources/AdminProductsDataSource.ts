import type { AdminProduct } from '../entities/admin'

export interface AdminProductsDataSource {
  list(): Promise<{ items: AdminProduct[] }>
  upsert(payload: { product: Partial<AdminProduct> & { slug: string; name: string; type: 'creatine' | 'protein' }, variants: Array<Partial<AdminProduct['variants'][number]> & { sku: string; label: string; price_cents: number; in_stock: number }> }): Promise<{ ok: boolean; product_id: string }>
  remove(id: string): Promise<{ ok: boolean }>
}

function getFunctionsBaseUrl(): string {
  const f = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '')
  if (f) return f
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '')
  if (supa) return `${supa}/functions/v1`
  return '/api'
}

async function http<T = any>(path: string, init?: RequestInit): Promise<T> {
  const base = getFunctionsBaseUrl()
  const url = `${base}${path}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY as string
    headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY as string}`
  }
  const res = await fetch(url, { ...init, headers: { ...headers, ...(init?.headers || {}) } })
  if (!res.ok) {
    let msg = 'Error de servidor'
    try { const j = await res.json(); msg = j?.error || msg } catch {}
    throw new Error(msg)
  }
  return res.json() as Promise<T>
}

export class FunctionsAdminProductsDataSource implements AdminProductsDataSource {
  async list(): Promise<{ items: AdminProduct[] }> {
    return http('/admin-products')
  }

  async upsert(payload: { product: Partial<AdminProduct> & { slug: string; name: string; type: 'creatine' | 'protein' }, variants: Array<Partial<AdminProduct['variants'][number]> & { sku: string; label: string; price_cents: number; in_stock: number }> }): Promise<{ ok: boolean; product_id: string }> {
    return http('/admin-products', { method: 'POST', body: JSON.stringify(payload) })
  }

  async remove(id: string): Promise<{ ok: boolean }> {
    const qs = new URLSearchParams({ id })
    return http(`/admin-products?${qs.toString()}`, { method: 'DELETE' })
  }
}


