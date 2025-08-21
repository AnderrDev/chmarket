import React from 'react'
import type { AdminProduct } from '../../data/entities/admin'
import { currency } from '../../utils/format'

type Props = {
  loading: boolean
  error: string | null
  items: AdminProduct[]
  filterType: string
  setFilterType: (v: string) => void
  filterStatus: string
  setFilterStatus: (v: string) => void
  onCreate: () => void
  onEdit: (p: AdminProduct) => void
  onAskDelete: (p: AdminProduct) => void
}

export default function ProductsView({ loading, error, items, filterType, setFilterType, filterStatus, setFilterStatus, onCreate, onEdit, onAskDelete }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <button onClick={onCreate} className="px-3 py-2 rounded bg-white text-black">Nuevo</button>
      </div>

      {error && <div className="text-red-400">{error}</div>}
      {loading ? (
        <div className="text-white/70">Cargando…</div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <label className="space-y-1">
              <span className="block text-xs text-white/70">Tipo</span>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-2 py-1 rounded bg-white/10">
                <option value="">Todos</option>
                <option value="creatine">Creatine</option>
                <option value="protein">Protein</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="block text-xs text-white/70">Estado</span>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-2 py-1 rounded bg-white/10">
                <option value="">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </label>
          </div>
          <div className="overflow-x-auto border border-white/10 rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-left">
                <tr>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Slug</th>
                  <th className="p-2">Tipo</th>
                  <th className="p-2">Precio</th>
                  <th className="p-2">Desc.</th>
                  <th className="p-2">Variantes</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 text-white/70">{p.slug}</td>
                    <td className="p-2 text-white/70">{p.type}</td>
                    <td className="p-2 text-white/70">
                      {p.price_cents ? currency(p.price_cents / 100, 'es-CO', p.currency || 'COP') : '-'}
                      {p.compare_at_price_cents ? (
                        <span className="ml-2 line-through text-white/40">{currency((p.compare_at_price_cents || 0) / 100, 'es-CO', p.currency || 'COP')}</span>
                      ) : null}
                    </td>
                    <td className="p-2 text-white/70">
                      {p.compare_at_price_cents && p.price_cents && p.compare_at_price_cents > p.price_cents
                        ? <span className="text-green-400">{Math.round((1 - p.price_cents / p.compare_at_price_cents) * 100)}%</span>
                        : '-'}
                    </td>
                    <td className="p-2 text-white/70">{p.variants.length}</td>
                    <td className="p-2">{p.is_active ? 'Activo' : 'Inactivo'}</td>
                    <td className="p-2 text-right space-x-2">
                      <button onClick={() => onEdit(p)} className="px-2 py-1 rounded bg-white text-black">Editar</button>
                      <button onClick={() => onAskDelete(p)} className="px-2 py-1 rounded bg-red-500 text-white">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}


