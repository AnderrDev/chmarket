import type { CatalogViewRow, CatalogViewVariant } from '../entities/catalog'
import { supabase } from '../../lib/supabase'

export interface CatalogDataSource {
  listCatalog(limit?: number): Promise<CatalogViewRow[]>
  getBySlug(slug: string): Promise<CatalogViewRow | null>
  getByVariantId(variantId: string): Promise<CatalogViewRow | null>
}

export class SupabaseCatalogDataSource implements CatalogDataSource {
  constructor(private readonly client = supabase) {}

  async listCatalog(limit: number = 20): Promise<CatalogViewRow[]> {
    // Nueva vista unificada `catalog` (una fila por producto, con variantes agregadas)
    const { data, error } = await this.client
      .from('catalog')
      .select('*')
      .limit(limit)
    if (error) throw error
    const rows = (data || []) as CatalogViewRow[]
    return rows
  }

  async getBySlug(slug: string): Promise<CatalogViewRow | null> {
    const { data, error } = await this.client
      .from('catalog')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    const row = data as CatalogViewRow
    return row
  }

  async getByVariantId(variantId: string): Promise<CatalogViewRow | null> {
    // La vista `catalog` expone `variant_ids` (uuid[]) para resolver el producto por variante
    const { data, error } = await this.client
      .from('catalog')
      .select('*')
      .contains('variant_ids', [variantId])
      .limit(1)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    const row = data as CatalogViewRow
    const variant = (row.variants || []).find(v => v.variant_id === variantId)
    if (!variant) return null
    return row
  }
}

function pickDefaultVariant(row: CatalogViewRow): CatalogViewVariant | undefined {
  // La agregación en SQL ya viene ordenada por precio asc, luego label asc
  return (row.variants || []).find(v => v.is_active) || (row.variants || [])[0]
}

// A partir de ahora, devolvemos el row completo con sus variantes.


