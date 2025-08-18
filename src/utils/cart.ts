import type { Keyable } from "../data/entities/cart"

/**
 * Genera la clave estable de un ítem del carrito:
 * - Si tiene `variant_id`, la usa tal cual (string)
 * - Si no, usa `id:<id>` como fallback legacy
 */
export function keyOf(p: Keyable): string {
  if (p.variant_id) return String(p.variant_id)
  if (typeof p.id !== 'undefined') return `id:${p.id}`
  // No debería ocurrir en la app, pero devolvemos un UUID si falta todo
  return (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : `id:${Math.random().toString(36).slice(2)}`
}


