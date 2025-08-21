import type { AdminOrderRepository } from '../../repositories/orders/AdminOrderRepository'

export class GetAdminOrderUseCase {
  constructor(private readonly repository: AdminOrderRepository) {}

  execute(orderNumber: string) {
    return this.repository.get(orderNumber)
  }
}


