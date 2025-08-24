export type OrderStatus = 'CREATED' | 'PAID' | 'FULFILLED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED'

export type Order = {
  id: string
  order_number: string
  email: string
  status: OrderStatus
  payment_status: PaymentStatus
  currency: string
  subtotal_cents: number
  shipping_cents: number
  discount_cents: number
  total_cents: number
  shipping_address?: Record<string, any>
  billing_address?: Record<string, any>
  payment_provider?: string
  payment_preference_id?: string
  payment_id?: string
  payment_external_reference?: string
  payment_raw?: Record<string, any>
  created_at: string
  updated_at: string
}

// El endpoint actual no devuelve un objeto payment; usamos null
export type Payment = null

export type Item = {
  id: string
  order_id: string
  variant_id: string
  product_id: string
  name_snapshot: string
  variant_label: string
  unit_price_cents: number
  quantity: number
}

// Payload para crear preferencias de pago (Mercado Pago)
export type PreferencePayload = {
  items: { variant_id: string; quantity: number }[]
  currency?: string
  email: string
  shippingAddress?: Record<string, unknown>
  billingAddress?: Record<string, unknown>
  couponCode?: string | null
}


