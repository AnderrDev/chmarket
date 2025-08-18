import type { AdminProductRepository } from '../../repositories/admin/AdminProductRepository'

export class DeleteAdminProductUseCase {
  constructor(private readonly repository: AdminProductRepository) {}

  execute(id: string) {
    return this.repository.remove(id)
  }
}


