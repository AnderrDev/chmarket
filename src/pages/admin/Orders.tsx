import React from 'react'
import OrdersView from './OrdersView'
import { useAdminOrders } from '../../hooks/useAdminOrders'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/ui/Modal'
import { useAdminOrderDetail } from '../../hooks/useAdminOrderDetail'
import OrderDetailView from './OrderDetailView'

export default function Orders() {
  const admin = useAdminOrders()
  const { showToast } = useToast()
  const [confirm, setConfirm] = React.useState<{ open: boolean; action: 'FULFILL' | 'CANCEL' | null; orderNumber?: string }>({ open: false, action: null })
  const [detail, setDetail] = React.useState<{ open: boolean; orderNumber?: string }>({ open: false })
  const detailHook = useAdminOrderDetail(detail.orderNumber, detail.open)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    // Limpiar selección si cambia la lista
    setSelected(prev => new Set([...prev].filter(id => admin.items.some(o => o.order_number === id))))
  }, [admin.items])

  return (
    <>
      <OrdersView
        loading={admin.loading}
        error={admin.error}
        items={admin.items}
        page={admin.page}
        setPage={admin.setPage}
        pageSize={admin.pageSize}
        setPageSize={admin.setPageSize}
        total={admin.total}
        status={admin.status}
        setStatus={admin.setStatus}
        paymentStatus={admin.paymentStatus}
        setPaymentStatus={admin.setPaymentStatus}
        dateFrom={admin.dateFrom}
        setDateFrom={admin.setDateFrom}
        dateTo={admin.dateTo}
        setDateTo={admin.setDateTo}
        q={admin.q}
        setQ={admin.setQ}
        onView={(orderNumber) => setDetail({ open: true, orderNumber })}
        onFulfill={(orderNumber) => setConfirm({ open: true, action: 'FULFILL', orderNumber })}
        onCancel={(orderNumber) => setConfirm({ open: true, action: 'CANCEL', orderNumber })}
        selected={selected}
        onToggle={(orderNumber) => setSelected(prev => {
          const next = new Set(prev)
          if (next.has(orderNumber)) next.delete(orderNumber); else next.add(orderNumber)
          return next
        })}
        onToggleAll={(checked) => setSelected(checked ? new Set(admin.items.map(o => o.order_number)) : new Set())}
        onExport={() => {
          const headers = ['order_number','email','status','payment_status','items_count','total_cents','currency','created_at']
          const rows = admin.items.map(o => [o.order_number, o.email, o.status, o.payment_status ?? '', String(o.items_count ?? ''), String(o.total_cents), o.currency, o.created_at])
          const csv = [headers.join(','), ...rows.map(r => r.map(v => typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g,'""')}"` : v).join(','))].join('\n')
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `orders_page${admin.page}.csv`
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(url)
        }}
        onBulkFulfill={async () => {
          try {
            setBusy(true)
            for (const id of selected) { await admin.fulfill(id) }
            setSelected(new Set())
            showToast('Pedidos marcados como enviados', { type: 'success' })
          } catch (e: any) {
            showToast(e?.message || 'No se pudieron actualizar algunos pedidos', { type: 'error' })
          } finally {
            setBusy(false)
          }
        }}
        onBulkCancel={async () => {
          try {
            setBusy(true)
            for (const id of selected) { await admin.cancel(id) }
            setSelected(new Set())
            showToast('Pedidos cancelados', { type: 'success' })
          } catch (e: any) {
            showToast(e?.message || 'No se pudieron cancelar algunos pedidos', { type: 'error' })
          } finally {
            setBusy(false)
          }
        }}
        busy={busy}
      />

      <ConfirmDialog
        open={confirm.open}
        title={confirm.action === 'FULFILL' ? 'Marcar como enviado' : 'Cancelar pedido'}
        description={confirm.action === 'FULFILL' ? `¿Marcar el pedido ${confirm.orderNumber} como FULFILLED?` : `¿Cancelar el pedido ${confirm.orderNumber}?`}
        variant={confirm.action === 'CANCEL' ? 'danger' : 'default'}
        onCancel={() => setConfirm({ open: false, action: null })}
        onConfirm={async () => {
          try {
            if (confirm.action === 'FULFILL') await admin.fulfill(confirm.orderNumber!)
            if (confirm.action === 'CANCEL') await admin.cancel(confirm.orderNumber!)
            showToast('Pedido actualizado', { type: 'success' })
          } catch (e: any) {
            showToast(e?.message || 'No se pudo actualizar', { type: 'error' })
          } finally {
            setConfirm({ open: false, action: null })
          }
        }}
      />

      <Modal open={detail.open} title="Detalle de pedido" onClose={() => setDetail({ open: false })}>
        <OrderDetailView
          loading={detailHook.loading}
          error={detailHook.error}
          order={detailHook.order}
          items={detailHook.items}
          discounts={detailHook.discounts}
          onClose={() => setDetail({ open: false })}
        />
      </Modal>
    </>
  )
}


