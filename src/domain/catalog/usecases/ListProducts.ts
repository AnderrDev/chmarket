import type { ProductRepository } from '../../catalog/ProductRepository'
import type { CatalogProduct } from '../../../types/catalog'

export class ListProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(limit: number = 24): Promise<CatalogProduct[]> {
    return this.repository.listCatalog(limit)
  }
}


