export type Order = {
  order_number: string
  email: string
  status: 'CREATED' | 'PAID' | 'FULFILLED' | 'CANCELLED' | 'REFUNDED'
  payment_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED'
  currency: string
  subtotal_cents: number
  shipping_cents: number
  discount_cents: number
  total_cents: number
  created_at: string
}

// El endpoint actual no devuelve un objeto payment; usamos null
export type Payment = null

export type Item = {
  variant_id: string
  product_id: string
  name_snapshot: string
  variant_label: string
  unit_price_cents: number
  quantity: number
}


