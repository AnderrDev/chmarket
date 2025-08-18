import { useEffect, useState } from 'react'
import { listProductsUseCase } from '../container'
import type { CatalogViewRow } from '../data/entities/catalog'
import type { UseCatalogResult } from '../data/entities/ui'

export function useCatalog(limit = 24): UseCatalogResult {
  const [items, setItems] = useState<CatalogViewRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState<number>(0)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await listProductsUseCase.execute(limit)
        console.log(data);
        
        if (mounted) {
          setItems(data)
          setError(null)
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error cargando productos'
        if (mounted) setError(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [limit, version])

  const reload = () => setVersion(v => v + 1)

  return { items, loading, error, reload }
}


