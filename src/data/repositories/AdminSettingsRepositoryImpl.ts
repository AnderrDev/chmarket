import type { AdminSettingsRepository } from '../../domain/repositories/admin/AdminSettingsRepository'
import type { AdminSettingsDataSource } from '../datasources/AdminSettingsDataSource'

export class AdminSettingsRepositoryImpl implements AdminSettingsRepository {
  constructor(private readonly ds: AdminSettingsDataSource) {}
  get(key: string) { return this.ds.get(key) }
  async set(key: string, value: Record<string, unknown>) { await this.ds.set(key, value) }
}


