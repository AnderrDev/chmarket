import React from 'react'
import { getContentBlockUseCase, setContentBlockUseCase } from '../container'

export function useAdminContent(key: string) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<Record<string, unknown>>({})
  const [saving, setSaving] = React.useState(false)

  const reload = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getContentBlockUseCase.execute(key)
      setData(res.data || {})
    } catch (e: any) {
      setError(e?.message || 'No se pudo cargar el contenido')
    } finally {
      setLoading(false)
    }
  }, [key])

  React.useEffect(() => { reload() }, [reload])

  async function save(next: Record<string, unknown>) {
    setSaving(true)
    try {
      await setContentBlockUseCase.execute(key, next)
      setData(next)
    } finally {
      setSaving(false)
    }
  }

  return { loading, error, data, setData, saving, reload, save }
}


