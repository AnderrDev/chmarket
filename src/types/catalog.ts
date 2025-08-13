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
  variant_id: string
  variant_label: string
  price_cents: number
  stock: number
  variant_active: boolean
}
