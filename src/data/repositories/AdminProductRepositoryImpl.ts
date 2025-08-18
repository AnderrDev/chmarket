import type { AdminProductRepository } from '../../domain/repositories/admin/AdminProductRepository'
import type { AdminProductsDataSource } from '../datasources/AdminProductsDataSource'

export class AdminProductRepositoryImpl implements AdminProductRepository {
  constructor(private readonly ds: AdminProductsDataSource) {}

  list() {
    return this.ds.list()
  }

  upsert(payload: Parameters<AdminProductsDataSource['upsert']>[0]) {
    return this.ds.upsert(payload)
  }

  remove(id: string) {
    return this.ds.remove(id)
  }
}


