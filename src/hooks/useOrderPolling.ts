import { useCallback, useEffect, useRef, useState } from 'react'
import type { Order, Payment, Item } from '../types/order'
import { getOrderSummaryUseCase } from '../container'

/**
 * Parámetros de configuración para `useOrderPolling`.
 */
type UseOrderPollingArgs = {
  orderNumber?: string
  email?: string
  autoStart?: boolean
  maxAttempts?: number
  intervalMs?: number
}

/**
 * Interfaz de retorno de `useOrderPolling`.
 */
type UseOrderPollingReturn = {
  order: Order | null
  payment: Payment | null
  items: Item[]
  loading: boolean
  error: string | null
  attempts: number
  maxAttempts: number
  exhausted: boolean
  startPolling: (reset?: boolean) => void
  reset: () => void
}

/**
 * Hook de polling para consultar estado de una orden.
 * - SRP: manejar ciclo de polling y reintentos.
 * - OCP: configurable vía props sin cambiar implementación.
 * - Expone API controlada para iniciar/reiniciar.
 */
export function useOrderPolling({ orderNumber, email, autoStart = true, maxAttempts = 10, intervalMs = 2000 }: UseOrderPollingArgs): UseOrderPollingReturn {
  const [order, setOrder] = useState<Order | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = null
  }

  const reset = useCallback(() => {
    clearTimer()
    setAttempts(0)
    setError(null)
    setOrder(null)
    setPayment(null)
    setItems([])
  }, [])

  const pollOnce = useCallback(async () => {
    if (!orderNumber || !email) return
    try {
      const res = await getOrderSummaryUseCase.execute(orderNumber, email)
      setOrder(res.order)
      setPayment(res.payment)
      setItems(res.items || [])
      setError(null)
      setLoading(false)

      // Persistimos para futuras vistas
      try {
        localStorage.setItem('ch-last-checkout', JSON.stringify({ order_number: orderNumber, email }))
      } catch {}

      if (res.order.status !== 'PAID' && attempts < maxAttempts) {
        const next = attempts + 1
        setAttempts(next)
        timerRef.current = window.setTimeout(pollOnce, intervalMs)
      }
    } catch (e) {
      if (attempts < maxAttempts) {
        const next = attempts + 1
        setAttempts(next)
        timerRef.current = window.setTimeout(pollOnce, intervalMs)
      } else {
        setLoading(false)
        setError('No pudimos obtener el estado de tu orden. Por favor, intenta nuevamente.')
      }
    }
  }, [orderNumber, email, attempts, maxAttempts, intervalMs])

  const startPolling = useCallback((doReset: boolean = false) => {
    clearTimer()
    if (doReset) {
      setAttempts(0)
      setError(null)
      setOrder(null)
      setPayment(null)
      setItems([])
    }
    if (!orderNumber || !email) return
    setLoading(true)
    pollOnce()
  }, [orderNumber, email, pollOnce])

  useEffect(() => {
    if (autoStart && orderNumber && email) {
      startPolling(true)
    }
    return clearTimer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, email, autoStart])

  const exhausted = !loading && attempts >= maxAttempts && (order?.status !== 'PAID')

  return { order, payment, items, loading, error, attempts, maxAttempts, exhausted, startPolling, reset }
}

export default useOrderPolling


