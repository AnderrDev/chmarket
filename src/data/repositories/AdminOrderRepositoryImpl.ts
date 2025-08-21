import type { AdminOrderRepository } from '../../domain/repositories/orders/AdminOrderRepository'
import type { Order, Item } from '../entities/order'
import type { AdminOrdersDataSource } from '../datasources/AdminOrdersDataSource'

export class AdminOrderRepositoryImpl implements AdminOrderRepository {
  constructor(private readonly ds: AdminOrdersDataSource) {}

  list(params?: { page?: number; pageSize?: number; status?: string; q?: string }) {
    return this.ds.list(params)
  }

  get(orderNumber: string) {
    return this.ds.get(orderNumber)
  }

  async fulfill(orderNumber: string) {
    await this.ds.action(orderNumber, 'FULFILL')
  }

  async cancel(orderNumber: string) {
    await this.ds.action(orderNumber, 'CANCEL')
  }
}


