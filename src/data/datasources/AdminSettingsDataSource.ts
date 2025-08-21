export interface AdminSettingsDataSource {
  get(key: string): Promise<{ key: string; value: Record<string, unknown> }>
  set(key: string, value: Record<string, unknown>): Promise<{ ok: true }>
}

function getFunctionsBaseUrl(): string {
  const explicit = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '')
  if (explicit) return explicit
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '')
  if (supa) return `${supa}/functions/v1`
  return '/api'
}

export class FunctionsAdminSettingsDataSource implements AdminSettingsDataSource {
  private base = getFunctionsBaseUrl()
  async get(key: string) {
    const url = new URL(`${this.base}/admin-settings`)
    url.searchParams.set('key', key)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ key: string; value: Record<string, unknown> }>
  }
  async set(key: string, value: Record<string, unknown>) {
    const res = await fetch(`${this.base}/admin-settings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ ok: true }>
  }
}


