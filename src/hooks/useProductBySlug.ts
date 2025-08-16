import { useEffect, useState } from 'react'
import { getProductBySlugUseCase } from '../container'
import type { CatalogProduct } from '../data/entities/catalog'

/**
 * Hook para obtener un producto del catálogo por `slug` desde Supabase.
 * - SRP: Lógica de data-fetching aislada del componente de UI.
 * - DIP: expone una API estable (`{ product, loading, error }`).
 */
export function useProductBySlug(slug?: string) {
  const [product, setProduct] = useState<CatalogProduct | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    async function load() {
      if (!slug) return
      setLoading(true)
      setError(null)
      try {
        const data = await getProductBySlugUseCase.execute(slug)
        if (isCancelled) return
        setProduct(data ?? null)
      } catch (e: any) {
        if (!isCancelled) setError(e?.message || 'Error cargando producto')
        setProduct(null)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }
    load()
    return () => { isCancelled = true }
  }, [slug])

  return { product, loading, error }
}

export default useProductBySlug


