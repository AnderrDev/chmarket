// src/pages/Payment.tsx
import { useLocation, useNavigate } from 'react-router-dom'

import { } from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { createPreference } from '../services/mp'
import type { CartItem } from '../types/cart'
import { currency } from '../utils/format'

export default function Payment() {
  const { state } = useLocation() as { state?: any }
  const navigate = useNavigate()
  const { items, total } = useCart()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      // 1) Customer: primero intenta leer del sessionStorage (desde Checkout)
      let customer: null | { firstName?: string; lastName?: string; email?: string } = null
      const stored = sessionStorage.getItem('ch_customer')
      if (stored) {
        try { customer = JSON.parse(stored) } catch {/* ignore */}
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

      const pref = await createPreference(payload)

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
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-ch-primary mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>
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

        {/* Resumen detallado */}
        <div className="bg-ch-dark-gray rounded-2xl p-6 border border-ch-gray/20 h-fit">
          <h2 className="text-xl text-white mb-4">Resumen de pago</h2>
          <div className="space-y-3 mb-4 max-h-[320px] overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={(i as any).variant_id || `id:${i.id}`} className="flex justify-between items-start py-2 border-b border-ch-gray/20">
                <div className="text-sm">
                  <div className="text-white">{i.name}</div>
                  <div className="text-ch-gray">x{i.quantity} · {currency(i.price, 'es-CO', 'COP')} c/u</div>
                </div>
                <div className="text-white font-semibold">{currency(i.price * i.quantity, 'es-CO', 'COP')}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ch-gray">Subtotal</span>
              <span className="text-white font-semibold">{currency(subtotal, 'es-CO', 'COP')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ch-gray">Envío</span>
              <span className="text-ch-gray">Se calcula al crear la preferencia</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ch-gray">Descuento</span>
              <span className="text-white font-semibold">{discountCode ? `Cupón: ${discountCode}` : '—'}</span>
            </div>
            <div className="flex justify-between border-t border-ch-gray/20 pt-2 text-lg">
              <span className="text-white">Total estimado</span>
              <span className="text-ch-primary font-bold">{currency(subtotal, 'es-CO', 'COP')}</span>
            </div>
            <div className="text-xs text-ch-gray">
              El total final puede variar al aplicar envío y descuentos en el siguiente paso.
            </div>
          </div>
          <div className="flex items-center text-xs text-ch-gray mt-4">
            <Shield className="w-4 h-4 mr-2 text-ch-primary" /> Compra protegida por Mercado Pago
          </div>
        </div>
      </div>
    </div>
  )
}

