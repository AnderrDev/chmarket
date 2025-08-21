import React from 'react'
import type { Order } from '../data/entities/order'
import { listAdminOrdersUseCase, updateAdminOrderStatusUseCase } from '../container'

export function useAdminOrders() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [items, setItems] = React.useState<Array<Order & { items_count?: number }>>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [total, setTotal] = React.useState(0)
  const [status, setStatus] = React.useState('')
  const [paymentStatus, setPaymentStatus] = React.useState('')
  const [dateFrom, setDateFrom] = React.useState('')
  const [dateTo, setDateTo] = React.useState('')
  const [q, setQ] = React.useState('')

  const reload = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await listAdminOrdersUseCase.execute({ page, pageSize, status, payment_status: paymentStatus, date_from: dateFrom, date_to: dateTo, q })
      setItems(res.items)
      setTotal(res.total)
    } catch (e: any) {
      setError(e?.message || 'Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, status, paymentStatus, dateFrom, dateTo, q])

  React.useEffect(() => { reload() }, [reload])

  async function fulfill(orderNumber: string) {
    await updateAdminOrderStatusUseCase.fulfill(orderNumber)
    await reload()
  }
  async function cancel(orderNumber: string) {
    await updateAdminOrderStatusUseCase.cancel(orderNumber)
    await reload()
  }

  return { loading, error, items, page, setPage, pageSize, setPageSize, total, status, setStatus, paymentStatus, setPaymentStatus, dateFrom, setDateFrom, dateTo, setDateTo, q, setQ, reload, fulfill, cancel }
}


