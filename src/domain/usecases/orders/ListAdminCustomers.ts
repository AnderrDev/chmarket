import type { AdminCustomerRepository } from '../../repositories/orders/AdminCustomerRepository'

export class ListAdminCustomersUseCase {
  constructor(private readonly repository: AdminCustomerRepository) {}

  execute(params?: { page?: number; pageSize?: number; q?: string }) {
    return this.repository.list(params)
  }
}


