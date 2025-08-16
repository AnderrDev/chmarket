import type { OrderRepository } from '../../domain/repositories/orders/OrderRepository'
import type { Order, Payment, Item } from '../../types/order'
import type { OrdersDataSource } from '../datasources/OrdersDataSource'

export class OrderRepositoryImpl implements OrderRepository {
  constructor(private readonly ds: OrdersDataSource) {}

  fetchOrderSummary(orderNumber: string, email: string): Promise<{ order: Order; payment: Payment; items: Item[] }> {
    return this.ds.fetchOrderSummary(orderNumber, email)
  }
}


