import type { CatalogViewRow } from '../../../data/entities/catalog'

export interface ProductRepository {
  listCatalog(limit?: number): Promise<CatalogViewRow[]>
  getBySlug(slug: string): Promise<CatalogViewRow | null>
  getByVariantId(variantId: string): Promise<CatalogViewRow | null>
}


