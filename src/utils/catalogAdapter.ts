import { CatalogViewRow, CatalogViewVariant } from "../data/entities/catalog"
import { Product } from "../data/entities/product"

/**
 * Extrae la primera imagen soportando múltiples formatos de `images` (string[], {url}[], {url}).
 */
export function pickImage(images: unknown): string | undefined {
  if (!images) return undefined
  
  // Si es un array
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0]
    if (typeof first === 'string') return first
    if (typeof first === 'object' && first !== null && 'url' in (first as Record<string, unknown>)) {
      const maybe = (first as { url?: unknown }).url
      if (typeof maybe === 'string') return maybe
    }
  }
  
  // Si es un objeto con url
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
export function catalogToProduct(row: CatalogViewRow, variant?: CatalogViewVariant): Product & { variant_id?: string; variant_label?: string } {
  const img = pickImage(row.default_images || row.product_images)
  const v = variant || (row.variants || []).find(v => v.is_default && v.is_active) || (row.variants || [])[0]
  return {
    // id numérico requerido por Cart: mapeamos con un hash estable de variant_id
    id: hashToNumber(v?.variant_id || ''),
    variant_id: v?.variant_id,
    name: `${row.name}${v ? ` – ${v.label}` : ''}`,
    type: (row.type === 'protein' || row.type === 'creatine') ? row.type : 'protein',
    price: (v?.price_cents || 0) / 100,
    originalPrice: typeof v?.compare_at_price_cents === 'number' ? (v!.compare_at_price_cents as number) / 100 : undefined,
    image: img || '',
    images: img ? [img] : [],
    description: row.description || '',
    longDescription: row.long_description || '',
    features: row.features || [],
    ingredients: row.ingredients || [],
    nutritionFacts: row.nutrition_facts || {},
    rating: 4.8, // Valor por defecto ya que no está en la nueva estructura
    reviews: 0, // Valor por defecto ya que no está en la nueva estructura
    inStock: v?.stock ?? 0,
    servings: 0,
    // slug proveniente del catálogo
    slug: row.slug,
    variant_label: v?.label,
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
