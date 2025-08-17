import { useEffect, useMemo, useState } from 'react'
import { Check, Shield, RotateCcw } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { currency } from '../utils/format'
import useOrderPolling from '../hooks/useOrderPolling'


export default function Confirmation() {
  const { search, pathname } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])

  const [error, setError] = useState<string | null>(null)

  // email fallback
  const [emailInput, setEmailInput] = useState('')
  const [askEmail, setAskEmail] = useState(false)
  const [submittingEmail, setSubmittingEmail] = useState(false)

  // 1) order_number
  const orderNumberFromQuery =
    params.get('external_reference') || params.get('preference_id') || ''
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem('ch_last_order') || '{}') }
    catch { return {} }
  })() as { order_number?: string; email?: string }

  // 2) email
  const emailFromQuery = params.get('email') || ''
  const [effectiveEmail, setEffectiveEmail] = useState<string>(
    emailFromQuery || stored.email || ''
  )

  const orderNumber = orderNumberFromQuery || stored.order_number || ''
  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e)

  // decide si pedimos email o arrancamos búsqueda
  useEffect(() => {
    if (!orderNumber) {
      setError('No encontramos el número de orden. Verifica el enlace o intenta desde el mismo navegador del pago.')
      setAskEmail(false)
      return
    }
    if (effectiveEmail && isValidEmail(effectiveEmail)) {
      setAskEmail(false)
      return
    }
    if (emailFromQuery && !isValidEmail(emailFromQuery)) {
      setEffectiveEmail('')
    }
    setAskEmail(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber])

  const { order, items, loading, attempts, maxAttempts, exhausted, startPolling, error: pollingError } = useOrderPolling({
    orderNumber,
    email: effectiveEmail,
    autoStart: Boolean(orderNumber && effectiveEmail && isValidEmail(effectiveEmail)),
    maxAttempts: 10,
    intervalMs: 2000,
  })

  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber) {
      setError('No encontramos el número de orden para asociar tu email.')
      return
    }
    if (!isValidEmail(emailInput)) {
      setError('Por favor ingresa un email válido.')
      return
    }
    setSubmittingEmail(true)
    try {
      setEffectiveEmail(emailInput)
      setAskEmail(false)
      startPolling(true)
    } finally {
      setSubmittingEmail(false)
    }
  }

  const paid = order?.status === 'PAID'
  const title = pathname === '/failure'
    ? '¡Pago Rechazado!'
    : paid ? '¡Pago Confirmado!' : 'Procesando pago…'

  const exhaustedLocal = !paid && exhausted

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className={`rounded-full w-20 h-20 mx-auto mb-6 grid place-items-center border ${paid ? 'bg-ch-primary/20 border-ch-primary/30' : 'bg-ch-dark-gray border-ch-gray/20'}`}>
          <Check className={`w-10 h-10 ${paid ? 'text-ch-primary' : 'text-ch-gray'}`} />
        </div>

        <h1 className="text-3xl text-white mb-2">{title}</h1>

        {/* Pedir email si hace falta */}
        {askEmail && (
          <div className="bg-ch-dark-gray rounded-lg p-6 mb-6 border border-ch-gray/20 text-left max-w-md mx-auto">
            <p className="text-ch-gray mb-3">
              Para mostrar tu comprobante, ingresa el email con el que hiciste la compra.
            </p>
            <form onSubmit={onSubmitEmail} className="space-y-3">
              <div>
                <label className="block text-sm text-ch-gray mb-1">Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submittingEmail}
                className="w-full bg-ch-primary text-black font-semibold py-2 rounded-lg disabled:opacity-60"
              >
                {submittingEmail ? 'Validando…' : 'Ver mi comprobante'}
              </button>
            </form>
          </div>
        )}

        {!askEmail && loading && (
          <p className="text-ch-gray mb-6">Consultando estado… (intento {attempts + 1}/{maxAttempts})</p>
        )}
        {(error || pollingError) && <p className="text-ch-primary mb-4">{error || pollingError}</p>}

        {/* Botón de Reintentar manual si se agotaron intentos o hay error */}
        {!askEmail && exhaustedLocal && (
          <div className="mb-6">
            <button
              onClick={() => effectiveEmail && startPolling(true)}
              className="inline-flex items-center gap-2 bg-ch-primary text-black px-4 py-2 rounded-lg font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reintentar ahora
            </button>
            <p className="text-ch-gray text-sm mt-2">
              Si el pago fue aprobado hace poco, podría tardar unos segundos en reflejarse.
            </p>
          </div>
        )}

        {order && (
          <div className="bg-ch-dark-gray rounded-lg p-6 mb-6 border border-ch-gray/20 text-left">
            <p className="text-lg text-white">
              Número de Orden: <span className="text-ch-primary">{order.order_number}</span>
            </p>

            <div className="mt-4 grid gap-2 text-sm">
              <Row label="Subtotal" value={currency(order.subtotal_cents / 100, 'es-CO', 'COP')} />
              <Row label="Envío" value={currency(order.shipping_cents / 100, 'es-CO', 'COP')} />
              {order.discount_cents > 0 && (
                <Row label="Descuento" value={`-${currency(order.discount_cents / 100, 'es-CO', 'COP')}`} />
              )}
              <div className="flex justify-between border-t border-ch-gray/20 pt-2 text-lg">
                <span className="text-white">Total</span>
                <span className="text-ch-primary font-bold">{currency(order.total_cents / 100, 'es-CO', 'COP')}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-ch-medium-gray rounded-lg text-sm">
              <Row label="Estado del Pago" value={order.payment_status || order.status} tight />
              <Row label="Método de Pago" value={'MercadoPago'} tight />
            </div>

            {items.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white mb-2">Productos</h3>
                <ul className="space-y-2">
                  {items.map((it) => (
                    <li key={`${it.variant_id}-${it.product_id}`} className="flex justify-between text-sm">
                      <span className="text-ch-gray">{it.name_snapshot} – {it.variant_label} ×{it.quantity}</span>
                      <span className="text-white font-semibold">
                        {currency((it.unit_price_cents * it.quantity) / 100, 'es-CO', 'COP')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center text-xs text-ch-gray mt-3">
              <Shield className="w-4 h-4 mr-2 text-ch-primary" /> Compra protegida por MercadoPago
            </div>
          </div>
        )}

        <Link to="/" className="inline-block bg-ch-primary text-black px-6 py-3 rounded-lg font-semibold">
          Seguir Comprando
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value, tight = false }: { label: string; value: string; tight?: boolean }) {
  return (
    <div className={`flex justify-between ${tight ? '' : 'py-0.5'}`}>
      <span className="text-ch-gray">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  )
}
