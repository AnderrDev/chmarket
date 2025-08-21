import React from 'react'
import { listAdminCustomersUseCase, getAdminCustomerUseCase } from '../container'

export function useAdminCustomers() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [items, setItems] = React.useState<Array<{ email: string; orders_count: number; total_spent_cents: number; last_order_at: string; first_order_at: string }>>([])
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)
  const [total, setTotal] = React.useState(0)
  const [q, setQ] = React.useState('')

  const reload = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await listAdminCustomersUseCase.execute({ page, pageSize, q })
      setItems(res.items)
      setTotal(res.total)
    } catch (e: any) {
      setError(e?.message || 'Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, q])

  React.useEffect(() => { reload() }, [reload])

  async function getDetail(email: string) {
    return getAdminCustomerUseCase.execute(email)
  }

  return { loading, error, items, page, setPage, pageSize, setPageSize, total, q, setQ, reload, getDetail }
}


