// src/pages/Payment.tsx
import { useLocation, useNavigate } from 'react-router-dom'

import { useState } from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { paymentMethods } from '../data/paymentMethods'
import { createPreference } from '../services/mp'
import { PaymentInfo } from '../types/payment'
import { currency } from '../utils/format'

export default function Payment() {
  const { state } = useLocation() as { state?: any }
  const navigate = useNavigate()
  const { items, total } = useCart()

  const [payment, setPayment] = useState<PaymentInfo>({
    method: '',
    installments: 1,
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    documentType: 'DNI',
    documentNumber: '',
  })

  const getMethod = () => paymentMethods.find(m => m.id === payment.method)
  const installmentAmount = () => (total / payment.installments).toFixed(2)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Solo Mercado Pago (lo demás lo podemos simular, pero pediste MP only)
    const method = getMethod()
    if (!method || method.id !== 'mercadopago') {
      alert('Selecciona Mercado Pago para continuar.')
      return
    }

    try {
      // 1) Customer: primero intenta leer del sessionStorage (desde Checkout)
      let customer = null as null | { firstName?: string; lastName?: string; email?: string }
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
      const itemsPayload = items.map((i: any) => {
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

  return (
    <div className="container py-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-ch-primary mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>
      <h1 className="text-3xl font-secondary text-white mb-8">Método de Pago</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-ch-dark-gray rounded-2xl p-6 border border-ch-gray/20">
            <h2 className="text-xl text-white mb-4">Selecciona tu método de pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPayment(s => ({ ...s, method: m.id, installments: 1 }))}
                  className={`p-4 rounded-lg border-2 text-left ${
                    payment.method === m.id ? 'border-ch-primary bg-ch-primary/10' : 'border-ch-gray/30 bg-ch-medium-gray'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <h3 className="text-white text-sm">{m.name}</h3>
                      <p className="text-ch-gray text-xs">{m.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Solo mostramos el bloque de datos cuando hay método seleccionado */}
          {payment.method && (
            <div className="bg-ch-dark-gray rounded-2xl p-6 border border-ch-gray/20">
              <h2 className="text-xl text-white mb-4">Datos de Pago</h2>

              {/* Para MP (redirección), no pedimos tarjeta aquí */}
              {getMethod()?.id === 'mercadopago' ? (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="text-ch-gray text-sm">
                    Serás redirigido a Mercado Pago para completar el pago de forma segura.
                  </div>

                  {/* Documento (si lo quieres guardar para tu orden; MP no lo necesita aquí) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-ch-gray mb-1">Tipo de Documento</label>
                      <select
                        value={payment.documentType}
                        onChange={e => setPayment(s => ({ ...s, documentType: e.target.value }))}
                        className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md"
                      >
                        <option value="DNI">DNI</option>
                        <option value="CUIT">CUIT</option>
                        <option value="CUIL">CUIL</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>
                    <Input
                      label="Número de Documento"
                      value={payment.documentNumber}
                      onChange={v => setPayment(s => ({ ...s, documentNumber: v.replace(/\D/g, '') }))}
                      placeholder="12345678"
                    />
                  </div>

                  <button type="submit" className="w-full bg-ch-primary text-black font-semibold py-3 rounded-lg">
                    Pagar {currency(total, 'es-CO', 'COP')}
                  </button>
                </form>
              ) : (
                // Si selecciona otra cosa, puedes dejar un aviso o simular
                <div className="text-ch-gray text-sm">
                  Selecciona Mercado Pago para continuar.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="bg-ch-dark-gray rounded-2xl p-6 border border-ch-gray/20 h-fit">
          <h2 className="text-xl text-white mb-4">Resumen</h2>
          <div className="flex justify-between items-center text-lg font-bold mb-4">
            <span className="text-white">Total:</span>
            <span className="text-ch-primary">{currency(total, 'es-CO', 'COP')}</span>
          </div>
          {payment.method && payment.installments > 1 && (
            <div className="bg-ch-medium-gray rounded-lg p-3 mb-4 text-ch-gray text-sm">
              {payment.installments} cuotas de{' '}
              <span className="text-white font-semibold">
                {currency(Number(installmentAmount()), 'es-CO', 'COP')}
              </span>
            </div>
          )}
          <div className="flex items-center text-xs text-ch-gray">
            <Shield className="w-4 h-4 mr-2 text-ch-primary" /> Compra protegida por Mercado Pago
          </div>
        </div>
      </div>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  placeholder = '',
  maxLength,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  maxLength?: number
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm text-ch-gray mb-1">{label}</label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md"
        required
      />
    </div>
  )
}
