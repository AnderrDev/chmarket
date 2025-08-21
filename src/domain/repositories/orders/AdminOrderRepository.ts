import type { Order, Item } from '../../../data/entities/order'

export interface AdminOrderRepository {
  list(params?: { page?: number; pageSize?: number; status?: string; payment_status?: string; date_from?: string; date_to?: string; q?: string }): Promise<{ items: Array<Order & { items_count?: number }>; page: number; pageSize: number; total: number }>
  get(orderNumber: string): Promise<{ order: Order; items: Item[]; discounts?: any[] }>
  fulfill(orderNumber: string): Promise<void>
  cancel(orderNumber: string): Promise<void>
}


