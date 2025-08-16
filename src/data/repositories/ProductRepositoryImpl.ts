import type { ProductRepository } from '../../domain/repositories/catalog/ProductRepository'
import type { CatalogProduct } from '../../types/catalog'
import type { CatalogDataSource } from '../datasources/CatalogDataSource'

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly ds: CatalogDataSource) {}

  listCatalog(limit: number = 20): Promise<CatalogProduct[]> {
    return this.ds.listCatalog(limit)
  }

  getBySlug(slug: string): Promise<CatalogProduct | null> {
    return this.ds.getBySlug(slug)
  }

  getByVariantId(variantId: string): Promise<CatalogProduct | null> {
    return this.ds.getByVariantId(variantId)
  }
}


