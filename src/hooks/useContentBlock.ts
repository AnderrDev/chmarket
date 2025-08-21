import React from 'react'
import { getContentBlockUseCase } from '../container'

export function useContentBlock<TData extends Record<string, unknown> = Record<string, unknown>>(key: string) {
  const [data, setData] = React.useState<TData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let canceled = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const res = await getContentBlockUseCase.execute(key)
        if (!canceled) setData(res.data as TData)
      } catch (e: any) {
        if (!canceled) setError(e?.message || 'No se pudo cargar contenido')
      } finally {
        if (!canceled) setLoading(false)
      }
    }
    run()
    return () => { canceled = true }
  }, [key])

  return { data, loading, error }
}


