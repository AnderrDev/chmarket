export type AdminVariant = {
  id: string
  product_id: string
  sku: string
  label: string
  price_cents: number
  compare_at_price_cents?: number | null
  currency?: string | null
  in_stock: number
  is_active: boolean
}

export type AdminProduct = {
  id: string
  slug: string
  name: string
  type: 'creatine' | 'protein'
  description?: string | null
  long_description?: string | null
  images?: any
  is_active: boolean
  is_featured: boolean
  price_cents?: number | null
  compare_at_price_cents?: number | null
  currency?: string | null
  variants: AdminVariant[]
}


