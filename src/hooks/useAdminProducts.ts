import React from 'react'
import type { AdminProduct } from '../data/entities/admin'
import { listAdminProductsUseCase, deleteAdminProductUseCase } from '../container'

export function useAdminProducts() {
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState<AdminProduct[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [filterType, setFilterType] = React.useState<string>('')
  const [filterStatus, setFilterStatus] = React.useState<string>('')

  const reload = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await listAdminProductsUseCase.execute()
      setItems(items)
    } catch (e: any) {
      setError(e?.message || 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { reload() }, [reload])

  const filteredItems = React.useMemo(() => {
    return items.filter(p => {
      if (filterType && p.type !== filterType) return false
      if (filterStatus) {
        const wantActive = filterStatus === 'active'
        if ((p.is_active ? 'active' : 'inactive') !== (wantActive ? 'active' : 'inactive')) return false
      }
      return true
    })
  }, [items, filterType, filterStatus])

  async function deleteById(id: string) {
    await deleteAdminProductUseCase.execute(id)
    await reload()
  }

  return {
    loading,
    items,
    error,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filteredItems,
    reload,
    deleteById,
  }
}


