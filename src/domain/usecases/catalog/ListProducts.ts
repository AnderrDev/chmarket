import type { ProductRepository } from '../../repositories/catalog/ProductRepository'
import type { CatalogProduct } from '../../../data/entities/catalog'

export class ListProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(limit: number = 24): Promise<CatalogProduct[]> {
    return this.repository.listCatalog(limit)
  }
}


