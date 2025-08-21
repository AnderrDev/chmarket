export interface AdminContentDataSource {
  get(key: string): Promise<{ key: string; data: Record<string, unknown> }>
  set(key: string, data: Record<string, unknown>): Promise<{ ok: true }>
}

function getFunctionsBaseUrl(): string {
  const explicit = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '')
  if (explicit) return explicit
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '')
  if (supa) return `${supa}/functions/v1`
  return '/api'
}

export class FunctionsAdminContentDataSource implements AdminContentDataSource {
  private base = getFunctionsBaseUrl()

  async get(key: string) {
    const url = new URL(`${this.base}/admin-content`)
    url.searchParams.set('key', key)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ key: string; data: Record<string, unknown> }>
  }
  async set(key: string, data: Record<string, unknown>) {
    const res = await fetch(`${this.base}/admin-content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, data }) })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ ok: true }>
  }
}


