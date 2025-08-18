import type { AdminProduct } from '../../../data/entities/admin'
import type { AdminProductRepository } from '../../repositories/admin/AdminProductRepository'

export class ListAdminProductsUseCase {
  constructor(private readonly repository: AdminProductRepository) {}

  execute(): Promise<{ items: AdminProduct[] }> {
    return this.repository.list()
  }
}


