import type { AdminCustomerRepository } from '../../repositories/orders/AdminCustomerRepository'

export class GetAdminCustomerUseCase {
  constructor(private readonly repository: AdminCustomerRepository) {}

  execute(email: string) {
    return this.repository.get(email)
  }
}


