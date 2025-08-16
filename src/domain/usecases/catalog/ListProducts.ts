import type { ProductRepository } from '../../repositories/catalog/ProductRepository'
import type { CatalogProduct } from '../../../types/catalog'

export class ListProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(limit: number = 24): Promise<CatalogProduct[]> {
    return this.repository.listCatalog(limit)
  }
}


