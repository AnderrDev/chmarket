export type CatalogProduct = {
  product_id: string
  slug: string
  name: string
  type: string
  description: string
  long_description: string
  features: string[] | null
  ingredients: string[] | null
  nutrition_facts: Record<string, any> | null
  rating: number | null
  reviews: number | null
  images: any | null         // jsonb: puede ser string[] o [{url,...}]
  // Nuevos campos del esquema/vista
  compare_at_price_cents?: number | null
  currency?: string | null
  is_featured?: boolean | null
  variant_id: string
  variant_label: string
  price_cents: number
  stock: number
  variant_active: boolean
}

// Tipos de la vista unificada `catalog` (una fila por producto)
export type CatalogViewVariant = {
  variant_id: string
  variant_label: string
  sku: string | null
  flavor?: string | null
  size?: string | null
  price_cents: number
  compare_at_price_cents: number | null
  currency: string | null
  stock: number
  low_stock_threshold?: number | null
  is_active: boolean
}

export type CatalogViewRow = {
  product_id: string
  slug: string
  name: string
  type: string
  description: string | null
  long_description: string | null
  images: unknown
  is_featured: boolean | null
  is_active: boolean | null
  variants: CatalogViewVariant[] | null
  min_price_cents: number | null
  min_compare_at_price_cents: number | null
  variant_ids: string[] | null
  rating_avg?: number | null
  reviews_count?: number | null
  features?: string[] | null
  ingredients?: string[] | null
  nutrition_facts?: Record<string, any> | null
}


