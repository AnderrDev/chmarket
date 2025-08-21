import type { AdminOrderRepository } from '../../repositories/orders/AdminOrderRepository'
import type { Order } from '../../../data/entities/order'

export class ListAdminOrdersUseCase {
  constructor(private readonly repository: AdminOrderRepository) {}

  execute(params?: { page?: number; pageSize?: number; status?: string; payment_status?: string; date_from?: string; date_to?: string; q?: string }) {
    return this.repository.list(params)
  }
}


