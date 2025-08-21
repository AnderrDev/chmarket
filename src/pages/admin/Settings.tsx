import React from 'react'
import { useAdminSettings } from '../../hooks/useAdminSettings'
import { useToast } from '../../context/ToastContext'

export default function Settings() {
  const { showToast } = useToast()
  // Ejemplos de ajustes: tienda y pagos
  const store = useAdminSettings<{ store_name?: string; support_email?: string; shipping_threshold_cents?: number }>('store')
  const mp = useAdminSettings<{ currency?: string }>('payments')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Ajustes</h1>

      <section className="space-y-3 border border-white/10 rounded p-4">
        <div className="text-lg font-semibold">Tienda</div>
        {store.error && <div className="text-red-400 text-sm">{store.error}</div>}
        {store.loading ? (
          <div className="text-white/70">Cargando…</div>
        ) : (
          <div className="space-y-2">
            <label className="space-y-1 block">
              <span className="text-xs text-white/70">Nombre tienda</span>
              <input value={store.value.store_name || ''} onChange={e => store.setValue({ ...store.value, store_name: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10" />
            </label>
            <label className="space-y-1 block">
              <span className="text-xs text-white/70">Email soporte</span>
              <input value={store.value.support_email || ''} onChange={e => store.setValue({ ...store.value, support_email: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10" />
            </label>
            <label className="space-y-1 block">
              <span className="text-xs text-white/70">Umbral envío gratis (cents)</span>
              <input type="number" value={store.value.shipping_threshold_cents ?? 0} onChange={e => store.setValue({ ...store.value, shipping_threshold_cents: Number(e.target.value) })} className="w-full px-2 py-1 rounded bg-white/10" />
            </label>
            <div className="flex items-center justify-end">
              <button onClick={async () => { await store.save(store.value); showToast('Ajustes de tienda guardados', { type: 'success' }) }} disabled={store.saving} className="px-3 py-2 rounded bg-white text-black disabled:opacity-60">{store.saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3 border border-white/10 rounded p-4">
        <div className="text-lg font-semibold">Pagos</div>
        {mp.error && <div className="text-red-400 text-sm">{mp.error}</div>}
        {mp.loading ? (
          <div className="text-white/70">Cargando…</div>
        ) : (
          <div className="space-y-2">
            <label className="space-y-1 block">
              <span className="text-xs text-white/70">Moneda</span>
              <select value={mp.value.currency || 'COP'} onChange={e => mp.setValue({ ...mp.value, currency: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10">
                <option value="COP">COP</option>
              </select>
            </label>
            <div className="flex items-center justify-end">
              <button onClick={async () => { await mp.save(mp.value); showToast('Ajustes de pagos guardados', { type: 'success' }) }} disabled={mp.saving} className="px-3 py-2 rounded bg-white text-black disabled:opacity-60">{mp.saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}


