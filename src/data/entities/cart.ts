import type { Product } from './product'

export interface CartItem extends Product {
  quantity: number
  /** Identificador de variante (UUID desde la BD). Opcional para items antiguos/mock. */
  variant_id?: string
}

export interface CartState { items: CartItem[] }

export type CartAction =
  | { type: 'ADD'; product: CartItem } // ← permite traer variant_id
  | { type: 'REMOVE'; key: string }    // ahora eliminamos por “key” (variant_id o id)
  | { type: 'SET_QTY'; key: string; quantity: number }
  | { type: 'CLEAR' }


