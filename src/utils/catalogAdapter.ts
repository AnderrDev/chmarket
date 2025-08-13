import { CatalogProduct } from "../types/catalog"
import { Product } from "../types/product"

/** Soporta images como string[] o [{ url }] */
export function pickImage(images: any): string | undefined {
  if (!images) return undefined
  if (Array.isArray(images) && images.length > 0) {
    const f = images[0]
    if (typeof f === 'string') return f
    if (f?.url) return f.url
  }
  if (images?.url) return images.url
  return undefined
}

/** Mapea CatalogProduct -> Product (para ProductCard y Cart) */
export function catalogToProduct(p: CatalogProduct): Product & { slug?: string } {
  const img = pickImage(p.images)
  return {
    // id numérico requerido por Cart: mapeamos con un hash estable de variant_id
    id: hashToNumber(p.variant_id),
    name: `${p.name} – ${p.variant_label}`,
    type: (p.type === 'protein' || p.type === 'creatine') ? p.type : 'protein',
    price: p.price_cents / 100,
    originalPrice: undefined,
    image: img || '',
    images: img ? [img] : [],
    description: p.description || '',
    longDescription: p.long_description || '',
    features: p.features || [],
    ingredients: p.ingredients || [],
    nutritionFacts: p.nutrition_facts || {},
    rating: p.rating ?? 4.8,
    reviews: p.reviews ?? 0,
    inStock: p.stock ?? 0,
    servings: 0,
    // extra: para que ProductCard genere el link por slug
    slug: p.slug,
  }
}

function hashToNumber(id: string): number {
  // hash simple 32-bit firmado -> número positivo
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return Math.abs(h) || 1
}
