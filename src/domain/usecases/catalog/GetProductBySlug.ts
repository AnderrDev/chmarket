import type { ProductRepository } from '../../repositories/catalog/ProductRepository'
import type { CatalogProduct } from '../../../data/entities/catalog'

export class GetProductBySlugUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(slug: string): Promise<CatalogProduct | null> {
    return this.repository.getBySlug(slug)
  }
}


