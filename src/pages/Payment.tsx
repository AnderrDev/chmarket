// src/pages/Payment.tsx
import { useLocation, useNavigate } from 'react-router-dom'
//
import BackButton from '../components/common/BackButton'
import { useCart } from '../context/CartContext'
import { createPreferenceUseCase } from '../container'
import type { CartItem } from '../types/cart'
import type { CustomerInfo } from '../types/customer'
import { currency } from '../utils/format'
import OrderSummary from '../components/orders/OrderSummary'

export default function Payment() {
  const { state } = useLocation() as { state?: any }
  const navigate = useNavigate()
  const { items, total } = useCart()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      // 1) Customer: primero intenta leer del sessionStorage (desde Checkout)
      let customer: Partial<CustomerInfo> | null = null
      const stored = sessionStorage.getItem('ch_customer')
      if (stored) {
        try { customer = JSON.parse(stored) as Partial<CustomerInfo> } catch {/* ignore */}
      }
      // fallback: intenta desde location.state (si viniste directo de Checkout)
      if ((!customer || !customer.email) && state?.customer) {
        customer = state.customer
      }
      if (!customer?.email) {
        throw new Error('Falta email del cliente. Vuelve a la pantalla de Checkout.')
      }

      // 2) Armar items para la Edge Function (variant_id + quantity)
      //    Nota: aceptamos variant_id o __variant_id por compatibilidad legacy
      const itemsPayload = items.map((i: CartItem & { __variant_id?: string }) => {
        const variantId = i.variant_id || i.__variant_id
        if (!variantId) {
          throw new Error(`Falta variant_id en el item "${i.name}".`)
        }
        return { variant_id: String(variantId), quantity: Number(i.quantity) }
      })

      // 3) Cupón (si lo usas, pásalo en state o de algún input): la función espera "couponCode"
      const couponCode: string | null =
        (state && typeof state.discount_code === 'string' && state.discount_code.trim()) || null

      // 4) Navega a "procesando" mientras llamamos a la función
      navigate('/processing')

      const payload = {
        items: itemsPayload,
        currency: 'COP',
        external_reference: `CH-${Date.now()}`,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          documentType: customer.documentType,
          documentNumber: customer.documentNumber,
        },
        couponCode, // 👈 nombre exacto que usa tu Edge Function
      }

      const pref = await createPreferenceUseCase.execute(payload)

      // Guarda info útil para la pantalla de confirmación (opcional)
      localStorage.setItem(
        'ch_last_order',
        JSON.stringify({ order_number: pref.order_number, email: customer.email })
      )

      // Redirige a MP
      window.location.href = pref.sandbox_init_point || pref.init_point
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Error creando preferencia')
      // regresa al pago para reintentar
      navigate('/payment')
    }
  }

  const discountCode: string | null = (state && typeof state.discount_code === 'string' && state.discount_code.trim()) || null
  const subtotal = total

  return (
    <div className="container py-10">
      <BackButton className="mb-6" />
      <h1 className="text-3xl font-secondary text-white mb-8">Confirmar y Pagar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-ch-dark-gray rounded-2xl p-6 border border-ch-gray/20">
            <h2 className="text-xl text-white mb-4">Pago con Mercado Pago</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="text-ch-gray text-sm">
                Serás redirigido a Mercado Pago para completar el pago de forma segura.
              </div>

              <button type="submit" className="w-full bg-ch-primary text-black font-semibold py-3 rounded-lg">
                Pagar {currency(total, 'es-CO', 'COP')}
              </button>
            </form>
          </div>
        </div>

        <OrderSummary items={items} subtotal={subtotal} discountCode={discountCode} />
      </div>
    </div>
  )
}

