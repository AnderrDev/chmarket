import type { AdminOrderRepository } from '../../repositories/orders/AdminOrderRepository'

export class UpdateAdminOrderStatusUseCase {
  constructor(private readonly repository: AdminOrderRepository) {}

  fulfill(orderNumber: string) {
    return this.repository.fulfill(orderNumber)
  }

  cancel(orderNumber: string) {
    return this.repository.cancel(orderNumber)
  }
}


