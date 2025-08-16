import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { CartState, CartAction, CartItem } from '../data/entities/cart';
import { Product } from '../data/entities/product';
import { load, save } from '../utils/storage';
import { keyOf } from '../utils/cart'


const STORAGE_KEY = 'ch-plus-cart'
const initialState: CartState = { items: [] }

// Clave estable extraída a util para testear y reutilizar

/**
 * Reducer del carrito. Soporta las acciones: ADD, REMOVE, SET_QTY, CLEAR.
 * Aplica límites de stock y filtra ítems con cantidad 0.
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const k = keyOf(action.product)

      const exists = state.items.find(i => keyOf(i) === k)
      if (exists) {
        const items = state.items.map(i =>
          keyOf(i) === k
            ? { ...i, quantity: Math.min(i.quantity + 1, i.inStock) }
            : i
        )
        return { items }
      }
      return { items: [...state.items, { ...action.product, quantity: action.product.quantity || 1 }] }
    }

    case 'REMOVE': {
      return { items: state.items.filter(i => keyOf(i) !== action.key) }
    }

    case 'SET_QTY': {
      const items = state.items
        .map(i => keyOf(i) === action.key
          ? { ...i, quantity: Math.max(0, Math.min(action.quantity, i.inStock)) }
          : i)
        .filter(i => i.quantity > 0)
      return { items }
    }

    case 'CLEAR':
      return { items: [] }

    default:
      return state
  }
}

type CartContextType = {
  items: CartItem[]
  total: number
  count: number
  add: (p: Omit<CartItem, 'quantity'> | (Product & Partial<Pick<CartItem,'variant_id'>>)) => void
  remove: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (init) => {
      const persisted = load<CartState>(STORAGE_KEY, init)
      // 🔧 Migración: elimina ítems corruptos y normaliza
      const items = Array.isArray(persisted.items)
        ? persisted.items.filter((i: any) => i && typeof i === 'object' && typeof i.price === 'number')
        : []
      return { items }
    }
  )

  useEffect(() => { save(STORAGE_KEY, state) }, [state])

  const value = useMemo<CartContextType>(() => {
    const total = state.items.reduce((t, i) => t + i.price * i.quantity, 0)
    const count = state.items.reduce((t, i) => t + i.quantity, 0)
    return {
      items: state.items,
      total,
      count,
      add: (p) => dispatch({ type: 'ADD', product: { ...(p as any), quantity: 1 } }),
      remove: (key) => dispatch({ type: 'REMOVE', key }),
      setQty: (key, qty) => dispatch({ type: 'SET_QTY', key, quantity: qty }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
