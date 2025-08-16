import type { OrderRepository } from '../../repositories/orders/OrderRepository'
import type { Order, Payment, Item } from '../../../data/entities/order'

export class GetOrderSummaryUseCase {
  constructor(private readonly repository: OrderRepository) {}

  async execute(orderNumber: string, email: string): Promise<{ order: Order; payment: Payment; items: Item[] }> {
    return this.repository.fetchOrderSummary(orderNumber, email)
  }
}


