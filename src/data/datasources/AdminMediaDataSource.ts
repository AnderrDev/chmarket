export interface AdminMediaDataSource {
  uploadImage(payload: { fileName: string; contentType: string; dataBase64: string; folder?: string }): Promise<{ url: string; key: string }>
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

export class FunctionsAdminMediaDataSource implements AdminMediaDataSource {
  uploadImage(payload: { fileName: string; contentType: string; dataBase64: string; folder?: string }): Promise<{ url: string; key: string }> {
    return http('/admin-upload', { method: 'POST', body: JSON.stringify(payload) })
  }
}


