import type { CatalogProduct } from '../../../data/entities/catalog'

export interface ProductRepository {
  listCatalog(limit?: number): Promise<CatalogProduct[]>
  getBySlug(slug: string): Promise<CatalogProduct | null>
  getByVariantId(variantId: string): Promise<CatalogProduct | null>
}


