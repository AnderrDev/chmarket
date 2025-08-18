import type { AdminValidationDataSource } from '../../../data/datasources/AdminValidationDataSource'

export class ValidateUniquenessUseCase {
  constructor(private readonly ds: AdminValidationDataSource) {}

  isSlugAvailable(slug: string, excludeProductId?: string) {
    return this.ds.isSlugAvailable(slug, excludeProductId)
  }

  isSkuAvailable(sku: string, excludeVariantId?: string) {
    return this.ds.isSkuAvailable(sku, excludeVariantId)
  }
}


