// src/services/mp.ts
import type { PreferencePayload } from "../data/entities/order"

// Detecta el endpoint de Functions:
// - En local puedes usar un proxy /api si lo tienes
// - En prod usa la URL de Supabase Functions: VITE_SUPABASE_URL + '/functions/v1'
/**
 * Detecta la base URL de Functions según entorno.
 * 1) Usa `VITE_FUNCTIONS_BASE_URL` si está.
 * 2) Si no, compone a partir de `VITE_SUPABASE_URL`.
 * 3) Fallback a `/api` (útil con proxy local).
 */
function getFunctionsBaseUrl(): string {
  const f = import.meta.env.VITE_FUNCTIONS_BASE_URL?.toString().replace(/\/+$/, '');
  if (f) return f; // p.ej: https://<project>.supabase.co/functions/v1
  const supa = import.meta.env.VITE_SUPABASE_URL?.toString().replace(/\/+$/, '');
  if (supa) return `${supa}/functions/v1`;
  // fallback a proxy local si lo tenías
  return '/api';
}

/**
 * Crea una preferencia de Mercado Pago mediante la Edge Function.
 * Devuelve `order_number`, `preference_id` y URL de redirección.
 */
export async function createPreference(payload: PreferencePayload): Promise<{
  order_number: string;
  preference_id: string;
  init_point: string;
  sandbox_init_point?: string;
}> {
  const base = getFunctionsBaseUrl();
  const url = `${base}/create-preference`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // Si quieres, puedes incluir el anon key (no es necesario si la función está sin verify-jwt).
  if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
    headers['apikey'] = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY as string}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = 'No se pudo crear la preferencia';
    try {
      const err = await res.json();
      msg = `${err?.error || msg}${err?.detail ? ' – ' + err.detail : ''}`;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return res.json() as Promise<{
    order_number: string;
    preference_id: string;
    init_point: string;
    sandbox_init_point?: string;
  }>; 
}
