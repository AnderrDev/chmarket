import type { CatalogProduct } from '../../types/catalog'
import { supabase } from '../../lib/supabase'

export interface CatalogDataSource {
  listCatalog(limit?: number): Promise<CatalogProduct[]>
  getBySlug(slug: string): Promise<CatalogProduct | null>
  getByVariantId(variantId: string): Promise<CatalogProduct | null>
}

export class SupabaseCatalogDataSource implements CatalogDataSource {
  constructor(private readonly client = supabase) {}

  async listCatalog(limit: number = 20): Promise<CatalogProduct[]> {
    const { data, error } = await this.client
      .from('catalog_public')
      .select('*')
      .limit(limit)
    if (error) throw error
    return (data || []) as CatalogProduct[]
  }

  async getBySlug(slug: string): Promise<CatalogProduct | null> {
    const { data, error } = await this.client
      .from('catalog_public')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle()
    if (error) throw error
    return data ?? null
  }

  async getByVariantId(variantId: string): Promise<CatalogProduct | null> {
    const { data, error } = await this.client
      .from('catalog_public')
      .select('*')
      .eq('variant_id', variantId)
      .limit(1)
      .maybeSingle()
    if (error) throw error
    return data ?? null
  }
}


