import React from 'react'
import { currency } from '../../utils/format'

type Row = { email: string; orders_count: number; total_spent_cents: number; last_order_at: string; first_order_at: string }

type Props = {
  loading: boolean
  error: string | null
  items: Row[]
  page: number
  setPage: (n: number) => void
  pageSize: number
  setPageSize: (n: number) => void
  total: number
  q: string
  setQ: (s: string) => void
  onView: (email: string) => void
}

export default function CustomersView({ loading, error, items, page, setPage, pageSize, setPageSize, total, q, setQ, onView }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
      </div>
      <div className="flex gap-3 items-end">
        <label className="space-y-1">
          <span className="block text-xs text-white/70">Buscar</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="email" className="px-2 py-1 rounded bg-white/10" />
        </label>
      </div>
      {error && <div className="text-red-400">{error}</div>}
      {loading ? (
        <div className="text-white/70">Cargando…</div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto border border-white/10 rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-left">
                <tr>
                  <th className="p-2">Email</th>
                  <th className="p-2">Órdenes</th>
                  <th className="p-2">Gastado</th>
                  <th className="p-2">Última orden</th>
                  <th className="p-2">Primera orden</th>
                  <th className="p-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.email} className="border-t border-white/10">
                    <td className="p-2">{r.email}</td>
                    <td className="p-2 text-white/70">{r.orders_count}</td>
                    <td className="p-2 text-white/70">{currency(r.total_spent_cents / 100, 'es-CO', 'COP')}</td>
                    <td className="p-2 text-white/70">{new Date(r.last_order_at).toLocaleString('es-CO')}</td>
                    <td className="p-2 text-white/70">{new Date(r.first_order_at).toLocaleString('es-CO')}</td>
                    <td className="p-2 text-right">
                      <button onClick={() => onView(r.email)} className="px-2 py-1 rounded bg-white text-black">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>Página {page} de {pages} — {total} clientes</div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))} className="px-2 py-1 rounded border border-white/20 disabled:opacity-50">Anterior</button>
              <button disabled={page >= pages} onClick={() => setPage(Math.min(pages, page + 1))} className="px-2 py-1 rounded border border-white/20 disabled:opacity-50">Siguiente</button>
              <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="px-2 py-1 rounded bg-white/10">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


