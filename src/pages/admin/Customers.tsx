import React from 'react'
import CustomersView from './CustomersView'
import { useAdminCustomers } from '../../hooks/useAdminCustomers'
import Modal from '../../components/ui/Modal'
import OrderDetailView from './OrderDetailView'
import { useAdminOrderDetail } from '../../hooks/useAdminOrderDetail'

export default function Customers() {
  const admin = useAdminCustomers()
  const [detail, setDetail] = React.useState<{ open: boolean; orderNumber?: string; email?: string }>({ open: false })
  const [ordersModal, setOrdersModal] = React.useState<{ open: boolean; email?: string }>({ open: false })
  const orderDetail = useAdminOrderDetail(detail.orderNumber, detail.open)
  const [orders, setOrders] = React.useState<Array<{ order_number: string; status: string; payment_status?: string | null; total_cents: number; currency: string; created_at: string }>>([])

  return (
    <>
      <CustomersView
        loading={admin.loading}
        error={admin.error}
        items={admin.items}
        page={admin.page}
        setPage={admin.setPage}
        pageSize={admin.pageSize}
        setPageSize={admin.setPageSize}
        total={admin.total}
        q={admin.q}
        setQ={admin.setQ}
        onView={async (email) => {
          const res = await admin.getDetail(email)
          setOrders(res.orders)
          setOrdersModal({ open: true, email })
        }}
      />

      <Modal open={ordersModal.open} title={`Órdenes de ${ordersModal.email || ''}`} onClose={() => setOrdersModal({ open: false })}>
        <div className="space-y-3">
          <div className="overflow-x-auto border border-white/10 rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-left">
                <tr>
                  <th className="p-2">Orden</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Pago</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.order_number} className="border-t border-white/10">
                    <td className="p-2">{o.order_number}</td>
                    <td className="p-2 text-white/70">{o.status}</td>
                    <td className="p-2 text-white/70">{o.payment_status || '-'}</td>
                    <td className="p-2 text-white/70">{new Date(o.created_at).toLocaleString('es-CO')}</td>
                    <td className="p-2 text-right">
                      <button onClick={() => setDetail({ open: true, orderNumber: o.order_number })} className="px-2 py-1 rounded bg-white text-black">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <Modal open={detail.open} title="Detalle de pedido" onClose={() => setDetail({ open: false })}>
        <OrderDetailView
          loading={orderDetail.loading}
          error={orderDetail.error}
          order={orderDetail.order}
          items={orderDetail.items}
          discounts={orderDetail.discounts}
          onClose={() => setDetail({ open: false })}
        />
      </Modal>
    </>
  )
}


