import type { ProductRepository } from '../../repositories/catalog/ProductRepository'
import type { CatalogViewRow } from '../../../data/entities/catalog'

export class GetProductBySlugUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(slug: string): Promise<CatalogViewRow | null> {
    return this.repository.getBySlug(slug)
  }
}


