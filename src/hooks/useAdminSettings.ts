import React from 'react'
import { getSettingUseCase, setSettingUseCase } from '../container'

export function useAdminSettings<T extends Record<string, unknown> = Record<string, unknown>>(key: string) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [value, setValue] = React.useState<T>({} as T)
  const [saving, setSaving] = React.useState(false)

  const reload = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getSettingUseCase.execute(key)
      setValue(res.value as T)
    } catch (e: any) {
      setError(e?.message || 'No se pudo cargar ajustes')
    } finally {
      setLoading(false)
    }
  }, [key])

  React.useEffect(() => { reload() }, [reload])

  async function save(next: T) {
    setSaving(true)
    try {
      await setSettingUseCase.execute(key, next as unknown as Record<string, unknown>)
      setValue(next)
    } finally {
      setSaving(false)
    }
  }

  return { loading, error, value, setValue, saving, reload, save }
}


