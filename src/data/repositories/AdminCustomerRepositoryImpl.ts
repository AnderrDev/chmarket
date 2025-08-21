import type { AdminCustomerRepository } from '../../domain/repositories/orders/AdminCustomerRepository'
import type { AdminCustomersDataSource } from '../datasources/AdminCustomersDataSource'

export class AdminCustomerRepositoryImpl implements AdminCustomerRepository {
  constructor(private readonly ds: AdminCustomersDataSource) {}

  list(params?: { page?: number; pageSize?: number; q?: string }) {
    return this.ds.list(params)
  }

  get(email: string) {
    return this.ds.get(email)
  }
}


