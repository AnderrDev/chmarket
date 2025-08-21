export interface AdminCustomersDataSource {
  list(params?: { page?: number; pageSize?: number; q?: string }): Promise<{ items: Array<{ email: string; orders_count: number; total_spent_cents: number; last_order_at: string; first_order_at: string }>; page: number; pageSize: number; total: number }>
  get(email: string): Promise<{ email: string; orders: Array<{ order_number: string; status: string; payment_status?: string | null; total_cents: number; currency: string; created_at: string }> }>
}

function getFunctionsBaseUrl(): string {
  const explicit = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '')
  if (explicit) return explicit
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '')
  if (supa) return `${supa}/functions/v1`
  return '/api'
}

export class FunctionsAdminCustomersDataSource implements AdminCustomersDataSource {
  private base = getFunctionsBaseUrl()

  async list(params?: { page?: number; pageSize?: number; q?: string }) {
    const url = new URL(`${this.base}/admin-customers`)
    if (params?.page) url.searchParams.set('page', String(params.page))
    if (params?.pageSize) url.searchParams.set('pageSize', String(params.pageSize))
    if (params?.q) url.searchParams.set('q', params.q)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ items: Array<{ email: string; orders_count: number; total_spent_cents: number; last_order_at: string; first_order_at: string }>; page: number; pageSize: number; total: number }>
  }

  async get(email: string) {
    const url = new URL(`${this.base}/admin-customers`)
    url.searchParams.set('email', email)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ email: string; orders: Array<{ order_number: string; status: string; payment_status?: string | null; total_cents: number; currency: string; created_at: string }> }>
  }
}


