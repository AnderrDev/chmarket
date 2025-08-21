import React from 'react'
import type { Order, Item } from '../data/entities/order'
import { getAdminOrderUseCase } from '../container'

export function useAdminOrderDetail(orderNumber?: string, open?: boolean) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [order, setOrder] = React.useState<Order | null>(null)
  const [items, setItems] = React.useState<Item[]>([])
  const [discounts, setDiscounts] = React.useState<any[]>([])

  const reload = React.useCallback(async () => {
    if (!orderNumber) return
    setLoading(true)
    setError(null)
    try {
      const res = await getAdminOrderUseCase.execute(orderNumber)
      setOrder(res.order)
      setItems(res.items || [])
      setDiscounts(res.discounts || [])
    } catch (e: any) {
      setError(e?.message || 'No se pudo cargar el pedido')
    } finally {
      setLoading(false)
    }
  }, [orderNumber])

  React.useEffect(() => {
    if (open && orderNumber) reload()
  }, [open, orderNumber, reload])

  return { loading, error, order, items, discounts, reload }
}


