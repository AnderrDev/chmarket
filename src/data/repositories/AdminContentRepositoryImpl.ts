import type { AdminContentRepository } from '../../domain/repositories/admin/AdminContentRepository'
import type { AdminContentDataSource } from '../datasources/AdminContentDataSource'

export class AdminContentRepositoryImpl implements AdminContentRepository {
  constructor(private readonly ds: AdminContentDataSource) {}

  get(key: string) {
    return this.ds.get(key)
  }
  async set(key: string, data: Record<string, unknown>) {
    await this.ds.set(key, data)
  }
}


