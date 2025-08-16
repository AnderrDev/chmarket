export type Order = {
  order_number: string
  email: string
  status: 'CREATED' | 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
  currency: string
  subtotal_cents: number
  shipping_cents: number
  discount_cents: number
  total_cents: number
  created_at: string
}

export type Payment = {
  provider: string
  status: string
  preference_id: string
  external_reference: string
  created_at: string
} | null

export type Item = {
  variant_id: string
  product_id: string
  name_snapshot: string
  variant_label: string
  unit_price_cents: number
  quantity: number
}


