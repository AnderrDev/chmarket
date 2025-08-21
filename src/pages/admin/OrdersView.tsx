import React from 'react'
import type { Order } from '../../data/entities/order'
import { currency } from '../../utils/format'

type Props = {
  loading: boolean
  error: string | null
  items: Array<Order & { items_count?: number }>
  page: number
  setPage: (n: number) => void
  pageSize: number
  setPageSize: (n: number) => void
  total: number
  status: string
  setStatus: (s: string) => void
  paymentStatus: string
  setPaymentStatus: (s: string) => void
  dateFrom: string
  setDateFrom: (s: string) => void
  dateTo: string
  setDateTo: (s: string) => void
  q: string
  setQ: (s: string) => void
  onView: (orderNumber: string) => void
  onFulfill: (orderNumber: string) => void
  onCancel: (orderNumber: string) => void
  selected: Set<string>
  onToggle: (orderNumber: string) => void
  onToggleAll: (checked: boolean) => void
  onExport: () => void
  onBulkFulfill: () => void
  onBulkCancel: () => void
  busy?: boolean
}

export default function OrdersView({ loading, error, items, page, setPage, pageSize, setPageSize, total, status, setStatus, paymentStatus, setPaymentStatus, dateFrom, setDateFrom, dateTo, setDateTo, q, setQ, onView, onFulfill, onCancel, selected, onToggle, onToggleAll, onExport, onBulkFulfill, onBulkCancel, busy }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const allSelected = items.length > 0 && items.every(o => selected.has(o.order_number))
  const someSelected = items.some(o => selected.has(o.order_number))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <div className="flex items-center gap-2">
          <button onClick={onExport} className="px-3 py-2 rounded border border-white/20">Exportar CSV</button>
          <button onClick={onBulkFulfill} disabled={!someSelected || busy} className="px-3 py-2 rounded border border-white/20 disabled:opacity-50">Marcar enviados</button>
          <button onClick={onBulkCancel} disabled={!someSelected || busy} className="px-3 py-2 rounded bg-red-500 text-white disabled:opacity-50">Cancelar</button>
        </div>
      </div>
      <div className="flex gap-3 items-end">
        <label className="space-y-1">
          <span className="block text-xs text-white/70">Estado</span>
          <select value={status} onChange={e => setStatus(e.target.value)} className="px-2 py-1 rounded bg-white/10">
            <option value="">Todos</option>
            <option value="CREATED">CREATED</option>
            <option value="PAID">PAID</option>
            <option value="FULFILLED">FULFILLED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="block text-xs text-white/70">Estado pago</span>
          <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="px-2 py-1 rounded bg-white/10">
            <option value="">Todos</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="block text-xs text-white/70">Desde</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-2 py-1 rounded bg-white/10" />
        </label>
        <label className="space-y-1">
          <span className="block text-xs text-white/70">Hasta</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-2 py-1 rounded bg-white/10" />
        </label>
        <label className="space-y-1">
          <span className="block text-xs text-white/70">Buscar</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="email u # de orden" className="px-2 py-1 rounded bg-white/10" />
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
                  <th className="p-2 w-10">
                    <input type="checkbox" checked={allSelected} onChange={e => onToggleAll(e.target.checked)} aria-checked={allSelected} />
                  </th>
                  <th className="p-2">Orden</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Pago</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map(o => (
                  <tr key={o.order_number} className="border-t border-white/10">
                    <td className="p-2 w-10">
                      <input type="checkbox" checked={selected.has(o.order_number)} onChange={() => onToggle(o.order_number)} />
                    </td>
                    <td className="p-2">{o.order_number}</td>
                    <td className="p-2 text-white/70">{o.email}</td>
                    <td className="p-2 text-white/70">{o.status}</td>
                    <td className="p-2 text-white/70">{o.payment_status || '-'}</td>
                    <td className="p-2 text-white/70">{o.items_count ?? '-'}</td>
                    <td className="p-2 text-white/70">{currency(o.total_cents / 100, 'es-CO', o.currency || 'COP')}</td>
                    <td className="p-2 text-white/70">{new Date(o.created_at).toLocaleString('es-CO')}</td>
                    <td className="p-2 text-right space-x-2">
                      <button onClick={() => onView(o.order_number)} className="px-2 py-1 rounded bg-white text-black">Ver</button>
                      <button onClick={() => onFulfill(o.order_number)} className="px-2 py-1 rounded border border-white/20">Marcar enviado</button>
                      <button onClick={() => onCancel(o.order_number)} className="px-2 py-1 rounded bg-red-500 text-white">Cancelar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>Página {page} de {pages} — {total} pedidos</div>
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


