import type { ProductRepository } from '../../catalog/ProductRepository'
import type { CatalogProduct } from '../../../types/catalog'

export class GetProductByVariantIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(variantId: string): Promise<CatalogProduct | null> {
    return this.repository.getByVariantId(variantId)
  }
}


