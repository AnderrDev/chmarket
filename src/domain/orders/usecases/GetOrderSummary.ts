import type { OrderRepository } from '../OrderRepository'
import type { Order, Payment, Item } from '../../../services/orders'

export class GetOrderSummaryUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(orderNumber: string, email: string): Promise<{ order: Order; payment: Payment; items: Item[] }> {
    return this.repository.fetchOrderSummary(orderNumber, email)
  }
}


