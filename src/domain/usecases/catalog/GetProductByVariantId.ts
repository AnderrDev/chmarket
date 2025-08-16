import type { ProductRepository } from '../../repositories/catalog/ProductRepository'
import type { CatalogProduct } from '../../../data/entities/catalog'

export class GetProductByVariantIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(variantId: string): Promise<CatalogProduct | null> {
    return this.repository.getByVariantId(variantId)
  }
}


