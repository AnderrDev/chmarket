import type { ProductRepository } from '../../repositories/catalog/ProductRepository'
import type { CatalogViewRow } from '../../../data/entities/catalog'

export class GetProductByVariantIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(variantId: string): Promise<CatalogViewRow | null> {
    return this.repository.getByVariantId(variantId)
  }
}


