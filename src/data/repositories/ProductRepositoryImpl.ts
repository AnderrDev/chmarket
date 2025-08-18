import type { ProductRepository } from '../../domain/repositories/catalog/ProductRepository'
import type { CatalogViewRow } from '../entities/catalog'
import type { CatalogDataSource } from '../datasources/CatalogDataSource'

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly ds: CatalogDataSource) {}

  listCatalog(limit: number = 20): Promise<CatalogViewRow[]> {
    return this.ds.listCatalog(limit)
  }

  getBySlug(slug: string): Promise<CatalogViewRow | null> {
    return this.ds.getBySlug(slug)
  }

  getByVariantId(variantId: string): Promise<CatalogViewRow | null> {
    return this.ds.getByVariantId(variantId)
  }
}


