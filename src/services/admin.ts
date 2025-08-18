// Cliente simple para llamar Edge Functions admin

function getFunctionsBaseUrl(): string {
  const f = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '')
  if (f) return f
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '')
  if (supa) return `${supa}/functions/v1`
  return '/api'
}

const base = getFunctionsBaseUrl()

async function http<T = any>(path: string, init?: RequestInit): Promise<T> {
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

export type AdminProduct = {
  id: string
  slug: string
  name: string
  type: 'creatine' | 'protein'
  description?: string | null
  long_description?: string | null
  images?: any
  is_active: boolean
  is_featured: boolean
  price_cents?: number | null
  compare_at_price_cents?: number | null
  currency?: string | null
  variants: Array<{
    id: string
    product_id: string
    sku: string
    label: string
    price_cents: number
    compare_at_price_cents?: number | null
    currency?: string | null
    in_stock: number
    is_active: boolean
  }>
}

export async function adminListProducts(): Promise<{ items: AdminProduct[] }> {
  return http('/admin-products')
}

export async function adminUpsertProduct(payload: { product: Partial<AdminProduct> & { slug: string; name: string; type: 'creatine' | 'protein' }, variants: Array<Partial<AdminProduct['variants'][number]> & { sku: string; label: string; price_cents: number; in_stock: number }> }): Promise<{ ok: boolean; product_id: string }> {
  return http('/admin-products', { method: 'POST', body: JSON.stringify(payload) })
}

export async function adminDeleteProduct(id: string): Promise<{ ok: boolean }> {
  const qs = new URLSearchParams({ id })
  return http(`/admin-products?${qs.toString()}`, { method: 'DELETE' })
}


