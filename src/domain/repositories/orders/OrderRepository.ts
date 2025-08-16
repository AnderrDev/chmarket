import type { Order, Payment, Item } from '../../../types/order'

export interface OrderRepository {
  fetchOrderSummary(orderNumber: string, email: string): Promise<{ order: Order; payment: Payment; items: Item[] }>
}


