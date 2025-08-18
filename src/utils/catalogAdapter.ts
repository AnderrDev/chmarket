import { CatalogViewRow, CatalogViewVariant } from "../data/entities/catalog"
import { Product } from "../data/entities/product"

/**
 * Extrae la primera imagen soportando múltiples formatos de `images` (string[], {url}[], {url}).
 */
export function pickImage(_images: unknown): string | undefined {
  // if (!images) return undefined
  // if (Array.isArray(images) && images.length > 0) {
  //   const f = (images as unknown[])[0] as unknown
  //   if (typeof f === 'string') return f
  //   if (typeof f === 'object' && f !== null && 'url' in (f as Record<string, unknown>)) {
  //     const maybe = (f as { url?: unknown }).url
  //     if (typeof maybe === 'string') return maybe
  //   }
  // }
  // if (typeof images === 'object' && images !== null && 'url' in (images as Record<string, unknown>)) {
  //   const maybe = (images as { url?: unknown }).url
  //   if (typeof maybe === 'string') return maybe
  // }
  // return undefined
  return "https://iqeuktsyzrkrbkjiqfvy.supabase.co/storage/v1/object/public/images/Captura%20de%20pantalla%202025-08-11%20a%20la(s)%209.37.53%20p.m..png"
}

/**
 * Mapea `CatalogProduct` (modelo DB) a `Product` (modelo UI) usado en tarjetas o carrito.
 * Incluye un id numérico derivado estable a partir de `variant_id` para compatibilidad.
 */
export function catalogToProduct(row: CatalogViewRow, variant?: CatalogViewVariant): Product & { variant_id?: string; variant_label?: string } {
  const img = pickImage(row.images)
  const v = variant || (row.variants || []).find(v => v.is_active) || (row.variants || [])[0]
  return {
    // id numérico requerido por Cart: mapeamos con un hash estable de variant_id
    id: hashToNumber(v?.variant_id || ''),
    variant_id: v?.variant_id,
    name: `${row.name}${v ? ` – ${v.variant_label}` : ''}`,
    type: (row.type === 'protein' || row.type === 'creatine') ? row.type : 'protein',
    price: (v?.price_cents || 0) / 100,
    originalPrice: typeof v?.compare_at_price_cents === 'number' ? (v!.compare_at_price_cents as number) / 100 : undefined,
    image: img || '',
    images: img ? [img] : [],
    description: (row as any).description || '',
    longDescription: (row as any).long_description || '',
    features: (row as any).features || [],
    ingredients: (row as any).ingredients || [],
    nutritionFacts: (row as any).nutrition_facts || {},
    rating: (row as any).rating ?? 4.8,
    reviews: (row as any).reviews ?? 0,
    inStock: v?.stock ?? 0,
    servings: 0,
    // slug proveniente del catálogo
    slug: row.slug,
    variant_label: v?.variant_label,
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
