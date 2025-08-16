// =============================================
// src/types/product.ts
// =============================================
export type ProductType = 'creatine' | 'protein'

export interface Product {
  id: number
  name: string
  type: ProductType
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  longDescription: string
  features: string[]
  ingredients: string[]
  nutritionFacts: Record<string, string>
  rating: number
  reviews: number
  inStock: number
  servings: number
  flavor?: string
  slug: string
}


