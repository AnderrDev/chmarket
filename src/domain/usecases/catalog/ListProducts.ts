import type { ProductRepository } from '../../repositories/catalog/ProductRepository'
import type { CatalogViewRow } from '../../../data/entities/catalog'

export class ListProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(limit: number = 24): Promise<CatalogViewRow[]> {
    return this.repository.listCatalog(limit)
  }
}


