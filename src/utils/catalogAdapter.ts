import { CatalogProduct } from "../types/catalog"
import { Product } from "../types/product"

/**
 * Extrae la primera imagen soportando múltiples formatos de `images` (string[], {url}[], {url}).
 */
export function pickImage(images: unknown): string | undefined {
  if (!images) return undefined
  if (Array.isArray(images) && images.length > 0) {
    const f = (images as unknown[])[0] as unknown
    if (typeof f === 'string') return f
    if (typeof f === 'object' && f !== null && 'url' in (f as Record<string, unknown>)) {
      const maybe = (f as { url?: unknown }).url
      if (typeof maybe === 'string') return maybe
    }
  }
  if (typeof images === 'object' && images !== null && 'url' in (images as Record<string, unknown>)) {
    const maybe = (images as { url?: unknown }).url
    if (typeof maybe === 'string') return maybe
  }
  return undefined
}

/**
 * Mapea `CatalogProduct` (modelo DB) a `Product` (modelo UI) usado en tarjetas o carrito.
 * Incluye un id numérico derivado estable a partir de `variant_id` para compatibilidad.
 */
export function catalogToProduct(p: CatalogProduct): Product & { variant_id?: string; variant_label?: string } {
  const img = pickImage(p.images)
  return {
    // id numérico requerido por Cart: mapeamos con un hash estable de variant_id
    id: hashToNumber(p.variant_id),
    variant_id: p.variant_id,
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
    // slug proveniente del catálogo
    slug: p.slug,
    variant_label: p.variant_label,
  }
}

/** Hash simple 32-bit para generar un entero positivo desde un string. */
function hashToNumber(id: string): number {
  // hash simple 32-bit firmado -> número positivo
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return Math.abs(h) || 1
}
