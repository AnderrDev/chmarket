import type { ProductRepository } from '../../catalog/ProductRepository'
import type { CatalogProduct } from '../../../types/catalog'

export class GetProductBySlugUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(slug: string): Promise<CatalogProduct | null> {
    return this.repository.getBySlug(slug)
  }
}


