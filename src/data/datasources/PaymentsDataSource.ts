import type { PreferencePayload } from '../../services/mp'

export interface PaymentsDataSource {
  createPreference(payload: PreferencePayload): Promise<{
    order_number: string
    preference_id: string
    init_point: string
    sandbox_init_point?: string
    total_cents: number
    currency: string
  }>
}

function getFunctionsBaseUrl(): string {
  const explicit = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '')
  if (explicit) return explicit
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '')
  if (supa) return `${supa}/functions/v1`
  return '/api'
}

export class FunctionsPaymentsDataSource implements PaymentsDataSource {
  async createPreference(payload: PreferencePayload) {
    const base = getFunctionsBaseUrl()
    const url = `${base}/create-preference`
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
      headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY as string
      headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY as string}`
    }
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) })
    if (!res.ok) {
      let msg = 'No se pudo crear la preferencia'
      try {
        const err = await res.json()
        msg = `${err?.error || msg}${err?.detail ? ' – ' + err.detail : ''}`
      } catch {}
      throw new Error(msg)
    }
    return res.json() as Promise<{
      order_number: string
      preference_id: string
      init_point: string
      sandbox_init_point?: string
      total_cents: number
      currency: string
    }>
  }
}


